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
  _writeDB(data) {
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
  _readDB() {
    try {
      return JSON.parse(fs.readFileSync(this._path, 'utf8'));
    }
    catch (err) {
      throw 'An error occured when reading the DB\n' + err;
    }
  }

  /**
   * Save data to the DB
   * @param collection Collection of DB
   * @param key key for data
   * @param data Data for the key to be set to
   * @returns Boolean
   */
  saveToDB(collection, key, data) {
    if (!collection) throw 'Tried to save to DB without a collection name';
    if (!key) throw 'Tried to save to DB without a key';
    if (!data) throw 'Tried to save to DB without an data';
    let dbData = this._readDB();
    if (!dbData[collection]) dbData[collection] = {};
    dbData[collection][key] = data;
    this._writeDB(dbData);
    return true;
  }

  /**
   * Save data to the DB
   * @param collection Collection of DB
   * @param key key for data
   * @returns Data
   */
  getFromDB(collection, key) {
    if (!collection) throw 'Tried to save to DB without a collection name';
    if (!key) throw 'Tried to save to DB without a key';
    let dbData = this._readDB();
    return dbData[collection]?.[key];
  }

  /**
   * Clear the DB of all its data
   * @param boolean To make sure you wan't do delete the data
   * @returns Boolean
  */
  clearDB(boolean) {
    if (boolean !== true) throw 'Tried to clear DB without a true boolean.';
    this._writeDB({});
    return true;
  }
}

module.exports = DB;