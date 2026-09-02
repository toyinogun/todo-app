// Keyboard order and scripts off, against the served build. Run after serve.mjs.
import { chromium } from 'playwright-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:4500/todo-app/'
const browser = await chromium.launch({ executablePath: CHROME })

// Scripts off: the headline, the lines, and the Open link are real HTML.
const off = await browser.newContext({ javaScriptEnabled: false })
const p1 = await off.newPage(); await p1.goto(URL)
const text = await p1.locator('main').innerText()
for (const line of ['To do', 'A to do list that stays on your device.', 'Your list is saved in this browser and never leaves it.', 'No account, no server, nothing to sign up for.']) {
  if (!text.includes(line)) throw new Error('scripts off: missing ' + line)
}
const visible = await p1.locator('main [data-sc-in]').first().evaluate((el) => getComputedStyle(el).opacity)
if (visible !== '1') throw new Error('scripts off: content hidden, opacity ' + visible)
const hrefs = await p1.locator('a:text("Open the app")').evaluateAll((as) => as.map((a) => a.getAttribute('href')))
if (hrefs.length < 1 || hrefs.some((h) => h !== '/todo-app/app/')) throw new Error('Open link wrong: ' + hrefs)
await p1.screenshot({ path: 'lab/scripts-off.png', fullPage: true })
await off.close()

// Keyboard: tab through, record the order, check every stop is visible and has a name.
const on = await browser.newContext({ viewport: { width: 1280, height: 800 } })
const p2 = await on.newPage(); await p2.goto(URL); await p2.waitForTimeout(800)
const order = []
for (let i = 0; i < 30; i++) {
  await p2.keyboard.press('Tab'); await p2.waitForTimeout(500)
  const info = await p2.evaluate(() => {
    const el = document.activeElement
    if (!el || el === document.body) return null
    const r = el.getBoundingClientRect()
    const op = Number(getComputedStyle(el).opacity)
    const name = el.getAttribute('aria-label') || (el.labels && el.labels[0] && el.labels[0].textContent.trim()) || el.textContent.trim()
    const ring = getComputedStyle(el).outlineStyle
    return { tag: el.tagName, name: name.slice(0, 40), onScreen: r.top >= 0 && r.bottom <= innerHeight, opacity: op, ring }
  })
  if (!info) break
  order.push(info)
}
console.log(order.map((o, i) => `${i + 1}. ${o.tag} "${o.name}" onScreen=${o.onScreen} opacity=${o.opacity} outline=${o.ring}`).join('\n'))
const bad = order.filter((o) => !o.name || o.opacity < 0.85)
if (bad.length) throw new Error('keyboard: unlabelled or invisible stops ' + JSON.stringify(bad))
// Demo isolation: tick, then check localStorage.
await p2.getByLabel('Mark "Book the dentist" done').check()
const stored = await p2.evaluate(() => localStorage.getItem('todo:v1'))
if (stored !== null) throw new Error('demo wrote localStorage')
await on.close(); await browser.close()
console.log('scripts off OK, keyboard OK, demo wrote nothing')
