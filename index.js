'use strict';

const path = require('path');
const WebpackConfigHelpers = require('razzle-dev-utils/WebpackConfigHelpers');
const Helpers = new WebpackConfigHelpers(process.cwd());

const defaultOptions = {
  devices: ['desktop', 'mobile'],
  entry: path.resolve('src/ssr')
};

function web(config, { devices, webpack }) {
  const clients = devices.map(device => ({
    ...config,
    name: `${device}.client`,
    entry: {
      [`${device}.client`]: config.entry.client,
    },
    output: {
      ...config.output,
      filename: config.output.filename.replace('bundle', `${device}.bundle`),
      chunkFilename: config.output.chunkFilename.replace('[name]', `${device}.[name]`),
    },
    plugins: [
      ...config.plugins,
      new webpack.DefinePlugin({
        'process.device': JSON.stringify(device),
      }),
      new DeviceModuleReplacementPlugin(path.resolve('./src')),
    ],
  }));

  clients.devServer = config.devServer;

  return clients;
}

function node(config, { dev, devices }, webpack) {
  const bundles = devices.map(device => {
    const filename = `${device}.server.js`;
    return {
      filename,
      device,
      name: `${device}.server`,
      path: path.join(config.output.path, filename),
    }
  });

  if (dev) {
  }
}

function modify(config, { target, dev }, webpack, userOptions) {
  const options = Object.assing({}, defaultOptions, userOptions);

  if (target === 'web') {
    return web(config, options, webpack);
  }

  return node(config, { ...options, dev }, webpack);
}

module.exports = modify;
