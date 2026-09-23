// Production-asset server for starter browser tests; not a deployment server.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(process.argv[2]);
const types = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".png": "image/png",
};
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    const file = path.resolve(
      root,
      `.${pathname === "/" ? "/index.html" : pathname}`,
    );
    if (!file.startsWith(`${root}${path.sep}`)) {
      res.writeHead(403).end();
      return;
    }
    const content = await readFile(file);
    res
      .writeHead(200, {
        "Content-Type": types[path.extname(file)] ?? "application/octet-stream",
      })
      .end(content);
  } catch {
    res.writeHead(404).end();
  }
}).listen(Number(process.argv[3]), "127.0.0.1");
