const Wifi = require('Wifi');
const http = require('http');

const SSID = 'RisingStack';
const PASSWORD = 'classlessFreedom!';
const PORT = 8000;
const HOST = '';

const BUTTON = NodeMCU.D1;

BUTTON.mode('input_pullup');

Wifi.connect(SSID, { password: PASSWORD }, (err) => {
  if (!err) {
    setWatch(handlePush, BUTTON, {
      repeat: true,
      edge: 'falling',
      debounce: 25,
    });
  }
  console.log('connected? err=', err, 'info=', Wifi.getIP());
});

function handlePush(e) {
  const req = http.get(`http://${HOST}:${PORT}`, (res) => {
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
