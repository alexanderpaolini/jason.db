const pkg = require('./package.json');

module.exports.DB = require('./lib/DB.js');
module.exports.version = pkg.version;
module.exports.Collection = require('./lib/Collection.js');
