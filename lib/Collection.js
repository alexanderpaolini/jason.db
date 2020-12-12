class Collection {
  constructor (name, options = { caching: false }, Database) {
    if (!name || typeof name !== 'string') throw new Error('Collection name must be of type string')
    this.options = options
    this.name = name
    this._db = Database
    if (this._read() === undefined) this._write({})
  }

  /**
   * Read the Collection
   * @returns {object}
   */
  _read () {
    return this.options.caching ? this._data ? this._data : (this._db._read())[this.name]: (this._db._read())[this.name]
  }

  /**
   * Read from the DB
   * @param {object} data Data to be written
   * @returns {boolean} success
   */
  _write (data) {
    if (data === undefined) throw new Error('Tried to write to DB without any data')
    this._data = this.options.caching ? data : undefined
    return this._db._setCollection(this.name, data)
  }

  /**
   * Cursor data to DB
   * @param {string} key key for data
   * @param {any} value value for the key to be set to
   * @returns {any} The data of the key
   */
  _cursor (key, value) {
    if (!['string', 'number'].includes(typeof key)) throw new Error('Key must be of type string or number')
    key = String(key)
    const properties = key.split('.')
    const lastProperty = properties.pop()
    const data = this._read()
    if (!['object', 'undefined'].includes(typeof data)) throw new Error('collection data is not of type object')
    let cursor = data
    for (const property of properties) {
      if (cursor[property] === undefined && value !== undefined) cursor[property] = {}
      if (typeof cursor[property] !== 'object') throw new Error('Cannot nest a non-object')
      cursor = (cursor || {})[property]
    }
    if (value !== undefined) {
      cursor[lastProperty] = value
      return data
    }
    return (cursor || {})[lastProperty]
  }

  /**
   * Save data to an array in the collection
   * @param {string | number} key key for data
   * @param {any} data Data for the key to be set to
   * @returns {boolean} success
   */
  push (key, data) {
    if (key === undefined) throw new Error('Tried to save to collection without a key')
    if (!['string', 'number'].includes(typeof key)) throw new Error('Key must be of type string or number')
    key = String(key)
    if (data === undefined) throw new Error('Tried to save to collection without any data')
    const currentData = this._cursor(key)
    if (!(currentData instanceof Array) && currentData !== undefined) throw new Error('Tried to push data to a value with type not of array')
    const newData = currentData || []
    newData.push(data)
    this._write(this._cursor(key, newData))
    return true
  }

  /**
   * Save data to the collection
   * @param {string | number} key key for data
   * @param {any} data Data for the key to be set to
   * @returns {boolean} success
   */
  set (key, data) {
    if (key === undefined) throw new Error('Tried to save to collection without a key')
    if (!['string', 'number'].includes(typeof key)) throw new Error('Key must be of type string or number')
    key = String(key)
    if (data === undefined) throw new Error('Tried to save to collection without any data')
    this._write(this._cursor(key, data))
    return true
  }

  /**
   * Get data from the collection
   * @param key key for data
   * @returns {object} The data for the key
   */
  get (key) {
    if (key === undefined) return this._read()
    if (!['string', 'number'].includes(typeof key)) throw new Error('Key must be of type string or number')
    key = String(key)
    return this._cursor(key)
  }

  /**
   * Check if data is available in collection
   * @param key key for data
   * @returns {boolean} Whether the collection has the key
   */
  has (key) {
    if (typeof key !== 'string') throw new Error('Key must be of type string')
    return this._cursor(key) !== undefined
  }

  /**
   * Clear the DB of all its data
   * @param boolean To make sure you wan't do delete the data
   * @returns {boolean} Success
  */
  clear (boolean) {
    if (boolean !== true) throw new Error('Tried to clear collection without a true boolean.')
    this._write({})
    return true
  }
}

module.exports = Collection
