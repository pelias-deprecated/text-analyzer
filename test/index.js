var tape = require('tape');
var proxyquire =  require('proxyquire').noCallThru();

tape('tests', function(test) {
  test.test('erroneous textAnalyser config should throw error', function(t) {
    t.throws(function() {
      proxyquire('../index', {
        'pelias-config': { generate: function() {
          return { api: { textAnalyser: 'bad key' } };
        }
      }});

    }, /"textAnalyser" is not allowed/);

    t.end();

  });

  test.test('non-libpostal/addressit textAnalyzer should throw error', function(t) {
    t.throws(function() {
      proxyquire('../index', {
        'pelias-config': { generate: function() {
          return { api: { textAnalyzer: 'non-libpostal/addressit textAnalyzer' } };
        }
      }});

    }, /"textAnalyzer" must be one of \[libpostal, addressit\]/);

    t.end();

  });

  test.test('addressit textAnalyzer should return addressit textAnalyzer', function(t) {
    const textAnalyzer = proxyquire('../index', {
      './src/addressItParser': 'addressit',
      'pelias-config': { generate: function() {
        return { api: { textAnalyzer: 'addressit' } };
      }
    }});

    t.equals(textAnalyzer, 'addressit');
    t.end();

  });

  test.test('addressit textAnalyzer should return addressit textAnalyzer', function(t) {
    const textAnalyzer = proxyquire('../index', {
      'node-postal': {
        parser: {
          parse_address: function(){}
        }
      },
      './src/libpostalParser': {
        create: function() {
          return 'libpostal';
        }
      },
      'pelias-config': { generate: function() {
        return { api: { textAnalyzer: 'libpostal' } };
      }
    }});

    t.equals(textAnalyzer, 'libpostal');
    t.end();

  });

});
