var tape = require('tape');

var libpostalParser = require('../src/libpostalParser');

tape('tests', function(test) {
  // test.test('interface', function(t) {
  //   t.equal(typeof libpostalParser.create, 'function', 'valid function');
  //   t.end();
  // });
  //
  test.test('attempting to pass a non-function to create should throw exception', function(t) {
    var errorMessage = /postal parameter must be of type object/;

    t.throws(libpostalParser.create.bind(null, ''), errorMessage);
    t.throws(libpostalParser.create.bind(null, 17), errorMessage);
    t.throws(libpostalParser.create.bind(null, false), errorMessage);
    t.end();

  });

  test.test('expand string', function(t) {
    var expected = [
      'teststrasse',
      'test strasse'
    ];
    var node_postal_mock = {
      parser: { parse_address: function() {} },
      expand: {
        expand_address: function(query) {
          t.equal(query, 'teststraße');

          return expected;
        }
      }
    };

    var parser = libpostalParser.create(node_postal_mock);

    var actual = parser.expand('teststraße');

    t.deepEqual(actual, expected);
    t.end();

  });

  test.test('multiple values for component should use last value found', function(t) {
    var node_postal_mock = {
      parser: {
        parse_address: function(query) {
          t.equal(query, 'query value');

          return [
            {
              component: 'category',
              value: 'value 1'
            },
            {
              component: 'category',
              value: 'value 2'
            }
          ];
        }
      },
      expand: { expand_address: function() {} }
    };

    var parser = libpostalParser.create(node_postal_mock);

    var actual = parser.parse('query value');

    var expected = {
      category: 'value 2'
    };

    t.deepEqual(actual, expected);
    t.end();

  });

  test.test('all known values should be adapted to pelias model', function(t) {
    var node_postal_mock = {
      parser: {
        parse_address: function(query) {
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
      },
      expand: { expand_address: function() {} }
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
    var node_postal_mock = {
      parser: {
        parse_address: (query) => {
          t.equal(query, 'query value');
          t.end();
          return [];
        }
      },
      expand: { expand_address: function() {} }
    };

    var parser = libpostalParser.create(node_postal_mock);

    var actual = parser.parse('q́ŭér̂ÿ v̆àl̂ū́ë');

  });

  test.test('unknown component names should not cause any adverse issues', function(t) {
    var node_postal_mock = {
      parser: {
        parse_address: function(query) {
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
      },
      expand: { expand_address: function() {} }
    };

    var parser = libpostalParser.create(node_postal_mock);

    var actual = parser.parse('query value');

    var expected = {
      category: 'category value'
    };

    t.deepEqual(actual, expected);
    t.end();

  });

});
