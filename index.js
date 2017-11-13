// validate the WOF importer configuration before continuing
const peliasConfig = require( 'pelias-config' ).generate(require('./schema'));

// Changes to incorporate libpostal were made to minimize the impact to pelias-api
// so exports cannot be a function to conditionally return an analyzer instance.
// This can be changed when addressit goes away and libpostal has become the norm.
if ('libpostal' === peliasConfig.api.textAnalyzer) {
  console.log('loading libpostal data, this may take a few seconds...');
  module.exports = require('./src/libpostalParser');
}
else if ('addressit' === peliasConfig.api.textAnalyzer) {
  module.exports = require('./src/addressItParser');
}
