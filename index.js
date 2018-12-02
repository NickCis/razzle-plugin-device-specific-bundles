'use strict';

const fs = require('fs');
const path = require('path');
const DeviceModuleReplacementPlugin = require('./DeviceModuleReplacementPlugin');
const StartServerPlugin = require('@nickcis/start-server-webpack-plugin');

const defaultOptions = {
  devices: ['desktop', 'mobile'],
  alias: 'SSR',
  entry: path.resolve('src/ssr')
};

function web(config, { devices }, webpack) {
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

function eraseHot(dir) {
  if (!fs.existsSync(dir))
    return;

  const hot = /\.hot-update\.js(on)?$/;
  fs.readdirSync(dir)
    .forEach(file => {
      if (file.match(hot))
        fs.unlinkSync(path.join(dir, file));
    });
}

function writeRequireFile(path) {
  fs.writeFileSync(
    path,
`const r = eval('require');
module.exports = r('${path}');
`
  );
}

function writeSSRFile(path, bundles) {
  fs.writeFileSync(
    path,
`const servers = {
${bundles.map(({device, filename}) => `  ${device}: require('./${filename}').default`).join(',\n')},
};

if (module.hot) {
  ${bundles.map(({device, path}) => ` module.hot.accept('${path}', () => {
    servers['${device}'] = require('${path}').default;
  });`).join('\n')}
}

export default servers;`
  );
}

function node(config, { dev, devices, entry }, webpack) {
  const bundles = devices.map(device => {
    const filename = `${device}.server.js`;
    return {
      filename,
      device,
      name: `${device}.server`,
      path: path.join(config.output.path, filename),
    }
  });

  let plugins = config.plugins;

  if (dev) {
    const startServerOptions = config.plugins.find(
      p =>
        p
        && p.constructor
        && p.constructor.name === 'StartServerPlugin'
    ).options;

    plugins = [
      ...config.plugins.filter(
        p =>
          p
          && (
            !p.constructor
            || p.constructor.name !== 'StartServerPlugin'
          )
      ),
      new StartServerPlugin(startServerOptions)
    ];

    eraseHot(config.output.path);
    bundles.forEach(({ path }) => writeRequireFile(path));
  }

  writeSSRFile(path.join(config.output.path, 'servers.js'), bundles);

  return [
    ...bundles.map(({ device, name, filename }) => ({
      ...config,
      name,
      plugins: [
        ...plugins.filter(plugin => !(plugin instanceof webpack.HotModuleReplacementPlugin)),
        new webpack.DefinePlugin({
          'process.device': JSON.stringify(device),
        }),
        new DeviceModuleReplacementPlugin(path.resolve('./src')),
      ],
      entry,
      output: {
        ...config.output,
        filename,
      }
    })),
    {
      ...config,
      externals: [
        ...config.externals,
        ...(dev
          ? []
          : bundles.map(({ filename }) => `./${filename}`)
        ),
      ],
      plugins: [
        ...plugins,
        new webpack.DefinePlugin({
          'process.devices': JSON.stringify(devices)
        })
      ],
    },
  ];
}

function modify(config, { target, dev }, webpack, userOptions = {}) {
  const options = {
    ...defaultOptions,
    ...userOptions
  };

  if (target === 'web') {
    return web(config, options, webpack);
  }

  return node(config, { ...options, dev }, webpack);
}

module.exports = modify;
