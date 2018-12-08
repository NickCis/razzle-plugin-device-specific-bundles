# razzle-plugin-device-specific-bundles

This package contains a plugin for creating device specific with Razzle.

See the [example]('./example').

## Usage in Razzle Projects

```
yarn add --dev razzle-plugin-device-specific-bundles
```

Using the plugin with the default options

```js
// razzle.config.js

module.exports = {
  plugins: ['device-specific-bundles'],
};
```

### With custom options:

```js
// razzle.config.js

module.exports = {
  plugins: [
    {
      name: 'device-specific-bundles',
      options: {
        devices: ['desktop', 'mobile'],
        entry: 'ssr.js',
        alias: 'SSR'
      },
    },
  ],
};
```

## Options

**devices: _array_** (defaults: `['desktop', 'mobile']`)

An array with all the enabled devices

**entry: _string_** (defaults: `ssr.js`)

Entry point (relative to the `src` folder) of the server side rendering function file.

**alias: _string_** (defaults: `SSR`)

Alias used to include in the server (`src/index.js`) entry point the device specific server side rendering functions.

## Considerations

Razzle comes with a `react-dev-utils` version that doesn't support webpack's multicompiler output, a newer version must be loaded using the [selective version resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/).
