# razzle-plugin-device-specific-bundles

This package contains a plugin for creating device specific with Razzle

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
        entry: 'ssr.js'
      },
    },
  ],
};
```

## Options

**devices: _array_** (defaults: `['desktop', 'mobile']`)

**entry: _string_** (defaults: `ssr.js`)

