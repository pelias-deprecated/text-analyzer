'use strict';

const Joi = require('joi');

var peliasConfig = require( 'pelias-config' ).generate();

const schema = Joi.object().keys({
  textAnalyzer: Joi.string().default('addressit').valid('libpostal', 'addressit')
}).invalid('textAnalyser');

Joi.validate(peliasConfig.api, schema, (err, value) => {
  if (err) {
    throw new Error(err.details[0].message);
  }
});

// Changes to incorporate libpostal were made to minimize the impact to pelias-api
// so exports cannot be a function to conditionally return an analyzer instance.
// This can be changed when addressit goes away and libpostal has become the norm.
if ('libpostal' === peliasConfig.api.textAnalyzer) {
  console.log('loading libpostal data, this may take a few seconds...');
  var postal = require('node-postal');
  module.exports = require('./src/libpostalParser').create(postal.parser.parse_address);
}
else if ('addressit' === peliasConfig.api.textAnalyzer) {
  module.exports = require('./src/addressItParser');
}
