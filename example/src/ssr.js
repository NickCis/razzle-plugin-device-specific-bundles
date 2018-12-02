import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

const manifest = require(process.env.RAZZLE_ASSETS_MANIFEST);
const assets = Object.entries(manifest)
  .reduce(
    (assets, [key, value]) => {
      const [device, k] = key.split('.');
      if (device === process.device)
        assets[k] = value;
      return assets;
    },
    {}
  );

const render = (req, res) => {
  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );

  if (context.url) {
    res.redirect(context.url);
  } else {
    res.status(200).send(
      `<!doctype html>
  <html lang="">
  <head>
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet='utf-8' />
      <title>Welcome to Razzle: ${process.device}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${assets.client.css
        ? `<link rel="stylesheet" href="${assets.client.css}">`
        : ''}
      ${process.env.NODE_ENV === 'production'
        ? `<script src="${assets.client.js}" defer></script>`
        : `<script src="${assets.client.js}" defer crossorigin></script>`}
  </head>
  <body>
      <div id="root">${markup}</div>
  </body>
  </html>`
    );
  }
};

export default render;
