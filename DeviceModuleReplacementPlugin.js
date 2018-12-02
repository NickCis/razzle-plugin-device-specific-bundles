// https://github.com/webpack/webpack/blob/master/lib/NormalModuleReplacementPlugin.js
'use strict';

const path = require("path");

class DeviceModuleReplacementPlugin {
  constructor(folder) {
    this.folder = folder;
  }

  resolveByDevice(nmf, result, callback = () => {}) {
    const resolver = nmf.getResolver('normal', result.resolveOptions);
    const { root, dir, name, ext } = path.parse(result.request);
    const contextInfo = result.contextInfo || result.resourceResolveData.context;
    const device = contextInfo.compiler.split('.')[0];
    const request = path.format({
      root,
      dir,
      name,
      ext: `.${device}${ext}`
    });
    const file = request.split('!').pop();

    resolver.resolve(contextInfo, result.context, file, {}, err => {
      if (!err) {
        result.request = request;
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
