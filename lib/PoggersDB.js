const fs = require('fs');
const { readFile } = require('fs/promises');
const { normalize, resolve } = require('path');
const Collection = require('./Collection');
const PoggersEncryptor = require('./PoggersEncryptor');

class PoggersDB {
  /**
   * A Poggers Database
   * @param {string} path The database file's path
   * @param {{ writeFile: boolean, renameFile: boolean }} options The DB options
   */
  constructor(path, options = { renameFile: true, writeFile: false }) {
    // Normalize path
    if (!/\.poggers$/i.test(path)) path += '.poggers';
    path = normalize(path);

    // Variables
    this.options = options;
    this._tmpFilePath = resolve(__dirname, '../../tmp/data.json');
    this.path = path;
    this._encryptor = new PoggersEncryptor();
    this._collections = {};

    // IF the file does not exist write the file, or error
    if (!fs.existsSync(this.path)) {
      if (this.options.writeFile) {
        fs.writeFileSync(this.path, this._encryptor.encrypt('{}'));
      } else throw new Error('Specified file does not exist.');
    }
    try {
      // Attempt to read the DB
      this._read();
    } catch (err) {
      throw new Error('An error occured when reading the DB\n' + err);
    }
  }

  /**
   * Read the DB
   * @param {(err: any, data: object) => void} callback The callback to execute after reading
   * @returns {Promise<object>} The DB's data
   */
  async _read(callback = null) {
    try {
      const data = JSON.parse(this._encryptor.decrypt(await readFile(this.path)));
      if (callback) callback(null, data);
      return data;
    } catch (err) {
      if (callback) return callback(err);
      throw new Error('An error occured when reading the DB\n' + err);
    }
  }

  /**
   * Write to the DB
   * @param {string} data Data to write
   * @param {(err: any) => void} callback Callback to execute after save
   * @returns {Promise<void>} Promise that resolves when the write is complete
   */
  async _write(data, callback = null) {
    // Check if "data" is the wrong data type
    if (typeof data !== 'object') throw new TypeError('Data must be of type "object"');

    // Write to "tmp/data.json" and rename file. Throws if errors
    try {
      fs.writeFileSync(this._tmpFilePath, this._encryptor.encrypt(JSON.stringify(data)));
      fs.renameSync(this._tmpFilePath, this.path);

      // Return the callback
      if (callback) callback(null);
      return null;
    } catch (err) {
      if (callback) return callback(err);
      throw new Error('An error occured when writing to the DB:\n' + err);
    }
  }

  /**
   * Set the collection's data
   * @param {string} collection The collection name
   * @param {object} data The data to write to the collection
   * @param {(err: any) => void} callback The callback to execute after the write
   * @returns {Promise<void>} Promise that resolves after the write
   */
  async _setCollection(collection, data, callback = null) {
    // Check if "collection" or "data" are the wrong type
    if (typeof collection !== 'string') throw new TypeError('Type of collection must be "string"');
    if (data === undefined) throw new Error('Tried to save to DB without any data');
    try {

      // Read data then set dbData of collection to data
      const dbData = await this._read();
      dbData[collection] = data;

      // Write with the updated data
      await this._write(dbData);

      // Return the callback
      if (callback) callback(null);
      return null;
    } catch (err) {
      if (callback) return callback(err);
      throw err;
    }
  }

  /**
   * Choose a collection
   * @param {string} collection The name of the collection
   * @param {{ caching: boolean }} options The collection options
   * @param {(err: any, collection: import('./Collection')) => void} callback The callback to execute after
   * @returns {Collection} The collection corresponding the the given name 
   */
  async collection(collection, options, callback = null) {
    // Check if "collection" is the wrong data type
    if (typeof collection !== 'string') throw new TypeError('Collection name must be of type "string"');
    try {

      // Check if the collection is cached and return a new Collection if not.
      if (!this._collections[collection]) this._collections[collection] = new Collection(collection, options, this);

      // Return a callback or just collection
      if (callback) return callback(null, this._collections[collection]);
      return this._collections[collection];
    } catch (err) {
      if (callback) return callback(err);
      throw err;
    }
  }

  /**
   * Clear the DB of all its data
   * @param {(err: any) => void} callback
   * @returns {Promise<void>} Promise that resolves after clearing the DB
   */
  async clear(callback = null) {
    // No user, you can't just clear the DB
    // Data go brrrrrrrr
    await this._write({}, callback);
  }
}

module.exports = PoggersDB;
