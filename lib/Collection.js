class Collection {
  constructor(name, options = { caching: false }, Database) {
    // Check if "name" is the wrong data type
    if (typeof name !== 'string') throw new Error('Collection name must be of type string');

    // Variables
    this.options = options;
    this.name = name;
    this._db = Database;

    // IF the data is undefined, write an empty object
    if (this._read() === undefined) this._write({});
  }

  /**
   * Read the Collection
   * @returns {object}
   */
  _read() {
    // IF caching {
    //   IF cached {
    //     return cached
    //   } else return read()
    // } else return read()
    return this.options.caching ? this._data ? this._data : (this._db._read())[this.name] : (this._db._read())[this.name];
  }

  /**
   * Read from the DB
   * @param {object} data Data to be written
   * @returns {boolean} success
   */
  _write(data) {
    // Check if "data" is the wrong data type
    if (data === undefined) throw new Error('Tried to write to DB without any data');

    // IF caching set cached data to data given in function
    this._data = this.options.caching ? data : undefined;
    return this._db._setCollection(this.name, data);
  }

  /**
   * Cursor data to DB
   * @param {string} key key for data
   * @param {any} value value for the key to be set to
   * @returns {any} The data of the key
   */
  _cursor(key, value) {
    // TODO: have flaze comment this code
    if (!['string', 'number'].includes(typeof key)) throw new Error('Key must be of type string or number');
    key = String(key);
    const properties = key.split('.');
    const lastProperty = properties.pop();
    const data = this._read();
    if (!['object', 'undefined'].includes(typeof data)) throw new Error('collection data is not of type object');
    let cursor = data;
    for (const property of properties) {
      if (cursor[property] === undefined && value !== undefined) cursor[property] = {};
      if (typeof cursor[property] !== 'object') throw new Error('Cannot nest a non-object');
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
    // Check if "key" and "data" are the wrong data types
    if (key === undefined) throw new Error('Tried to save to collection without a key');
    if (!['string', 'number'].includes(typeof key)) throw new Error('Key must be of type string or number');
    key = String(key);
    if (data === undefined) throw new Error('Tried to save to collection without any data');

    // Get the data of the key
    const currentData = this._cursor(key);

    // IF it is not an array, and is defined, error
    if (!(currentData instanceof Array) && currentData !== undefined) throw new Error('Tried to push data to a value with type not of array');

    // Set the newData to the old array or an empty array and push the given data
    const newData = currentData || [];
    newData.push(data);

    // Write the new data to the disk
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
    // Check if "key" and "data" are the wrong data types
    if (key === undefined) throw new Error('Tried to save to collection without a key');
    if (!['string', 'number'].includes(typeof key)) throw new TypeError('Key must be of type string or number');
    key = String(key);
    if (data === undefined) throw new Error('Tried to save to collection without any data');

    // Write the data, setting key to data, return true
    this._write(this._cursor(key, data));
    return true;
  }

  /**
   * Get data from the collection
   * @param key key for data
   * @returns {object} The data for the key
   */
  get(key) {
    // IF no key, return the entire collection
    if (key === undefined) return this._read();

    // Check if "key" is the wrong data type
    if (!['string', 'number'].includes(typeof key)) throw new TypeError('Key must be of type string or number');

    // Just make sure it is a string
    key = String(key);

    // Return the data for "key"
    return this._cursor(key);
  }

  /**
   * Check if data is available in collection
   * @param key key for data
   * @returns {boolean} Whether the collection has the key
   */
  has(key) {
    // Check if "key" is the wrong data type
    if (!['string', 'number'].includes(typeof key)) throw new TypeError('Key must be of type string or number');

    // Just make sure it is a string
    key = String(key);

    // Return defined or not
    return this._cursor(key) !== undefined;
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

  /**
   * ![img](https://i.imgur.com/e5p1l3b.gif)
   */
  raid() {
    // Good shit!
    return 'https://i.imgur.com/e5p1l3b.gif';
  }
}

module.exports = Collection;
