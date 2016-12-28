'use strict';

var tape = require('tape');

var configValidation = require('../src/configValidation');

tape('tests for looking up hierarchies', function(test) {
  test.test('config lacking textAnalyzer should not throw error', function(t) {
    t.doesNotThrow(function() {
      configValidation.validate({});
    });

    t.end();

  });

  test.test('config with textAnalyser should throw error', function(t) {
    var config = {
      textAnalyser: 'value'
    };

    t.throws(function() {
      configValidation.validate(config);
    }, /"textAnalyser" is not allowed/);
    t.end();

  });

  test.test('non-addressit/libpostal string value for textAnalyzer should throw error', function(t) {
    var config = {
      textAnalyzer: 'non-addressit/libpostal string value'
    };

    t.throws(function() {
      configValidation.validate(config);
    }, /"textAnalyzer" must be one of \[libpostal, addressit\]/);
    t.end();

  });

  test.test('non-string value for textAnalyzer should throw error', function(t) {
    [null, 17, {}, [], true].forEach((value) => {
      var config = {
        textAnalyzer: value
      };

      t.throws(function() {
        configValidation.validate(config);
      }, /"textAnalyzer" must be a string/);

    });
    t.end();

  });

});
