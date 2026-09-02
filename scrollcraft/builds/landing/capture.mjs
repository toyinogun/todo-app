// Captures app screenshots for the landing page from the dev server.
// Run: node scrollcraft/builds/landing/capture.mjs  (dev server on :5173)
import { chromium } from 'playwright-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5173/todo-app/app/'
const TASKS = ['Buy milk', 'Book the dentist', 'Reply to Sam']
const shots = [
  { file: 'app-light-desktop.png', vp: { width: 1280, height: 560 }, scheme: 'light' },
  { file: 'app-dark-desktop.png', vp: { width: 1280, height: 560 }, scheme: 'dark' },
  { file: 'app-light-phone.png', vp: { width: 390, height: 600 }, scheme: 'light', mobile: true },
  { file: 'app-dark-phone.png', vp: { width: 390, height: 600 }, scheme: 'dark', mobile: true },
]
const browser = await chromium.launch({ executablePath: CHROME })
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: s.vp, colorScheme: s.scheme, deviceScaleFactor: 2, isMobile: !!s.mobile })
  const page = await ctx.newPage()
  await page.goto(URL)
  for (const t of TASKS) { await page.fill('input[placeholder]', t); await page.keyboard.press('Enter') }
  await page.getByLabel('Mark "Buy milk" done').check()
  await page.screenshot({ path: `src/landing/assets/${s.file}` })
  await ctx.close()
}
await browser.close()
console.log('captured', shots.map((s) => s.file).join(', '))
