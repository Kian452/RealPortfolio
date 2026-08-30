const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT || 8080;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".pdf": "application/pdf",
};

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split("?")[0].split("#")[0]);
  const resolved = path.normalize(path.join(root, decoded));
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

function isFile(candidate) {
  try {
    return fs.statSync(candidate).isFile();
  } catch {
    return false;
  }
}

// Resolves a requested path to an actual file on disk. Handles exact
// matches, "clean URLs" without a .html extension (Railway's edge strips
// it for browser navigations before forwarding the request), and
// directory index files. The .html candidate is checked before treating
// the bare path as a directory, since e.g. /projects must resolve to
// projects.html rather than the unrelated projects/ folder.
function resolveFile(urlPath) {
  if (urlPath === "/" || urlPath === "") {
    return path.join(ROOT, "index.html");
  }

  const base = path.join(ROOT, urlPath);
  const candidates = [base, `${base}.html`, path.join(base, "index.html")];

  for (const candidate of candidates) {
    if (isFile(candidate)) return candidate;
  }
  return null;
}

const server = http.createServer((req, res) => {
  const requestPath = safeJoin(ROOT, req.url) ? decodeURIComponent(req.url.split("?")[0].split("#")[0]) : null;

  if (requestPath === null) {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }

  const filePath = resolveFile(requestPath);

  if (!filePath) {
    fs.readFile(path.join(ROOT, "404.html"), (notFoundErr, notFoundData) => {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(notFoundErr ? "404 Not Found" : notFoundData);
    });
    return;
  }

  fs.readFile(filePath, (readErr, data) => {
    if (readErr) {
      res.writeHead(500);
      res.end("Internal server error");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serving ${ROOT} on port ${PORT}`);
});
