const tape = require('tape');

const proxyquire = require('proxyquire').noCallThru();
const mock_logger = require('pelias-mock-logger');

tape('tests', test => {
  test.test('all known values should be adapted to pelias model', t => {
    const parser = proxyquire('../src/libpostalParser', {
      'node-postal': {
        parser: {
          parse_address: query => {
            t.equal(query, 'query value');

            return [
              {
                component: 'island',
                value: 'island value'
              },
              {
                component: 'category',
                value: 'category value'
              },
              {
                component: 'house',
                value: 'house value'
              },
              {
                component: 'house_number',
                value: 'house_number value'
              },
              {
                component: 'road',
                value: 'road value'
              },
              {
                component: 'suburb',
                value: 'suburb value'
              },
              {
                component: 'city_district',
                value: 'city_district value'
              },
              {
                component: 'city',
                value: 'city value'
              },
              {
                component: 'state_district',
                value: 'state_district value'
              },
              {
                component: 'state',
                value: 'state value'
              },
              {
                component: 'postcode',
                value: 'postcode value'
              },
              {
                component: 'country',
                value: 'country value'
              }
            ];

          }
        }
      }
    });

    const actual = parser.parse('query value');

    const expected = {
      island: 'island value',
      category: 'category value',
      query: 'house value',
      number: 'house_number value',
      street: 'road value',
      neighbourhood: 'suburb value',
      borough: 'city_district value',
      city: 'city value',
      county: 'state_district value',
      state: 'state value',
      postalcode: 'postcode value',
      country: 'country value'
    };

    t.deepEqual(actual, expected);
    t.end();

  });

  test.test('query with diacriticals should be deburred', t => {
    const parser = proxyquire('../src/libpostalParser', {
      'node-postal': {
        parser: {
          parse_address: query => {
            t.equal(query, 'query value');
            t.end();
            return [];
          }
        }
      }
    });

    parser.parse('q́ŭér̂ÿ v̆àl̂ū́ë');

  });

  test.test('unknown component names should not cause any adverse issues', t => {
    const parser = proxyquire('../src/libpostalParser', {
      'node-postal': {
        parser: {
          parse_address: query => {
            t.equal(query, 'query value');

            return [
              {
                component: 'category',
                value: 'category value'
              },
              {
                component: 'unknown_field',
                value: 'unknown_field value'
              }
            ];

          }
        }
      }
    });

    const actual = parser.parse('query value');

    const expected = {
      category: 'category value'
    };

    t.deepEqual(actual, expected);
    t.end();

  });

  test.test('libpostal returning 2 or more of a component should return undefined and log message', t => {
    const logger = mock_logger();

    const parser = proxyquire('../src/libpostalParser', {
      'pelias-logger': logger,
      'node-postal': {
        parser: {
          parse_address: query => {
            t.equal(query, 'query value');

            return [
              {
                component: 'road',
                value: 'road value 1'
              },
              {
                component: 'city',
                value: 'city value'
              },
              {
                component: 'road',
                value: 'road value 2'
              }
            ];

          }
        }
      }
    });

    const actual = parser.parse('query value');

    t.ok(logger.isWarnMessage('discarding libpostal parse of \'query value\' due to duplicate field assignments'));
    t.equals(actual, undefined, 'libpostal response should be considerd invalid');
    t.end();

  });

});
