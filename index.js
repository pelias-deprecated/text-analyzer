var postal = require('node-postal');

module.exports = require('./src/libpostalParser').create(postal.parser.parse_address);
