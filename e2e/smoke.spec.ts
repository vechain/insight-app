import { test, expect } from '@playwright/test'

// All tests run against the mainnet network (/#/main)
const NET = '/main'
// Allow generous timeout for mainnet data fetches
const DATA_TIMEOUT = 30_000

test.beforeEach(async ({ page }) => {
    // Fail immediately on uncaught JS exceptions (e.g. require is not defined)
    page.on('pageerror', err => { throw err })
})

test('home: bandwidth chart, recent blocks and transfers render', async ({ page }) => {
    await page.goto(`/#${NET}`)

    // Bandwidth chart canvas is rendered
    await expect(page.locator('canvas')).toBeVisible({ timeout: DATA_TIMEOUT })

    // Recent blocks: stack-item cards appear once recentBlocks loads
    await expect(page.locator('.stack-item').first()).toBeVisible({ timeout: DATA_TIMEOUT })

    // Recent transfers: list items appear once recentTransfers loads
    await expect(page.locator('.list-group-item').first()).toBeVisible({ timeout: DATA_TIMEOUT })
})

test('block: detail page renders block data', async ({ page }) => {
    await page.goto(`/#${NET}`)

    // Click first block link from recent blocks section
    const blockLink = page.locator('.stack-item a[href*="/blocks/"]').first()
    await expect(blockLink).toBeVisible({ timeout: DATA_TIMEOUT })
    await blockLink.click()

    // Block ID (text-monospace hash) appears — confirms block data loaded
    await expect(page.locator('.text-monospace').first()).toBeVisible({ timeout: DATA_TIMEOUT })
})

test('tx: detail page renders tx data', async ({ page }) => {
    await page.goto(`/#${NET}`)

    // Recent transfers section has direct tx links — use those
    const txLink = page.locator('a[href*="/txs/"]').first()
    await expect(txLink).toBeVisible({ timeout: DATA_TIMEOUT })
    await txLink.click()

    // Tx ID (text-monospace hash) appears — confirms tx data loaded
    await expect(page.locator('.text-monospace').first()).toBeVisible({ timeout: DATA_TIMEOUT })
})

test('account: detail page renders account data', async ({ page }) => {
    await page.goto(`/#${NET}`)

    // Account links appear in recent blocks (block signer) and recent transfers (from/to)
    const accountLink = page.locator('a[href*="/accounts/"]').first()
    await expect(accountLink).toBeVisible({ timeout: DATA_TIMEOUT })
    await accountLink.click()

    // Card header and text-monospace address content appear
    await expect(page.locator('.card-header').first()).toBeVisible({ timeout: DATA_TIMEOUT })
    await expect(page.locator('.text-monospace').first()).toBeVisible({ timeout: DATA_TIMEOUT })
})
