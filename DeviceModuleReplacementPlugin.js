// https://github.com/webpack/webpack/blob/master/lib/NormalModuleReplacementPlugin.js
'use strict';

const path = require("path");

class DeviceModuleReplacementPlugin {
  constructor(folder) {
    this.folder = folder;
  }

  resolveByDevice(nmf, result, callback = () => {}) {
    const resolver = nmf.getResolver('normal', result.resolveOptions);
    const request = result.request.split('!');
    const { root, dir, name, ext } = path.parse(request.pop());
    const contextInfo = result.contextInfo || result.resourceResolveData.context;
    const device = contextInfo.compiler.split('.')[0];
    const file = path.format({
      root,
      dir,
      name,
      ext: `.${device}${ext}`
    });

    resolver.resolve(contextInfo, result.context, file, {}, err => {
      if (!err) {
        request.push(file);
        result.request = request.join('!');
      }

      callback();
    });
  }

  apply(compiler) {
    compiler.hooks.normalModuleFactory.tap(
      'DeviceModuleReplacementPlugin',
      nmf => {
        nmf.hooks.beforeResolve.tapAsync('DeviceModuleReplacementPlugin', (result, callback) => {
          if (!result) return callback();
          if (!result.context.startsWith(this.folder)) return callback();
          this.resolveByDevice(nmf, result, callback);
        });

        nmf.hooks.afterResolve.tapAsync('DeviceModuleReplacementPlugin', (result, callback) => {
          if (!result) return callback();
          if (!result.context.startsWith(this.folder)) return callback();
          this.resolveByDevice(nmf, result, callback);
        });
      }
    );
  }
}

module.exports = DeviceModuleReplacementPlugin;
