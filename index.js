const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 3000;

const server = http.createServer((req, res) => {
  // Serve the index.html file when the root is accessed
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
      if (err) {
        res.statusCode = 500;
        res.end('Error reading the index.html file');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html');
      res.end(data);
    });
  } else {
    // Serve other static assets (CSS, JS, etc.)
    const filePath = path.join(__dirname, req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/plain';

    if (extname === '.html') {
      contentType = 'text/html';
    } else if (extname === '.css') {
      contentType = 'text/css';
    } else if (extname === '.js') {
      contentType = 'application/javascript';
    } else if (extname === '.png') {
      contentType = 'image/png';
    } else if (extname === '.jpg' || extname === '.jpeg') {
      contentType = 'image/jpeg';
    }

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.statusCode = 404;
        res.end(`Error: ${err.code} - ${filePath} not found`);
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', contentType);
        res.end(content);
      }
    });
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
