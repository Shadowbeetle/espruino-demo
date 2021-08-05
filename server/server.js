const Wifi = require('Wifi');
const http = require('http');

const SSID = 'RisingStack';
const PASSWORD = 'classlessFreedom!';
const PORT = 8000;
const LED = NodeMCU.D1;

const CONFIG_SERVER_HOST = 'espruino-demo-config-server.herokuapp.com';
const CONFIG_SERVER_PROTOCOL = 'https';
const CONFIG_SERVER_PORT = 0;

LED.mode('output');

let isLedOn = false;

digitalWrite(LED, isLedOn);

Wifi.connect(SSID, { password: PASSWORD }, function (err) {
  if (!err) {
    startServer(PORT);
    sendConfig(JSON.stringify(Wifi.getIP()));
  }
  console.log('connected? err=', err, 'info=', Wifi.getIP());
});

function startServer(port) {
  http.createServer(handleRequest).listen(port);
  console.log('Server is listening at port', port);
}

function handleRequest(req, res) {
  console.log('got request');
  isLedOn = !isLedOn;
  digitalWrite(LED, isLedOn);
  console.log('is led on?', isLedOn);

  res.writeHead(200);

  const message = isLedOn ? 'on' : 'off';

  res.end(message);
}

function sendConfig(payload) {
  const httpOptions = {
    host: CONFIG_SERVER_HOST,
    port: CONFIG_SERVER_PORT ? CONFIG_SERVER_PORT : undefined,
    path: '/',
    protocol: CONFIG_SERVER_PROTOCOL,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
    },
  };

  console.log('sending config');

  const req = http.request(httpOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('close', (hadError) => {
      console.log('CONFIG SERVER REQEST ENDED WITHOUT ERROR>', !hadError);
      console.log('CONFIG SERVER RESPONSE>', data);
      console.log(res.statusCode, res.statusMessage);
    });

    res.on('error', (err) => console.log('CONFIG SERVER REQUEST ERROR>', err));
  });

  req.on('error', (err) => console.log('CONFIG SERVER REQUEST ERROR>', err));

  req.end(payload);
}
