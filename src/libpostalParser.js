const logger = require('pelias-logger').get('text-analyzer');
const _ = require('lodash');

const parse_address = require('node-postal').parser.parse_address;

// mapping object from libpostal fields to pelias fields
const field_mapping = {
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
module.exports = {
  parse: function parse(query) {
    // call the parsing function (libpostal)
    const parsed = parse_address(_.deburr(query));

    logger.debug('libpostal raw: ' + JSON.stringify(parsed, null, 2));

    // if any field is represented more than once in the libpostal response, treat it as invalid
    //  and return undefined
    // _.countBy creates a histogram from parsed, eg: { "road": 2, "city": 1 }
    if (_.some(_.countBy(parsed, o => o.component), count => count > 1)) {
      logger.warn(`discarding libpostal parse of '${query}' due to duplicate field assignments`);
      return undefined;
    }

    // convert the libpostal input into something that pelias understands
    const o = parsed.reduce((o, f) => {
      if (field_mapping.hasOwnProperty(f.component)) {
        o[field_mapping[f.component]] = f.value;
      }

      return o;
    }, {});

    logger.debug('converted: ' + JSON.stringify(o, null, 2));

    return o;

  }

};
