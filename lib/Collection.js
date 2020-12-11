const DB = require('./DB.js');

class Collection {
  constructor(name, Database) {
    if (!name || typeof name !== 'string') throw 'Collection name must be of type string';
    this.name = name;
    this.db = Database;
    if (!this._read()) this.db._setCollection(this.name, {});
  }

  /**
   * Read the Collection
   * @returns {object}
   */
  _read() {
    return (this.db._read())[this.name];
  }

  /**
   * Read from the DB
   * @param {object} data Data to be written
   * @returns {boolean} success
   */
  _write(data) {
    if (data === undefined) throw 'Tried to write to DB without any data';
    return this.db._setCollection(this.name, data);
  }

  /**
   * Cursor data to DB
   * @param {string} key key for data
   * @param {any} value value for the key to be set to
   * @returns {any} The data of the key
   */
  _cursor(key, value) {
    if (!['string', 'number'].includes(typeof key)) throw 'Key must be of type string or number';
    key = String(key);
    let properties = key.split('.');
    let lastProperty = properties.pop();
    let data = this._read();
    if (typeof data !== 'object') throw 'collection data is not of type object';
    let cursor = data;
    for (let property of properties) {
      if (cursor[property] === undefined && value !== undefined) cursor[property] = {};
      if (typeof cursor[property] !== 'object') throw 'Cannot nest a non-object';
      cursor = (cursor || {})[property];
    }
    if (value !== undefined) {
      cursor[lastProperty] = value;
      return data;
    }
    return (cursor || {})[lastProperty];
  }

  /**
   * Save data to an array in the collection
   * @param {string | number} key key for data
   * @param {any} data Data for the key to be set to
   * @returns {boolean} success
   */
  push(key, data) {
    if (key === undefined) throw 'Tried to save to collection without a key';
    if (!['string', 'number'].includes(typeof key)) throw 'Key must be of type string or number';
    key = String(key);
    if (data === undefined) throw 'Tried to save to collection without any data';
    let currentData = this._cursor(key);
    if (!(currentData instanceof Array) && currentData !== undefined) throw 'Tried to push data to a value with type not of array';
    let newData = currentData ? currentData : [];
    newData.push(data);
    this._write(this._cursor(key, newData));
    return true;
  }

  /**
   * Save data to the collection
   * @param {string | number} key key for data
   * @param {any} data Data for the key to be set to
   * @returns {boolean} success
   */
  set(key, data) {
    if (key === undefined) throw 'Tried to save to collection without a key';
    if (!['string', 'number'].includes(typeof key)) throw 'Key must be of type string or number';
    key = String(key);
    if (data === undefined) throw 'Tried to save to collection without any data';
    this._write(this._cursor(key, data));
    return true;
  }

  /**
   * Get data from the collection
   * @param key key for data
   * @returns {object} The data for the key
   */
  get(key) {
    if (key === undefined) return this._read();
    if (!['string', 'number'].includes(typeof key)) throw 'Key must be of type string or number';
    key = String(key);
    let dbData = this._read();
    return dbData[key];
  }

  /**
   * Check if data is available in collection
   * @param key key for data
   * @returns {boolean} Whether the collection has the key
   */
  has(key) {
    if (typeof key !== 'string') throw 'Key must be of type string';
    return this._cursor(key) !== undefined;
  }

  /**
   * Clear the DB of all its data
   * @param boolean To make sure you wan't do delete the data
   * @returns {boolean} Success
  */
  clear(boolean) {
    if (boolean !== true) throw 'Tried to clear collection without a true boolean.';
    this._write({});
    return true;
  }
}

module.exports = Collection;
