const tape = require('tape');
const proxyquire =  require('proxyquire').noCallThru();

tape('entry point tests', (test) => {
  test.test('generate throwing error should exit before require\'ing a parser', (t) => {
    t.throws(() => {
      // since src/addressItParser returns a function, invoke to make sure addressit
      // was not require'd as the error should be thrown before a function is returned.
      // that is, configValidation should skip require'ing any parser
      proxyquire('../index', {
        './schema': 'this is the schema',
        './src/addressItParser': () => { throw Error('should not have been called'); },
        'pelias-config': {
          generate: (schema) => {
            t.equals(schema, 'this is the schema');
            throw Error('config is not valid');
          }
        }
      })();

    }, /config is not valid/);

    t.end();

  });

  test.test('addressit textAnalyzer should return addressit textAnalyzer', (t) => {
    const textAnalyzer = proxyquire('../index', {
      './schema': 'this is the schema',
      './src/addressItParser': 'addressit',
      'pelias-config': {
        generate: (schema) => {
          t.equals(schema, 'this is the schema');
          return { api: { textAnalyzer: 'addressit' } };
        }
      }
    });

    t.equals(textAnalyzer, 'addressit');
    t.end();

  });

  test.test('addressit textAnalyzer should return addressit textAnalyzer', (t) => {
    const textAnalyzer = proxyquire('../index', {
      './schema': 'this is the schema',
      'node-postal': {
        parser: {
          parse_address: () => {}
        }
      },
      './src/libpostalParser': 'libpostal',
      'pelias-config': { generate: (schema) => {
        t.equals(schema, 'this is the schema');
        return { api: { textAnalyzer: 'libpostal' } };
      }
    }});

    t.equals(textAnalyzer, 'libpostal');
    t.end();

  });

});
