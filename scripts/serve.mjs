import { createReadStream } from 'node:fs'
import { realpath, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'))
const port = Number.parseInt(process.env.PORT ?? '4173', 10)
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
}

createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method ?? 'GET')) {
    response.writeHead(405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }).end('Method not allowed')
    return
  }

  try {
    const requestUrl = new URL(request.url ?? '/', 'http://127.0.0.1')
    const decodedPath = decodeURIComponent(requestUrl.pathname)
    const requested = decodedPath === '/' ? '/site/index.html' : decodedPath
    let filePath = path.resolve(root, `.${requested}`)

    if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    const info = await stat(filePath)
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html')
    const resolvedFile = await realpath(filePath)
    if (resolvedFile !== root && !resolvedFile.startsWith(`${root}${path.sep}`)) {
      response.writeHead(403).end('Forbidden')
      return
    }
    const fileInfo = await stat(resolvedFile)
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(resolvedFile)] ?? 'application/octet-stream',
      'Content-Length': fileInfo.size,
      'Cache-Control': 'no-store',
    })
    if (request.method === 'HEAD') response.end()
    else createReadStream(resolvedFile).pipe(response)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found')
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`ASIG catalogue available at http://127.0.0.1:${port}/site/`)
})
