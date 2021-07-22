const http = require('http');

const server = http.createServer((req, res) => {
  let data = '';
  console.log(`got ${req.method} request`);

  if (req.method === 'GET') {
    return res.end();
  }

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    let body;
    try {
      body = JSON.parse(data);
    } catch {
      body = data;
    }
    console.log(body); // 'Buy the milk'
    res.writeHead(200);
    res.end();
  });
});

server.listen(8000);
