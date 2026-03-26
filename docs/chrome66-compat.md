# Chrome 66 兼容性问题调查记录

## 背景

在 Chrome 66（2018-04 发布）上访问应用时报错，无法渲染。本文记录问题根因、调查过程及可行的修复方案。

---

## 已做的工作

### 1. 添加 `@vitejs/plugin-legacy`

安装了 `@vitejs/plugin-legacy@7.2.1`（注意：需与 `vite@7.x` 版本对齐，v8 要求 Vite 8）：

```ts
// vite.config.ts
import legacy from '@vitejs/plugin-legacy'

legacy({
    targets: ['chrome >= 66', 'not dead'],
})
```

构建产物中会生成 `index-legacy-*.js` + `polyfills-legacy-*.js`，现代浏览器走 ES module bundle，旧浏览器走 Babel 降级后的 legacy bundle。

### 2. 修复 `globalThis`（Chrome 71 前不支持）

在 `vite.config.ts` 的 `define` 中替换：

```ts
define: {
    'globalThis': 'window',  // Chrome 66 无 globalThis，window 在浏览器中等价
}
```

### 3. 修复检测机制（Chrome 66 被误判为"现代浏览器"）

`@vitejs/plugin-legacy` 的检测脚本判断"现代浏览器"的条件是：
```js
import.meta.url; import("_").catch(()=>1); (async function*(){})().next()
```

Chrome 66 满足以上三项（ES modules 在 Chrome 61 引入），因此被判定为现代浏览器，加载了现代 bundle，而非 legacy bundle。

在 `index.html` 中添加同步内联脚本（在所有 `<script type="module">` 之前执行），拦截该标志位：

```html
<script>
  if (typeof BigInt === 'undefined') {
    window.BigInt = function BigInt(v) {
      if (typeof v === 'number') return v
      if (typeof v === 'string') {
        var s = v.trim()
        return (s.startsWith('0x') || s.startsWith('-0x'))
          ? parseInt(s, 16)
          : parseInt(s, 10)
      }
      return Number(v)
    }
    window.BigInt.asUintN = function(w, v) { return v >>> 0 }
    window.BigInt.asIntN  = function(w, v) { return v | 0 }

    Object.defineProperty(window, '__vite_is_modern_browser', {
      configurable: true,
      get: function() { return false },
      set: function() {}
    })
  }
</script>
```

> **注意**：此 `BigInt` shim 只能处理小整数初始化（`BigInt(0)`, `BigInt(1)`），不支持 256-bit 算术。见下文。

---

## 根本问题：BigInt（Chrome 67 才支持）

### 来源

| 包 | 原因 |
|----|------|
| `ethers@6.16.0` | ethers v6 完全基于原生 BigInt 重写，**模块初始化时**就执行 `BigInt(0)`, `BigInt(1)` 等常量赋值 |
| `vite-plugin-node-polyfills` buffer shim | `readBigUInt64LE/BE` 等方法使用 BigInt（仅在显式调用时触发） |

### 引入路径

```
insight-app
  └── thor-devkit@2.2.0
        └── ethers@^6.13.0  (当前 6.16.0)
              └── BigInt（模块初始化即触发）
```

### 为什么 tree-shaking 没有移除 ethers

`thor-devkit` 的 `esm/index.js` 第一行是 `export * from './abi'`，而 `abi.js` 直接 import 了 ethers：

```js
import { AbiCoder, Fragment, ParamType } from 'ethers'
const _coder = new AbiCoder()  // 顶层副作用
```

**好消息**：`thor-devkit/package.json` 有 `"sideEffects": false`，只要 insight-app 不 import `abi`，Rollup 可以 tree-shake 掉 `abi.js` 及 ethers v6。

insight-app 实际使用到 `abi` 的只有一处：

- `src/components/Decoded.vue` — `import { abi } from 'thor-devkit'`

---

## 可行的修复方案

### 方案 A：最小改动——升级到 Chrome 67（推荐，若可接受）

BigInt 从 Chrome 67（2018-05）开始支持，与 Chrome 66（2018-04）仅差 6 周。将 legacy target 改为 `chrome >= 67` 即可，无需其他改动。

### 方案 B：替换 `Decoded.vue` 中的 abi 依赖（彻底移除 ethers v6）

安装 `@ethersproject/abi`（ethers v5 ABI 模块，使用纯 JS BigNumber，无原生 BigInt）：

```bash
yarn add @ethersproject/abi
```

在 `Decoded.vue` 中将 `import { abi } from 'thor-devkit'` 替换为基于 `@ethersproject/abi` 的本地包装，或者修改 `thor-devkit` 源码的 `abi.ts`，将：

```ts
import { AbiCoder, Fragment, ParamType } from 'ethers'
```
改为：
```ts
import { AbiCoder, Fragment, ParamType } from '@ethersproject/abi'
```

`@ethersproject/abi` v5.8.0 处于维护模式（无新功能，仅安全补丁），ABI 模块本身无已知 critical CVE。

> tree-shaking 生效后，`ethers@6.x` 将完全从 bundle 中移除，BigInt 问题彻底解决。

### 方案 C：JSBI + Babel transform（不推荐）

使用 `@babel/plugin-transform-bigint` + `jsbi` 将 BigInt 语法转换为 JSBI 调用。

不推荐原因：
- `@babel/plugin-transform-bigint` 是实验性插件
- `@vitejs/plugin-legacy` v7 不暴露自定义 Babel plugins 接口，需要额外编写 Vite 插件
- 256-bit 椭圆曲线运算转换后行为难以验证

---

## 当前 `vite.config.ts` 变更记录

```diff
+ import legacy from '@vitejs/plugin-legacy'

  plugins: [
+   legacy({
+     targets: ['chrome >= 66', 'not dead'],
+   }),
    ...
  ],

  define: {
    ...
+   'globalThis': 'window',
  }
```

依赖变更：
```
+ @vitejs/plugin-legacy@7.2.1   (v8 需要 Vite 8，不兼容)
+ terser@5.x                    (plugin-legacy peer dep)
+ @ethersproject/abi@5.8.0      (已安装，待使用)
```
