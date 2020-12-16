const pkg = require('./package.json');

module.exports.DB = require('./lib/DB.js');
module.exports.PoggersDB = require('./lib/PoggersDB.js');
module.exports.version = pkg.version;
module.exports.Collection = require('./lib/Collection.js');
module.exports.PoggersEncryptor = require('./lib/PoggersEncryptor.js');
