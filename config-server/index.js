const http = require('http');

PORT = process.env.PORT || 8080;
let serverNetworkConfig = { ip: null };

const server = http.createServer((req, res) => {
  console.log(`Got ${req.method} request`);
  switch (req.method) {
    case 'POST':
      return onPostIP(req, res);
    case 'GET':
      return onGetIP(req, res);
    default:
      return res.writeHead(405, 'Method not allowed');
  }
});

function onPostIP(req, res) {
  let data = '';
  console.log(`got ${req.method} request`);

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    let body;
    try {
      body = JSON.parse(data);
      if (!body.ip) {
        console.error('Missing ip', body);
        res.writeHead(400);
        return res.end('Missing ip');
      }
      console.log(body);
    } catch (err) {
      console.error({ err, data });
      res.writeHead(500);
      return res.end();
    }
    serverNetworkConfig = body;
    res.writeHead(200);
    return res.end();
  });
}

function onGetIP(req, res) {
  if (!serverNetworkConfig || !serverNetworkConfig.ip) {
    res.writeHead(204);
    return res.end();
  }

  const { ip } = serverNetworkConfig;
  if (ip) {
    res.writeHead(200);
    return res.end(ip);
  } else {
    res.writeHead(500);
    return res.end();
  }
}

server.listen(PORT, (err) => {
  if (err) {
    throw err;
  }

  console.log(`Server is listening at ${PORT}`);
});
