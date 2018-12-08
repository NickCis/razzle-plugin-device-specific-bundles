import http from 'http';
import express from 'express';
import modules from 'SSR';

const server = http.createServer(
  express()
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
    .get('/*', (req, res) => {
      const device = process.devices[Math.floor(Math.random() * process.devices.length)];
      modules[device](req, res);
    })
);

server.listen(process.env.PORT || 3000);

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');
}
