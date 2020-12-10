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
    if (!this.db._readDB[this.name]) this.db._setCollection(this.name, {});
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
    let dbData = (this.db.options.caching ? this.db._data : this.db._readDB())[this.name];
    dbData[key] = data;
    this.db._setCollection(this.name, dbData);
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
    let dbData = this._caching ? this._data : this._readDB();
    return dbData[this.name][key];
  }
}

module.exports = Collection;