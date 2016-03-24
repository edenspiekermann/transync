var assert = require('assert');
var fs = require('fs');
var exec = require('child_process').execSync;
var yaml = require('js-yaml');

describe('The transync script', function () {
  it('should create the --to file if doesn’t exist', function () {
    exec('./bin/transync --from tests/en.yml --to tests/de.yml');

    assert.doesNotThrow(function () {
      fs.readFileSync('tests/de.yml', 'utf8');
    }, Error);
  });

  it('should have the same keys in synced Yaml file', function () {
    exec('./bin/transync --from tests/en.yml --to tests/de.yml');

    var enContent = fs.readFileSync('tests/en.yml', 'utf8');
    var deContent = fs.readFileSync('tests/de.yml', 'utf8');
    var enKeys = Object.keys(yaml.safeLoad(enContent, { json: true }));
    var deKeys = Object.keys(yaml.safeLoad(deContent, { json: true }));

    assert.equal(enKeys.length, deKeys.length);
    assert.deepEqual(enKeys, deKeys);
  });

  it('should have the same keys in synced Json file', function () {
  	exec('./bin/transync --from tests/en.json --to tests/de.json');

    var enContent = fs.readFileSync('tests/en.json', 'utf8');
    var deContent = fs.readFileSync('tests/de.json', 'utf8');
    var enKeys = Object.keys(JSON.parse(enContent));
    var deKeys = Object.keys(JSON.parse(deContent));

    assert.equal(enKeys.length, deKeys.length);
    assert.deepEqual(enKeys, deKeys);
  });

  it('should remove keys not present in from file', function () {
    var enContent = fs.readFileSync('tests/en.yml', 'utf8');
    enContent = yaml.safeLoad(enContent, { json: true });
    delete enContent.foo
    enContent = yaml.safeDump(enContent);
    fs.writeFileSync('tests/en2.yml', enContent, 'utf8');

    exec('./bin/transync --from tests/en2.yml --to tests/de.yml');

    deContent = fs.readFileSync('tests/de.yml', 'utf8');
    var deObj = yaml.safeLoad(deContent, { json: true });

    assert.equal(deObj.foo, undefined);

    //remove the test file again.
    fs.unlinkSync('tests/en2.yml');
  });

  it('should not override existing keys', function () {
    var deContent = fs.readFileSync('tests/de.yml', 'utf8');
    deContent = yaml.safeLoad(deContent, { json: true });
    deContent.foo = 42;
    deContent = yaml.safeDump(deContent);
    fs.writeFileSync('tests/de.yml', deContent, 'utf8');

    exec('./bin/transync --from tests/en.yml --to tests/de.yml');

    deContent = fs.readFileSync('tests/de.yml', 'utf8');
    var deObj = yaml.safeLoad(deContent, { json: true });

    assert.equal(deObj.foo, 42);
  });
});
