'use strict';

const tape = require('tape');
const Joi = require('joi');
const schema = require('../schema');

function validate(config) {
  Joi.validate(config, schema, (err) => {
    if (err) {
      throw new Error(err.details[0].message);
    }
  });
}

tape('tests for looking up hierarchies', (test) => {
  test.test('missing api should throw error', (t) => {
    const config = {};

    t.throws(validate.bind(null, config), /"api" is required/);
    t.end();

  });

  test.test('unknown sibling of api should not throw error', (t) => {
    const config = {
      api: {},
      unknown: 'value'
    };

    t.doesNotThrow(validate.bind(null, config));
    t.end();

  });

  test.test('unknown child of api should not throw error', (t) => {
    const config = {
      api: {
        unknown: 'value'
      }
    };

    t.doesNotThrow(validate.bind(null, config));
    t.end();

  });

  test.test('non-object api should throw error', (t) => {
    [null, 17, false, [], 'string'].forEach((value) => {
      const config = {
        api: value
      };

      t.throws(validate.bind(null, config), /"api" must be an object/);

    });

    t.end();

  });

  test.test('config lacking textAnalyzer should not throw error', (t) => {
    const config = {
      api: {}
    };

    t.doesNotThrow(validate.bind(null, config));

    t.end();

  });

  test.test('config with textAnalyser of any type should throw error', (t) => {
    [null, 17, {}, [], true, 'string'].forEach((value) => {
      const config = {
        api: {
          textAnalyser: value
        }
      };

      t.throws(validate.bind(null, config), /"textAnalyser" is not allowed/);
    });

    t.end();

  });

  test.test('non-addressit/libpostal string value for textAnalyzer should throw error', (t) => {
    const config = {
      api: {
        textAnalyzer: 'non-addressit/libpostal string value'
      }
    };

    t.throws(validate.bind(null, config), /"textAnalyzer" must be one of \[libpostal, addressit\]/);
    t.end();

  });

  test.test('non-string value for textAnalyzer should throw error', (t) => {
    [null, 17, {}, [], true].forEach((value) => {
      const config = {
        api: {
          textAnalyzer: value
        }
      };

      t.throws(validate.bind(null, config), /"textAnalyzer" must be a string/);

    });
    t.end();

  });

});
