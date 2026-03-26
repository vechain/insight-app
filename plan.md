# Chrome 66 BigInt Fix — Implementation Plan

## 目标

让 insight-app 在 Chrome 66 上正常运行。根本问题是 `thor-devkit` 通过 `ethers v6` 引入了原生 `BigInt`，而 Chrome 66 不支持 `BigInt`（Chrome 67 才开始支持）。

---

## 当前状态

### 已完成

- [x] 安装 `@vitejs/plugin-legacy@7.2.1`（针对 `chrome >= 66`）
- [x] 修复 `globalThis`（Chrome 71 前不支持，`define: { globalThis: 'window' }`）
- [x] 修复 `__vite_is_modern_browser` 检测（在 `index.html` 中用 `Object.defineProperty` 拦截）
- [x] 安装 `ethers@5.8.0`（纯 JS BigNumber，无原生 BigInt）
- [x] 改写 `Decoded.vue` — 用 `ethers.utils.*`（v5）替代 `thor-devkit/abi`
- [x] 创建 `src/utils/abi.ts` — 基于 `@ethersproject/abi`（v5）的 abi lib
- [x] 创建 `src/shims/thor-devkit-abi.ts` — 匹配 thor-devkit 的 `{ abi }` 导出形状
- [x] 创建 `vitest.config.ts`
- [x] 创建 `src/utils/abi.test.ts` — 完整测试用例（含 ERC20 已知值）
- [x] 更新 `vite.config.ts`：
  - 添加 `replace-thor-devkit-abi` Vite plugin（`resolveId` hook）
  - 移除全局 `'ethers'` alias（之前用 `ethers-shim.mjs` 的方案）
- [x] 删除 `src/ethers-shim.mjs`（旧方案产物）
- [x] 安装 `vitest@4.1.1`
- [x] `package.json` 添加 `"test": "vitest run"`

### 待完成

- [x] 运行 `yarn test` — 验证所有 abi 单元测试通过（15/15）
- [x] 运行 `yarn build` — 验证构建成功，ethers v6 被 tree-shake 掉

---

## 架构说明

### 解决方案思路（最终方案）

用精准的 Vite `resolveId` 插件替换 `thor-devkit` 内部的 `abi.js`，而不是全局覆盖 `'ethers'` 模块。

```
connex-framework → import { abi } from 'thor-devkit'
                 → thor-devkit/esm/index.js: export * from './abi'
                 → [resolveId plugin 拦截 importer 含 thor-devkit/esm/]
                 → src/shims/thor-devkit-abi.ts
                 → src/utils/abi.ts (@ethersproject/abi v5, 无 BigInt)

Decoded.vue      → import { ethers } from 'ethers'
                 → node_modules/ethers (v5, top-level, 无 BigInt)
```

### 为什么不用全局 ethers alias？

之前的方案（`'ethers' → src/ethers-shim.mjs`）需要为 `thor-devkit` 中被 tree-shake 的模块
（`hdnode.js`, `keystore.js`, `mnemonic.js`）添加大量 `undefined` stub export，影响范围过大，
且给 hdnode/keystore/mnemonic 的维护留下隐患。

新方案只替换 `thor-devkit/esm/abi.js` 一个文件，影响最小。

### `src/utils/abi.ts` 实现的方法

| 方法/类 | 调用方 |
|---------|--------|
| `abi.Function` (constructor, `.signature`, `.encode`, `.decode`) | `connex-framework/esm/vendor.js`, `account-visitor.js` |
| `abi.Event` (constructor, `.decode`) | `connex-framework/esm/account-visitor.js` |
| `abi.decodeParameter` | `connex-framework/esm/revert-reason.js` |
| `abi.encodeParameter`, `abi.encodeParameters`, `abi.decodeParameters` | 通用，已实现 |

---

## 文件变更列表

| 文件 | 变更 |
|------|------|
| `src/utils/abi.ts` | **新建** — abi lib |
| `src/utils/abi.test.ts` | **新建** — vitest 测试 |
| `src/shims/thor-devkit-abi.ts` | **新建** — thor-devkit 替换 shim |
| `vitest.config.ts` | **新建** |
| `vite.config.ts` | 添加 resolveId plugin，移除 ethers alias |
| `src/components/Decoded.vue` | 用 ethers v5 重写（已完成） |
| `package.json` | 添加 `"test"` script，安装 vitest |
| `src/ethers-shim.mjs` | **删除** |
| `index.html` | 添加 BigInt shim + `__vite_is_modern_browser` 拦截（已完成） |
| `docs/chrome66-compat.md` | 记录兼容性调查（已完成） |

---

## 下一步

```bash
yarn test    # 验证单元测试
yarn build   # 验证构建 + tree-shaking
```
