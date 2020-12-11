const fs = require('fs');
const path = require('path');

const Collection = require('./Collection.js');

class DB {
  constructor(databasePath, options = { caching: false, renameFile: true }) {
    this.options = options;
    this._path = path.resolve(databasePath);
    this._tmpFilePath = path.resolve(__dirname, '../../tmp/data.json');
    this._collections = {};
    this._caching = this.options.caching;
    if (!fs.existsSync(path.resolve(__dirname, '../../tmp')))
      fs.mkdirSync(path.resolve(__dirname, '../../tmp'));
    if (!fs.existsSync(this._path)) {
      if (this.options.renameFile && fs.existsSync(this._path.replace(/json/g, 'jason'))) {
        this._path = this._path.replace(/json/g, 'jason');
      } else throw 'Specified file does not exist.';
    }
    try {
      let data = JSON.parse(fs.readFileSync(this._path, 'utf8'));
      if (this._caching) this._data = data;
      if (this._path.includes('json') && this.options.renameFile) {
        this._path = this._path.replace(/json/g, 'jason');
        fs.renameSync(path.resolve(databasePath), this._path);
      }
    } catch (err) {
      throw 'An error occured when reading the DB\n' + err;
    }
  }

  /**
   * Read the DB
   * @returns {object} The database object
   */
  _read() {
    try {
      return JSON.parse(fs.readFileSync(this._path, 'utf8'));
    } catch (err) {
      throw 'An error occured when reading the DB:\n' + err;
    }
  }

  /**
   * Write to the DB
   * @param data Data to be written
   * @returns {boolean} success
   */
  _write(data) {
    if (data === undefined) throw 'Tried to write to DB without any data';
    if (!['object', 'array'].includes(typeof data)) throw 'collection name must be of type object or array';
    try {
      if (this._caching) this._data = data;
      data = JSON.stringify(data);
      fs.writeFileSync(this._tmpFilePath, data);
      fs.renameSync(this._tmpFilePath, this._path);
      return true;
    } catch (err) {
      throw 'An error occured when writing to the DB:\n' + err;
    }
  }

  /**
   * Set the collection
   * @returns {boolean} success
   */
  _setCollection(collection, data) {
    if (!collection) throw 'Tried to save to DB without a collection name';
    if (typeof collection !== 'string') throw 'collection name must be of type string';
    if (!data === undefined) throw 'Tried to save to DB without any data';
    let dbData = this._caching ? this._data : this._read();
    dbData[collection] = data;
    this._write(dbData);
    return true;
  }

  /**
   * Choose a collection
   * @param collection Collection of DB
   * @returns {Collection} The Collection
   */
  collection(collection) {
    if (!collection) throw 'collection name is required when choosing a collection';
    if (typeof collection !== 'string') throw 'collection name must be of type string';
    if (this._collections[collection]) return this._collections[collection];
    this._collections[collection] = new Collection(collection, this);
    return this._collections[collection];
  }

  /**
   * Clear the DB of all its data
   * @param boolean To make sure you wan't do delete the data
   * @returns {boolean} Success
  */
  clear(boolean) {
    if (boolean !== true) throw 'Tried to clear DB without a true boolean';
    this._write({});
    return true;
  }
}

module.exports = DB;
