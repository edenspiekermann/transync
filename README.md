# Transync

Transync is a npm module to synchronise translation files. The idea is to make sure a locale file has the same translation keys than a base file. It supports both JSON and YAML files.

```sh
npm install transync --save
```

## Usage

```
  Usage: transync [options]

  Options:

    -h, --help         output usage information
    -f, --from [from]  Base version file for sync
    -t, --to [to]      Version file to synchronize
    -q, --quiet        Disable informative output
````

## Examples

For instance, to make sure that the German locale has the same translation keys as the English one:

```sh
transync --from _data/en.yml --to _data/de.yml
```
