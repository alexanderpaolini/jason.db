const fs = require('fs');
const { readFile } = require('fs/promises');
const { normalize, resolve } = require('path');
const Collection = require('./Collection');
const PoggersEncryptor = require('./PoggersEncryptor');

class PoggersDB {
	/**
	 *
	 * @param {string} path The database file's path
	 * @param {{ writeFile: boolean }} options The DB options
	 */
	constructor(path, options = {}) {
		const { writeFile = false } = options;

		// Normalize path
		if (!/\.pog$/i.test(path)) path += '.pog';
		path = normalize(path);

		// Variable initialization
		this.path = path;
		this._encryptor = new PoggersEncryptor();
		this._collections = {};

		// Create file if missing
		if (writeFile && !existsSync(this.path)) {
			writeFileSync(this.path, this._encryptor.encrypt('{}'));
		}
	}

	/**
	 *
	 * @param {string} collection The collection name
	 * @param {object} data The data to write to the collection
	 * @param {(err: any) => void} callback The callback to execute after the write
	 * @returns {Promise<void>} Promise that resolves after the write
	 */
	async _setCollection(collection, data, callback = null) {
		try {
			if (typeof collection !== 'string')
				throw new TypeError('Type of collection must be "string"');

			if (data == null) throw new Error('Cannot save null or undefined data');

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
	 *
	 * @param {string} collection The name of the collection
	 * @param {{ caching: boolean }} options The collection options
	 * @param {(err: any, collection: import('./Collection')) => void} callback The callback to execute after
	 */
	async collection(collection, options, callback = null) {
		try {
			// Validate collection name
			if (typeof collection !== 'string')
				throw new TypeError('Collection must be of type "string"');

			// Create collection
			if (!this._collections[collection]) {
				this._collections[collection] = new Collection(collection, options);
			}

			return this._collections[collection];
		} catch (err) {
			if (callback) return callback(err);
			throw err;
		}
	}

	/**
	 * Writes to the database
	 * @param {string} data Data to write
	 * @param {(err: any) => void} callback Callback to execute after save
	 * @returns {Promise<void>} Promise that resolves when the write is complete
	 */
	async _write(data, callback = null) {
		// Validate data
		if (data === undefined) throw new Error('Cannot save undefined data');
		if (typeof data !== 'object')
			throw new TypeError('Data must be of type "object"');

		try {
			// Write encrypted data
			data = this._encryptor.encrypt(JSON.stringify(data));
			await writeFile(this.path, data);

			if (callback) callback(null); // Run callback
		} catch (err) {
			if (callback) return callback(err);

			throw new Error(`Error saving data to database: ${err.message || err}`);
		}
	}

	/**
	 *	Reads the DB's data
	 * @param {(err: any, data: object) => void} callback The callback to execute after reading
	 * @returns {object} The DB's data
	 */
	async _read(callback = null) {
		try {
			const text = await readFile(this.path);
			const data = JSON.parse(this._encryptor.decrypt(text));

			if (callback) callback(null, data);
			return data;
		} catch (err) {
			if (callback) return callback(err);

			throw new Error(`Error reading database: ${err.message || err}`);
		}
	}

	/**
	 * Clears the whole database
	 * @param {(err: any) => void} callback
	 * @returns {Promise<void>} Promise that resolves after clearing the DB
	 */
	async clear(callback = null) {
		await this._write({}, callback);
	}
}

module.exports = PoggersDB;
