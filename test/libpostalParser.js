var tape = require('tape');

var libpostalParser = require('../src/libpostalParser');
const proxyquire = require('proxyquire').noCallThru();
const mock_logger = require('pelias-mock-logger');

tape('tests', function(test) {
  // test.test('interface', function(t) {
  //   t.equal(typeof libpostalParser.create, 'function', 'valid function');
  //   t.end();
  // });
  //
  test.test('attempting to pass a non-function to create should throw exception', function(t) {
    var errorMessage = /parse_address parameter must be of type function/;

    t.throws(libpostalParser.create.bind(null, {}), errorMessage);
    t.throws(libpostalParser.create.bind(null, ''), errorMessage);
    t.throws(libpostalParser.create.bind(null, 17), errorMessage);
    t.throws(libpostalParser.create.bind(null, null), errorMessage);
    t.throws(libpostalParser.create.bind(null, undefined), errorMessage);
    t.throws(libpostalParser.create.bind(null, false), errorMessage);
    t.end();

  });

  test.test('all known values should be adapted to pelias model', function(t) {
    var node_postal_mock = function(query) {
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
    };

    var parser = libpostalParser.create(node_postal_mock);

    var actual = parser.parse('query value');

    var expected = {
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

  test.test('query with diacriticals should be deburred', function(t) {
    var parser = libpostalParser.create((query) => {
      t.equal(query, 'query value');
      t.end();
      return [];
    });

    var actual = parser.parse('q́ŭér̂ÿ v̆àl̂ū́ë');

  });

  test.test('unknown component names should not cause any adverse issues', function(t) {
    var node_postal_mock = function(query) {
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
    };

    var parser = libpostalParser.create(node_postal_mock);

    var actual = parser.parse('query value');

    var expected = {
      category: 'category value'
    };

    t.deepEqual(actual, expected);
    t.end();

  });

  test.test('libpostal returning 2 or more of a component should return undefined and log message', t => {
    // plan so it's known that the injected parse function was called
    t.plan(3);

    const logger = mock_logger();

    const parse_address = query => {
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
    };

    const parser = proxyquire('../src/libpostalParser', {
      'pelias-logger': logger
    }).create(parse_address);

    const actual = parser.parse('query value');

    t.ok(logger.isWarnMessage('discarding libpostal parse of \'query value\' due to duplicate field assignments'));
    t.equals(actual, undefined, 'libpostal response should be considerd invalid');

  });

});
