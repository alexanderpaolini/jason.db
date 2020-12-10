const DB = require('./DB.js');

const ClassOptions = {
  caching: false,
  nesting: true,
};

class Collection {
  constructor(name, Database) {
    if (!name || typeof name !== 'string') throw 'Collection name must be a string.';
    this.name = name;
    this.db = Database;
    if (!this._read()) this.db._setCollection(this.name, {});
  }

  /**
   * Read the Collection
   * @returns Object
   */
  _read() {
    return (this.db._read())[this.name];
  }

  /**
   * Write to the DB
   * @param data Data to be written
   * @returns Boolean
   */
  _write(data) {
    if (!data) throw 'Tried to write to DB without any data.';
    return this.db._setCollection(this.name, data);
  }

  /**
   * Cursor data to DB
   * @param collection Collection of DB
   * @param key key for data
   * @param value value for the key to be set to
   * @returns Data
   */
  _cursor(key, value) {
    let properties = key.split('.');
    let lastProperty = properties.pop();
    let data = this._read();
    let cursor = data;
    for (let property of properties) {
      if (cursor[property] == undefined && value) cursor[property] = {};
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
   * Save data to the DB
   * @param collection Collection of DB
   * @param key key for data
   * @param data Data for the key to be set to
   * @returns Boolean
   */
  set(key, data) {
    if (!key) throw 'Tried to save to DB without a key';
    if (data == undefined) throw 'Tried to save to DB without any data';
    this._write(this._cursor(key, data));
    return true;
  }

  /**
   * Save data to the DB
   * @param collection Collection of DB
   * @param key key for data
   * @returns Data
   */
  get(key) {
    if (!key) throw 'Tried to read from DB without a key';
    let dbData = this._read();
    return dbData[key];
  }

  /**
   * Check if data is available in DB
   * @param key key for data
   * @returns Boolean
   */
  has(key) {
    if (!key) throw 'Tried to get DB without a key';
    return this._cursor(key) !== undefined;
  }
}

module.exports = Collection;