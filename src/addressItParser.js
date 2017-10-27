var parser = require('addressit');
var extend = require('extend');
var _      = require('lodash');
var logger = require('pelias-logger').get('text-analyzer');

function getAdminPartsBySplittingOnDelim(queryParts, delim) {
  // naive approach - for admin matching during query time
  // split 'flatiron, new york, ny' into 'flatiron' and 'new york, ny'

  var address = {};

  if (queryParts.length > 1) {
    address.name = queryParts[0].trim();

    // 1. slice away all parts after the first one
    // 2. trim spaces from each part just in case
    // 3. join the parts back together with appropriate delimiter and spacing
    address.admin_parts = queryParts.slice(1)
                              .map(function (part) { return part.trim(); })
                              .join(delim + ' ');
  }

  return address;
}

function getAddressParts(query) {
  // perform full address parsing
  // except on queries so short they obviously can't contain an address
  if (query.length > 3) {
    return parser( query );
  }
}

function parse(query) {
  var delim = ',';

  var queryParts = query.split(delim);

  var addressWithAdminParts  = getAdminPartsBySplittingOnDelim(queryParts, delim);
  var addressWithAddressParts= getAddressParts(queryParts.join(delim + ' '));

  var parsedAddress  = extend(addressWithAdminParts,
                              addressWithAddressParts);

  var address_parts  =  [ 'name',
                          'unit',
                          'number',
                          'street',
                          'city',
                          'state',
                          'country',
                          'postalcode',
                          'regions',
                          'admin_parts'
                        ];

  var parsed_text = {};

  address_parts.forEach(function(part){
    if (parsedAddress[part]) {
      parsed_text[part] = parsedAddress[part];
    }
  });

  // if all we found was regions, ignore it as it is not enough information to make smarter decisions
  if (Object.keys(parsed_text).length === 1 && !_.isUndefined(parsed_text.regions))
  {
    logger.info('Ignoring address parser output, regions only');
    return null;
  }

  return parsed_text;

}

module.exports.parse = parse;
