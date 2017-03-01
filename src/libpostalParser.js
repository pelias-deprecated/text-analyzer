var logger = require('pelias-logger').get('text-analyzer');
var _ = require('lodash');

// mapping object from libpostal fields to pelias fields
var field_mapping = {
  island:         'island',
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
// testing purposes.  `parse_address` is just a function that in the real world
// calls libpostal and returns the parsed input.  It's injected since it's
// libpostal is an external dependency and this pattern makes unit testing much
// easier by effectively mocking out libpostal.  `parse_address` takes a single
// string parameter to be parsed and returns an array of the form:
//
// ```
// [
//  {
//    component: 'house_number',
//    value: '30'
//  },
//  {
//    component: 'road',
//    value: 'west 26th street'
//  },
//  {
//    component: 'city',
//    value: 'new york'
//  },
//  {
//    component: 'state',
//    value: 'ny'
//  }
//]
// ```
//
// where `component` can be any of (currently):
// - house (generally interpreted as unknown, treated by pelias like a query term)
// - category (like "restaurants")
// - house_number
// - road
// - unit (apt or suite #)
// - suburb (like a neighbourhood)
// - city
// - city_district (like an NYC borough)
// - state_district (like a county)
// - state
// - postcode
// - country
//
// The Pelias query module is not concerned with unit.
//
module.exports.create = function create(postal) {
  if (!postal || typeof postal !== 'object') {
    throw new Error('postal parameter must be of type object');
  }

  if (!postal.parser || typeof postal.parser.parse_address !== 'function') {
    throw new Error('postal.parser.parse_address parameter must be of type function');
  }

  if (!postal.expand || typeof postal.expand.expand_address !== 'function') {
    throw new Error('postal.expand.expand_address must be of type function');
  }


  return {
    expand: function expand(query) {
      // call the expand function (libpostal)
      var expanded = postal.expand.expand_address(query);

      logger.debug('libpostal expanded: ' + JSON.stringify(expanded, null, 2));

      return expanded;

    },
    parse: function parse(query) {
      // call the parsing function (libpostal)
      var parsed = postal.parser.parse_address(_.deburr(query));

      logger.debug('libpostal parse raw: ' + JSON.stringify(parsed, null, 2));

      // convert the libpostal input into something that pelias understands
      var o = parsed.reduce(function(o, f) {
        if (field_mapping.hasOwnProperty(f.component)) {
          o[field_mapping[f.component]] = f.value;
        }

        return o;
      }, {});

      logger.debug('libpostal converted: ' + JSON.stringify(o, null, 2));

      return o;

    }
  };

};
