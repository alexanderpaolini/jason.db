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
		if (!/\.poggers$/i.test(path)) path += '.poggers';
		path = normalize(path);
		this.options = options;
		this._tmpFilePath = resolve(__dirname, '../../tmp/data.json');
		this.path = path;
		this._encryptor = new PoggersEncryptor();
		this._collections = {};
		if (!fs.existsSync(this.path)) {
			if (this.options.writeFile) {
				fs.writeFileSync(this.path, this._encryptor.encrypt('{}'));
			} else throw new Error('Specified file does not exist.');
		}
		try {
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
		if (data === undefined) throw new Error('Cannot save undefined data');
		if (typeof data !== 'object') throw new TypeError('Data must be of type "object"');
		try {
			fs.writeFileSync(this._tmpFilePath, this._encryptor.encrypt(JSON.stringify(data)));
			fs.renameSync(this._tmpFilePath, this.path);
			if (callback) callback(null);
		} catch (err) {
			if (callback) return callback(err);
			throw new Error(`Error saving data to database: ${err.message || err}`);
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
		try {
			if (typeof collection !== 'string') throw new TypeError('Type of collection must be "string"');
			if (data === undefined) throw new Error('Tried to save to DB without any data');
			const dbData = await this._read();
			dbData[collection] = data;
			await this._write(dbData);
			if (callback) callback(null);
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
	 */
	async collection(collection, options, callback = null) {
		try {
			if (typeof collection !== 'string') throw new TypeError('Collection name must be of type "string"');
			if (!this._collections[collection]) this._collections[collection] = new Collection(collection, options, this);
			if(callback) return callback(null, this._collections[collection]);
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
		await this._write({}, callback);
	}
}

module.exports = PoggersDB;
