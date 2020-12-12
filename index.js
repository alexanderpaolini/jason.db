const pkg = require('./package.json')

const DB = require('./lib/DB.js')
DB.Collection = require('./lib/Collection.js')
DB.version = pkg.version
