'use strict';

const Joi = require('joi');

// config just has optional textAnalyzer, which defaults to addressit
// textAnalyser is explicitly invalid
module.exports = Joi.object().keys({
  api: Joi.object().keys({
    textAnalyzer: Joi.string().default('addressit').valid('libpostal', 'addressit')
  }).invalid('textAnalyser')
}).requiredKeys('api').unknown(true);
