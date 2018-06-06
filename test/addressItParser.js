var tape = require('tape');
var parser = require('../src/addressItParser');

tape('tests', function(test) {
  test.test('interface', function(t) {
    t.equal(typeof parser.parse, 'function', 'valid function');
    t.end();
  });

  var queries = [
    { name: 'soho', admin_parts: 'new york' },
    { name: 'chelsea', admin_parts: 'london' },
    { name: '123 main', admin_parts: 'new york' }
  ];

  queries.forEach(function (query) {
    test.test('naive parsing ' + query, function(t) {
      var address = parser.parse(query.name + ', ' + query.admin_parts);

      t.equal(typeof address, 'object', 'valid object');
      t.equal(address.name, query.name, 'name set correctly to ' + address.name);
      t.equal(address.admin_parts, query.admin_parts, 'admin_parts set correctly to ' + address.admin_parts);
      t.end();
    });

    test.test('naive parsing ' + query + 'without spaces', function(t) {
      var address = parser.parse(query.name + ',' + query.admin_parts);

      t.equal(typeof address, 'object', 'valid object');
      t.equal(address.name, query.name, 'name set correctly to ' + address.name);
      t.equal(address.admin_parts, query.admin_parts, 'admin_parts set correctly to ' + address.admin_parts);
      t.end();
    });
  });

  test.test('query with one token', function (t) {
    var address = parser.parse('yugolsavia');
    t.equal(address, null, 'nothing address specific detected');
    t.end();
  });
  test.test('query with two tokens, no numbers', function (t) {
    var address = parser.parse('small town');
    t.equal(address, null, 'nothing address specific detected');
    t.end();
  });
  test.test('query with two tokens, number first', function (t) {
    var address = parser.parse('123 main');
    t.equal(address, null, 'nothing address specific detected');
    t.end();
  });
  test.test('query with two tokens, number second', function (t) {
    var address = parser.parse('main 123');
    t.equal(address, null, 'nothing address specific detected');
    t.end();
  });
  test.test('query with many tokens', function(t) {
    var address = parser.parse('main particle new land');
    t.equal(address, null, 'nothing address specific detected');
    t.end();
  });

  test.test('valid city with multiword state', function(t) {
    var query_string = 'buffalo new york';
    var address = parser.parse(query_string);

    t.equal(typeof address, 'object', 'valid object for the address');
    t.deepEqual(address.regions, ['buffalo'], 'parsed city');
    t.equal(address.state , 'NY', 'parsed state');
    t.end();
  });
  test.test('valid address, unt', function(t) {
    var query_string = 'Shop 8, 431 St Kilda Rd Melbourne';
    var address = parser.parse(query_string);

    t.equal(typeof address, 'object', 'valid object for the address');
    t.equal(address.unit , '8', 'parsed unit');
    t.equal(address.number, '431', 'parsed house number');
    t.equal(address.street, 'St Kilda Rd', 'parsed street');
    t.deepEqual(address.regions, ['Melbourne'], 'parsed city');
    t.end();
  });
  test.test('valid address, house number', function(t) {
    var query_string = '123 main st new york ny';
    var address = parser.parse(query_string);

    t.equal(typeof address, 'object', 'valid object for the address');
    t.equal(address.number, '123', 'parsed house number');
    t.equal(address.street, 'main st', 'parsed street');
    t.deepEqual(address.regions, ['new york'], 'parsed city');
    t.equal(address.state , 'NY', 'parsed state');
    t.end();
  });
  test.test('valid address, zipcode', function(t) {
    var query_string = '123 main st new york ny 10010';
    var address = parser.parse(query_string);

    t.equal(typeof address, 'object', 'valid object for the address');
    t.equal(address.number, '123', 'parsed house number');
    t.equal(address.street, 'main st', 'parsed street');
    t.deepEqual(address.regions, ['new york'], 'parsed city');
    t.equal(address.state , 'NY', 'parsed state');
    t.equal(address.postalcode, '10010', 'parsed zip is a string');
    t.end();
  });
  test.test('valid address with leading 0s in zipcode', function(t) {
    var query_string = '339 W Main St, Cheshire, 06410';
    var address = parser.parse(query_string);

    t.equal(typeof address, 'object', 'valid object for the address');
    t.equal(address.street, 'W Main St', 'parsed street');
    t.deepEqual(address.regions, ['Cheshire'], 'parsed city');
    t.equal(address.postalcode, '06410', 'parsed zip');
    t.end();
  });
  test.test('valid address without spaces after commas', function(t) {
    var query_string = '339 W Main St,Lancaster,PA';
    var address = parser.parse(query_string);

    t.equal(typeof address, 'object', 'valid object for the address');
    t.equal(address.number, '339', 'parsed house number');
    t.equal(address.street, 'W Main St', 'parsed street');
    t.deepEqual(address.regions, ['Lancaster'], 'parsed city');
    t.deepEqual(address.state, 'PA', 'parsed state');
    t.end();
  });

});
