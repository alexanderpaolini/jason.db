const fs = require('fs');

const Collection = require('./Collection.js');

class FileNameDB {
  constructor(folder, options = { startString: '__', endString: '__', joinString: ' ' }) {
    this.options = options;
    this.folder = folder;
    this._collections = {};
    if (!fs.existsSync(this.folder)) throw new Error('The folder must already exist.');
  }
  
  _getFile() {    
    const dir = fs.readdirSync(this.folder, 'utf8');
    const fileArray = [];
    dir.forEach(e => {
      if(e.startsWith(this.options.startString)) fileArray.push(e);
    });
    if(fileArray.length === 0) throw new Error(`There are no files in the folder that start with "${this.options.startString}"`);
    if(fileArray.length > 1) throw new Error(`There are ${fileArray.length} files in the folder that start with ${this.options.startString}`);
    return fileArray[0];
  }

  _read() {
    const fileName = this._getFile();
    const data = this._parse(fileName);
    return JSON.parse(data);
  }

  _write(data) {
    fs.unlinkSync(this.folder + this._getFile());
    fs.writeFileSync(this.folder + this.options.startString + this._clean(JSON.stringify(data)) + this.options.endString, 'PLACEHOLDER', 'utf8');
    return true;
  }

  _clean(data) {
    data = JSON.stringify(data);
    let str = this.options.joinString;
    for (const c of data) { str += c; }
    return str;
  }

  _parse(string) {
    const stringArray = string.split(this.options.joinString);
    let str = '';
    for (const ef of stringArray) { str += ef; }
    str = str.split(this.options.startString).join('');
    str = str.split(this.options.endString).join('');
    return JSON.parse(str);
  }

  _invert(obj) {
    return Object.entries(obj).reduce((ret, entry) => {
      const [ key, value ] = entry;
      ret[ value ] = key;
      return ret;
    }, {});
  }

  _setCollection(collection, data) {
    if (typeof collection !== 'string') throw new TypeError('Collection name must be of type "string"');
    if (data === undefined) throw new Error('Tried to save to DB without any data');
    const dbData = this._read();
    dbData[collection] = data;
    this._write(dbData);
    return true;
  }

  collection(collection, options = { caching: false }) {
    if (typeof collection !== 'string') throw new TypeError('Collection name must be of type "string"');
    if (!this._collections[collection]) this._collections[collection] = new Collection(collection, options, this);
    return this._collections[collection];
  }

  clear(boolean) {
    if (boolean !== true) throw new Error('Tried to clear DB without a true boolean');
    this._write({});
    return true;
  }
}

module.exports = FileNameDB;
