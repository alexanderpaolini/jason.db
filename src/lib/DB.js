const fs = require('fs');
const path = require('path');

const Collection = require('./Collection.js');

const DefaultOptions = {
  caching: false,
};

class DB {
  constructor(databasePath, options = {}) {
    this._path = path.resolve(databasePath);
    this._tmpFilePath = path.resolve(__dirname, '../../tmp/data.json');
    if (!fs.existsSync(path.resolve(__dirname, '../../tmp'))) fs.mkdirSync(path.resolve(__dirname, '../../tmp'));
    this._collections = {};
    this.options = Object.assign(DefaultOptions, options);
    this._caching = this.options.caching;
    if (!fs.existsSync(this._path)) throw 'Specified file does not exist.';
    try {
      let data = JSON.parse(fs.readFileSync(this._path, 'utf8'));
      if (this._caching) this._data = data;
    }
    catch (err) {
      throw 'An error occured when reading the DB\n' + err;
    }
  }

  /**
   * Read the DB
   * @returns Object
   */
  _read() {
    try {
      return JSON.parse(fs.readFileSync(this._path, 'utf8'));
    }
    catch (err) {
      throw 'An error occured when reading the DB\n' + err;
    }
  }

  /**
   * Write to the DB
   * @param data Data to be written
   * @returns Boolean
   */
  _write(data) {
    if (!data) throw 'Tried to write to DB without any data.';
    try {
      if (this._caching) this._data = data;
      data = JSON.stringify(data);
      fs.writeFileSync(this._tmpFilePath, data);
      fs.renameSync(this._tmpFilePath, this._path);
      return true;
    }
    catch (err) {
      throw 'An error occured when writing to the DB:\n' + err;
    }
  }

  /**
   * Set the collection
   * @returns Boolean
   */
  _setCollection(collection, data) {
    if (!collection) throw 'Tried to save to DB without a collection name';
    if (!data) throw 'Tried to save to DB without any data';
    let dbData = this._caching ? this._data : this._read();
    dbData[collection] = data;
    this._write(dbData);
    return true;
  }

  /**
   * Choose a collection
   * @param collection Collection of DB
   * @returns Collection
   */
  collection(collection) {
    if (!collection) throw 'collection name is required when choosing a collection';
    if (this._collections[collection]) return this._collections[collection];
    this._collections[collection] = new Collection(collection, this);
    return this._collections[collection];
  }

  /**
   * Clear the DB of all its data
   * @param boolean To make sure you wan't do delete the data
   * @returns Boolean
  */
  clear(boolean) {
    if (boolean !== true) throw 'Tried to clear DB without a true boolean.';
    this._write({});
    return true;
  }
}

module.exports = DB;