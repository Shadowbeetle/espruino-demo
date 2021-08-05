const Wifi = require('Wifi');
const http = require('http');

const SSID = 'RisingStack';
const PASSWORD = 'classlessFreedom!';
const PORT = 8000;
let host;

const CONFIG_SERVER_HOST = 'espruino-demo-config-server.herokuapp.com';
const CONFIG_SERVER_PROTOCOL = 'https';
const CONFIG_SERVER_PORT = 0;

const BUTTON = NodeMCU.D1;

BUTTON.mode('input_pullup');

Wifi.connect(SSID, { password: PASSWORD }, (err) => {
  if (!err) {
    getConfig();
    setWatch(handlePush, BUTTON, {
      repeat: true,
      edge: 'falling',
      debounce: 25,
    });
  }
  console.log('connected? err=', err, 'info=', Wifi.getIP());
});

function handlePush(e) {
  if (!host) {
    getConfig();
  }
  const req = http.get(`http://${host}:${PORT}`, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('close', (hadError) => {
      console.log('HTTP>', data);
    });

    res.on('error', (err) => {
      console.log('HTTP ERROR>', err);
    });
  });

  req.on('error', (err) => {
    console.log('HTTP ERROR>', err);
  });
}

function getConfig() {
  console.log('getting config');

  const req = http.get(
    `${CONFIG_SERVER_PROTOCOL}://${CONFIG_SERVER_HOST}${
      CONFIG_SERVER_PORT ? ':' + CONFIG_SERVER_PORT : ''
    }/`,
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('close', (hadError) => {
        console.log('CONFIG SERVER REQEST ENDED WITHOUT ERROR>', !hadError);
        console.log('CONFIG SERVER RESPONSE>', data);
        console.log(res.statusCode, res.statusMessage);
      });

      res.on('error', (err) =>
        console.log('CONFIG SERVER REQUEST ERROR>', err)
      );
    }
  );

  req.on('error', (err) => console.log('CONFIG SERVER REQUEST ERROR>', err));
}
