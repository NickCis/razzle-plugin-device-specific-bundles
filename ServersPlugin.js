'use strict';

const fs = require('fs');

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

function writeRequireFile(path) {
  fs.writeFileSync(
    path,
`const r = eval('require');
module.exports = r('${path}');
`
  );
}


class ServersPlugin {
  constructor(path, bundles, dev) {
    this.path = path;
    this.bundles = bundles;
    this.dev = dev;

    this.hasWritten = false;
  }

  apply(compiler) {
    compiler.hooks.compile.tap('ServersPlugin', () => {
      if (this.hasWritten)
        return;
      writeSSRFile(this.path, this.bundles);

      if (this.dev) {
        this.bundles.forEach(({ path }) => writeRequireFile(path));
      }

      this.hasWritten = true;
    });
  }
}

module.exports = ServersPlugin;
