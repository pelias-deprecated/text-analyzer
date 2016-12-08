var peliasConfig = require( 'pelias-config' ).generate();

var text_analyzer = peliasConfig.api.textAnalyzer || 'addressit';

// Changes to incorporate libpostal were made to minimize the impact to pelias-api
// so exports cannot be a function to conditionally return an analyzer instance.
// This can be changed when addressit goes away and libpostal has become the norm.
if ('libpostal' === text_analyzer) {
  console.log('loading libpostal data, this may take a few seconds...');
  var postal = require('node-postal');
  module.exports = require('./src/libpostalParser').create(postal.parser.parse_address);
}
else if ('addressit' === text_analyzer) {
  module.exports = require('./src/addressItParser');
}
else {
  throw new Error('Unsupported analyzer \'' + text_analyzer + '\', valid values are \'addressit\' and \'libpostal\'');
}
