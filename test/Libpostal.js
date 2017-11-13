const tape = require('tape');
const Libpostal = require('../src/Libpostal');

tape('tests', test => {
  test.test('getName should return \'libpostal\'', (t) => {
    const configBlob = {
      url: 'http://localhost:1234',
      timeout: 17,
      retries: 19
    };

    const libpostal = new Libpostal(configBlob);

    t.equals(libpostal.getName(), 'libpostal');
    t.equals(libpostal.getBaseUrl(), 'http://localhost:1234/');
    t.equals(libpostal.getTimeout(), 17);
    t.equals(libpostal.getRetries(), 19);
    t.end();

  });

  test.test('getUrl should return value passed to constructor', (t) => {
    const configBlob = {
      url: 'http://localhost:1234',
      timeout: 17,
      retries: 19
    };

    const libpostal = new Libpostal(configBlob);

    t.equals(libpostal.getUrl(), 'http://localhost:1234/parse');
    t.end();

  });

  test.test('getParameters should return object with text and lang from req', (t) => {
    const configBlob = {
      url: 'http://localhost:1234',
      timeout: 17,
      retries: 19
    };

    const libpostal = new Libpostal(configBlob);

    t.deepEquals(libpostal.getParameters('query value'), { address: 'query value' });
    t.end();

  });

  test.test('getHeaders should return empty object', (t) => {
    const configBlob = {
      url: 'base url',
      timeout: 17,
      retries: 19
    };

    const libpostal = new Libpostal(configBlob);

    t.deepEquals(libpostal.getHeaders(), {});
    t.end();

  });

  test.test('baseUrl ending in / should not have double /\'s return by getUrl', (t) => {
    const configBlob = {
      url: 'http://localhost:1234/',
      timeout: 17,
      retries: 19
    };

    const libpostal = new Libpostal(configBlob);

    t.deepEquals(libpostal.getUrl(), 'http://localhost:1234/parse');
    t.end();

  });

});
