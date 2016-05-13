var fs = require('fs');
var assert = require('assert');
var exec = require('child_process').execSync;
var transync = require('../src');
var yaml = require('js-yaml');
var path = require('path');

function createTestFile (name, content) {
  content = path.extname(name) === '.json'
    ? JSON.stringify(content, null, 2)
    : yaml.safeDump(content);
  
  fs.writeFileSync('./tests/' + name, content, 'utf8');
}

function readTestFile (name) {
  return yaml.safeLoad(fs.readFileSync('tests/' + name, 'utf8'), { json: true });
}

describe('The Node API', function () {
  var dummyData = {
    firstName: 'Hugo',
    lastName: 'Giraudel',
    age: 24
  };

  // Clean all existing file before each test
  beforeEach(function () {
    exec('rm -f tests/en.json');
    exec('rm -f tests/de.json');
    exec('rm -f tests/en.yml');
    exec('rm -f tests/de.yml');
  });

  it('should create the --to file if doesn’t exist', function () {
    createTestFile('en.json', dummyData);
    transync({ from: 'tests/en.json', to: 'tests/de.json' });
    assert.doesNotThrow(function () {
      fs.readFileSync('tests/de.json', 'utf8');
    }, Error);
  });

  it('should have the same keys in synced YAML file', function () {
    createTestFile('en.yml', dummyData);
    transync({ from: 'tests/en.yml', to: 'tests/de.yml' });
    assert.deepEqual(readTestFile('en.yml'), readTestFile('de.yml'));
  });

  it('should have the same keys in synced JSON file', function () {
    createTestFile('en.json', dummyData);
    transync({ from: 'tests/en.json', to: 'tests/de.json' });
    assert.deepEqual(readTestFile('en.json'), readTestFile('de.json'));
  });

  it('should not override existing keys', function () {
    createTestFile('en.json', dummyData);
    transync({ from: 'tests/en.json', to: 'tests/de.json' });
    createTestFile('de.json', Object.assign({}, readTestFile('de.json'), { age: 42 }));
    transync({ from: 'tests/en.json', to: 'tests/de.json' });
    assert.equal(readTestFile('de.json').age, 42);
  });

  it('should deep extend', function () {
    createTestFile('en.json', Object.assign({}, dummyData, {
      languages: { english: 'fluent', french: 'fluent' }
    }));
    transync({ from: 'tests/en.json', to: 'tests/de.json' });
    var de = readTestFile('de.json');
    de.languages.french = 'native';
    createTestFile('de.json', de);
    transync({ from: 'tests/en.json', to: 'tests/de.json' });
    assert.equal(readTestFile('de.json').languages.french, 'native');
  });
});
