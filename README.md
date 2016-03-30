# Transync

Transync is a npm module to synchronise translation files. The idea is to make sure a locale file has the same translation keys as a base file. It supports both JSON and YAML files.

```sh
npm install transync --save
```

## Usage (CLI)

```
  Usage: transync [options]

  Options:

    -h, --help         output usage information
    -f, --from [from]  Base version file for sync
    -t, --to [to]      Version file to synchronize
    -q, --quiet        Disable informative output
````

## Usage (Node.js)

```js
var transync = require('transync')

transync({
  from: 'path/to/source.file',
  to: 'path/to/destination.file'
})
```

## Examples

For instance, to make sure that the German locale has the same translation keys as the English one:

```sh
transync --from _data/en.yml --to _data/de.yml --quiet
```

```js
var transync = require('transync')

transync({
  from: '_data/en.yml',
  to: '_data/de.yml',
  quiet: true
})
```
