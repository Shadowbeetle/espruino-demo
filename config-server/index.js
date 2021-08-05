const http = require('http');

PORT = process.env.PORT || 8080;
let serverNetworkConfig;

const server = http.createServer((req, res) => {
  console.log(`Got ${req.method} request`);
  switch (req.method) {
    case 'POST':
      return onPostIP(req, res);
    case 'GET':
      return onGetIP(req, res);
    default:
      return res.writeHead(400, 'method not allowed');
  }
});

function onPostIP(req, res) {
  let data = '';
  console.log(`got ${req.method} request`);

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    try {
      serverNetworkConfig = JSON.parse(data);
      console.log(serverNetworkConfig);
    } catch (err) {
      console.error({ err, data });
    }
    res.writeHead(200);
    return res.end();
  });
}

function onGetIP(req, res) {
  const ip = serverNetworkConfig.ip;
  if (ip) {
    res.writeHead(200);
    return res.end(ip);
  } else {
    res.writeHead(500);
    res.end();
  }
}

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Server is listening at ${PORT}`);
});
