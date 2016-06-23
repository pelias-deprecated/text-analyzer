var logger = require('pelias-logger').get('text-analyzer');

// mapping object from libpostal fields to pelias fields
var field_mapping = {
  category:       'category',
  house:          'query',
  house_number:   'number',
  road:           'street',
  suburb:         'neighbourhood',
  city_district:  'borough',
  city:           'city',
  state_district: 'county',
  state:          'state',
  postcode:       'postalcode',
  country:        'country'
};

// wrapper for libpostal that injects the actual parse function for easier
// testing purposes
module.exports.create = function create(parse_address) {
  return {
    parse: function parse(query) {
      // call the parsing function (libpostal)
      var parsed = parse_address(query);

      logger.debug('libpostal raw: ' + JSON.stringify(parsed, null, 2));

      // convert the libpostal input into something that pelias understands
      var o = parsed.reduce(function(o, f) {
        if (field_mapping.hasOwnProperty(f.component)) {
          o[field_mapping[f.component]] = f.value;
        }

        return o;
      }, {});

      logger.debug('converted: ' + JSON.stringify(o, null, 2));

      return o;

    }
  };

};
