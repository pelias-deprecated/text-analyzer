'use strict';

const Joi = require('joi');

// config just has optional textAnalyzer, which defaults to addressit
// textAnalyser is explicitly invalid
const schema = Joi.object().keys({
  textAnalyzer: Joi.string().default('addressit').valid('libpostal', 'addressit')
}).invalid('textAnalyser');

module.exports = {
  validate: function validate(config) {
    Joi.validate(config, schema, (err, value) => {
      if (err) {
        throw new Error(err.details[0].message);
      }
    });
  }

};
