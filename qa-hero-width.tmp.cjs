const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawn, spawnSync } = require('node:child_process')
const { setTimeout: delay } = require('node:timers/promises')

const url = 'http://127.0.0.1:5187'
const tempRoot = fs.realpathSync(os.tmpdir())
const profile = fs.mkdtempSync(path.join(tempRoot, 'poster-width-'))
const server = spawn(process.env.ComSpec, ['/d', '/s', '/c', 'npm run dev -- --host 127.0.0.1 --port 5187 --strictPort'], { stdio: 'inherit', windowsHide: true })
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0',
  '--user-data-dir=' + profile, 'about:blank',
], { stdio: 'ignore', windowsHide: true })
let socket

async function until(check) {
  for (let attempt = 0; attempt < 120; attempt++) {
    try {
      const value = await check()
      if (value) return value
    } catch {}
    await delay(100)
  }
  throw new Error('Timed out waiting for ' + check)
}

async function verify() {
  await until(async () => (await fetch(url)).ok)
  const port = await until(() => fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split(/\r?\n/)[0])
  const target = await until(async () => (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(tab => tab.type === 'page'))
  socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.onopen = resolve
    socket.onerror = reject
  })
  let nextId = 0
  const pending = new Map()
  socket.onmessage = event => {
    const response = JSON.parse(event.data)
    const request = pending.get(response.id)
    if (!request) return
    pending.delete(response.id)
    if (response.error) request.reject(new Error(response.error.message))
    else request.resolve(response.result)
  }
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  const evaluate = async fn => {
    const response = await send('Runtime.evaluate', { expression: `(${fn})()`, awaitPromise: true, returnByValue: true })
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception.description)
    return response.result.value
  }

  await send('Page.navigate', { url })
  await until(() => evaluate(() => Boolean(document.querySelector('#poster-title'))))
  await evaluate(async () => {
    await document.fonts.load('700 50px "Poster Handjet"')
    await Promise.all([...document.querySelectorAll('main img')].map(image => image.decode()))
  })
  await delay(1100)
  const near = (a, b) => assert.ok(Math.abs(a - b) < 0.1, `${a} ≠ ${b}`)
  const sizes = [375, 768, 1440, 1920].flatMap(width => [800, 900, 1080].map(height => [width, height]))
  sizes.push([375, 667], [768, 1024], [2560, 900])
  for (const [width, height] of sizes) {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    const result = await evaluate(() => {
      const hero = document.querySelector('main section')
      const grass = hero.querySelector('.bg-repeat-x')
      const title = document.querySelector('#poster-title')
      return {
        hero: hero.getBoundingClientRect().toJSON(), grass: grass.getBoundingClientRect().toJSON(),
        width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
        title: title.textContent, colors: [...title.querySelectorAll('[data-glyph]')].map(el => getComputedStyle(el).color),
      }
    })
    near(result.hero.left, 0)
    near(result.hero.right, width)
    near(result.hero.height, Math.min(height, width * 9 / 16))
    near(result.hero.top, (height - result.hero.height) / 2)
    near(result.grass.left, 0)
    near(result.grass.right, width)
    near(result.grass.bottom, result.hero.bottom)
    assert.equal(result.width, width)
    assert.equal(result.height, height)
    assert.equal(result.title, 'THEEXCHANGE')
    assert.deepEqual([...new Set(result.colors)], ['rgb(162, 242, 85)', 'rgb(255, 255, 255)'])
    console.log(`${width} × ${height}: full-width hero and grass, ${result.hero.height.toFixed(2)} px tall, no overflow`)

    if ([[375, 667], [768, 1024], [1440, 800], [1920, 800]].some(([w,h]) => w === width && h === height)) {
      const screenshot = await send('Page.captureScreenshot', { format: 'png' })
      fs.writeFileSync(`qa-hero-width-${width}.tmp.png`, Buffer.from(screenshot.data, 'base64'))
    }
  }
}

verify().catch(error => {
  console.error(error)
  process.exitCode = 1
}).finally(async () => {
  socket?.close()
  for (const child of [chrome, server]) {
    if (child.pid && child.exitCode === null) {
      spawnSync('taskkill.exe', ['/pid', String(child.pid), '/t', '/f'], { windowsHide: true, stdio: 'ignore' })
    }
  }
  const resolvedProfile = fs.realpathSync(profile)
  assert.equal(path.dirname(resolvedProfile), tempRoot)
  assert.ok(path.basename(resolvedProfile).startsWith('poster-width-'))
  fs.rmSync(resolvedProfile, { recursive: true, force: true, maxRetries: 4, retryDelay: 100 })
  await assert.rejects(() => fetch(url))
  console.log('Dev server stopped')
})
