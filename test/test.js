var warnLogger = {
  logger: {
    level: 'warn'
  }
};

require( 'pelias-config' )
  .generate()
  .deepMerge(warnLogger);

require ('./libpostalParser.js');
require ('./addressItParser.js');
require ('./configValidationTest.js');
require ('./index.js');
