const fs = require('fs');
const path = require('path');

class DB {
  constructor(databasePath) {
    this._path = path.resolve(databasePath);
    this._tmpFilePath = path.resolve(__dirname, '../../tmp/data.json');
    if (!fs.existsSync(this._path)) throw 'Specified file does not exist.';
    try {
      this._data = JSON.parse(fs.readFileSync(this._path, 'utf8'));
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
   * Cursor data to DB
   * @param collection Collection of DB
   * @param key key for data
   * @param value value for the key to be set to
   * @returns Data
   */
  _cursor(collection, key, value) {
    const properties = key.split('.');
    const lastProperty = properties.pop();
    const data = this._read();
    
    let cursor = data;
    if (!cursor[collection]) cursor[collection] = {};
    cursor = cursor[collection];
    
    for (const property of properties) {
      if (!cursor[property] && value) cursor[property] = {};
      if (typeof cursor[property] !== 'object') throw 'Cannot nest a non-object';
      cursor = (cursor || {})[property];
    }
    
    if (value) {
      cursor[lastProperty] = value;
      return data;
    }
    
    return (cursor || {})[lastProperty];
  }

  /**
   * Set data to the DB
   * @param collection Collection of DB
   * @param key key for data
   * @param value value for the key to be set to
   * @returns Boolean
   */
  set(collection, key, value) {
    if (!collection) throw 'Tried to save to DB without a collection name';
    if (!key) throw 'Tried to save to DB without a key';
    if (!value) throw 'Tried to save to DB without a value';
    this._write(this._cursor(collection, key, value));
    return true;
  }

  /**
   * Get data to the DB
   * @param collection Collection of DB
   * @param key key for data
   * @returns Data
   */
  get(collection, key) {
    if (!collection) throw 'Tried get DB without a collection name';
    if (!key) throw 'Tried to get DB without a key';
    return this._cursor(collection, key);
  }

  /**
   * Check if data is available in DB
   * @param collection Collection of DB
   * @param key key for data
   * @returns Data
   */
  has(collection, key, value) {
    if (!collection) throw 'Tried get DB without a collection name';
    if (!key) throw 'Tried to get DB without a key';
    return this._cursor(collection, key) !== undefined;
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