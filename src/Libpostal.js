'use strict';

const url = require('url');

const ServiceConfiguration = require('pelias-microservice-wrapper').ServiceConfiguration;

class Libpostal extends ServiceConfiguration {
  constructor(o) {
    super('libpostal', o);
  }

  getParameters(query) {
    return {
      address: query
    };

  }

  getUrl(req) {
    return url.resolve(this.baseUrl, 'parse');
  }

}

module.exports = Libpostal;
