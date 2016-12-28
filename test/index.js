var tape = require('tape');
var proxyquire =  require('proxyquire').noCallThru();

tape('entry point tests', function(test) {
  test.test('configValidation throwing error should exit for require\' a parser', function(t) {
    t.throws(function() {
      // since src/addressItParser returns a function, invoke to make sure addressit
      // was not require'd as the error should be thrown before a function is returned.
      // that is, configValidation should skip require'ing any parser
      proxyquire('../index', {
        './src/configValidation': {
          validate: () => {
            throw Error('config is not valid');
          }
        },
        './src/addressItParser': () => { throw Error('should not have been called'); },
        'pelias-config': {
          generate: () => {
            return { api: { textAnalyzer: 'addressit' } };
          }
        }
      })();

    }, /config is not valid/);

    t.end();

  });

  test.test('addressit textAnalyzer should return addressit textAnalyzer', function(t) {
    const textAnalyzer = proxyquire('../index', {
      './src/configValidation': {
        validate: () => {
          return true;
        }
      },
      './src/addressItParser': 'addressit',
      'pelias-config': {
        generate: () => {
          return { api: { textAnalyzer: 'addressit' } };
        }
      }
    });

    t.equals(textAnalyzer, 'addressit');
    t.end();

  });

  test.test('addressit textAnalyzer should return addressit textAnalyzer', function(t) {
    const textAnalyzer = proxyquire('../index', {
      './src/configValidation': {
        validate: () => {
          return true;
        }
      },
      'node-postal': {
        parser: {
          parse_address: () => {}
        }
      },
      './src/libpostalParser': {
        create: () => {
          return 'libpostal';
        }
      },
      'pelias-config': { generate: () => {
        return { api: { textAnalyzer: 'libpostal' } };
      }
    }});

    t.equals(textAnalyzer, 'libpostal');
    t.end();

  });

});
