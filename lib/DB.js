const fs = require('fs');
const path = require('path');

const Collection = require('./Collection.js');

class DB {
	constructor(databasePath, options = { renameFile: true, writeFile: false }) {
		this.options = options;
		this.path = path.resolve(databasePath);
		this._tmpFilePath = path.resolve(__dirname, '../../tmp/data.json');
		this._collections = {};

		// Create tmp/ folder if non-existent
		const tmpPath = path.resolve(__dirname, '../../tmp');
		if (!fs.existsSync(tmpPath)) fs.mkdirSync(tmpPath);

		if (!fs.existsSync(this.path)) {
			if (
				this.options.renameFile &&
				fs.existsSync(this.path.replace(/json/g, 'jason'))
			) {
				// Idk what this does lmao
				this.path = this.path.replace(/json/g, 'jason');
			} else if (this.options.writeFile && !fs.existsSync(this.path)) {
				// Write default file
				fs.writeFileSync(this.path, '{}', 'utf8');
			} else throw new Error('Specified file does not exist.');
		}

		try {
			// If enabled, rename ".json" to ".jason" extension
			if (this.path.includes('json') && this.options.renameFile) {
				this.path = this.path.replace(/json/g, 'jason');
				fs.renameSync(path.resolve(databasePath), this.path);
			}

			JSON.parse(fs.readFileSync(this.path, 'utf8')); // Check that data can be read
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
			// Read and parse data
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
		if (data === undefined)
			throw new Error('Tried to write to DB without any data');
		if (!['object', 'array'].includes(typeof data))
			throw new Error('collection name must be of type object or array');

		try {
			data = JSON.stringify(data);

			// Write to tmpFilePath and rename to actual path
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
		// Validations
		if (!collection)
			throw new Error('Tried to save to DB without a collection name');
		if (typeof collection !== 'string')
			throw new Error('collection name must be of type string');
		if (data === undefined)
			throw new Error('Tried to save to DB without any data');

		// Read and update data
		const dbData = this._read();
		dbData[collection] = data;

		this._write(dbData);
		return true;
	}

	/**
	 * Choose a collection
	 * @param collection Collection of DB
	 * @returns {Collection} The Collection
	 */
	collection(collection, options = { caching: false }) {
		// Validations
		if (!collection)
			throw new Error('collection name is required when choosing a collection');
		if (typeof collection !== 'string')
			throw new Error('collection name must be of type string');

		// Return if collection already exists
		if (this._collections[collection]) return this._collections[collection];

		// Create and return collection
		options = options || this.options; // Choose options
		this._collections[collection] = new Collection(collection, options, this);
		return this._collections[collection];
	}

	/**
	 * Clear the DB of all its data
	 * @param boolean To make sure you wan't do delete the data
	 * @returns {boolean} Success
	 */
	clear(boolean) {
		if (boolean !== true)
			throw new Error('Tried to clear DB without a true boolean');

		this._write({}); // Clear file
		return true;
	}
}

module.exports = DB;
