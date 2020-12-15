const fs = require('fs');
const path = require('path');

const Collection = require('./Collection.js');

class DB {
  constructor(databasePath, options = { renameFile: true, writeFile: false }) {
    // Variables
    this.options = options;
    this.path = path.resolve(databasePath);
    this._tmpFilePath = path.resolve(__dirname, '../../tmp/data.json');
    this._collections = {};

    // Make the "tmp/" dir
    if (!fs.existsSync(path.resolve(__dirname, '../../tmp'))) { fs.mkdirSync(path.resolve(__dirname, '../../tmp')); }
    if (!fs.existsSync(this.path)) {
      if (this.options.renameFile && fs.existsSync(this.path.replace(/json/g, 'jason'))) {

        // Check if the file has been renamed prevously
        this.path = this.path.replace(/json/g, 'jason');
      } else if (this.options.writeFile && !fs.existsSync(this.path)) {

        // Write the file if it doesn't exist
        fs.writeFileSync(this.path, '{}', 'utf8');
      } else throw new Error('Specified file does not exist.');
    }
    try {
      // If enabled, rename ".json" to ".jason" extension
      if (this.path.includes('json') && this.options.renameFile) {
        this.path = this.path.replace(/json/g, 'jason');
        fs.renameSync(path.resolve(databasePath), this.path);
      }

      // Attempt to read from the DB
      this._read();
    } catch (err) {
      throw new Error('An error occured when reading the DB\n' + err);
    }
  }

  /**
   * Read the DB
   * @returns {object} The database object
   */
  _read() {
    try {
      // Read and parse the data
      return JSON.parse(fs.readFileSync(this.path, 'utf8'));
    } catch (err) {
      throw new Error('An error occured when reading the DB:\n' + err);
    }
  }

  /**
   * Write to the DB
   * @param data Data to be written
   * @returns {boolean} success
   */
  _write(data) {
    // Check if "data" is the wrong data type
    if (data === undefined) throw new Error('Tried to write to DB without any data');
    if (!['object', 'array'].includes(typeof data)) throw new TypeError('data must be of type "object" or "array"');

    // Write to "tmp/data.json" and rename file. Throws if errors
    try {
      data = JSON.stringify(data);
      fs.writeFileSync(this._tmpFilePath, data, 'utf8');
      fs.renameSync(this._tmpFilePath, this.path);
      return true;
    } catch (err) {
      throw new Error('An error occured when writing to the DB:\n' + err);
    }
  }

  /**
   * Set the collection
   * @returns {boolean} success
   */
  _setCollection(collection, data) {
    // Check if "collection" or "data" are the wrong type
    if (typeof collection !== 'string') throw new TypeError('Collection name must be of type "string"');
    if (data === undefined) throw new Error('Tried to save to DB without any data');

    // Read data then set dbData of collection to data
    const dbData = this._read();
    dbData[collection] = data;

    // Write with the updated data
    this._write(dbData);
    return true;
  }

  /**
   * Choose a collection
   * @param collection Collection of DB
   * @returns {Collection} The Collection
   */
  collection(collection, options = { caching: false }) {
    // Check if "collection" is the wrong data 
    if (typeof collection !== 'string') throw new TypeError('Collection name must be of type "string"');

    // Check if the collection is cached and return a new Collection if not.
    if (!this._collections[collection]) this._collections[collection] = new Collection(collection, options, this);
    return this._collections[collection];
  }

  /**
   * Clear the DB of all its data
   * @param boolean To make sure you wan't do delete the data
   * @returns {boolean} Success
  */
  clear(boolean) {
    // Make sure they know what they are doing
    if (boolean !== true) throw new Error('Tried to clear DB without a true boolean');

    // Write to the DB with an empty object
    this._write({});
    return true;
  }
}

module.exports = DB;