const fs = require('fs');
const path = require('path')

class DB {
    constructor(databasePath) {
        this._path = path.resolve(databasePath);
        if(!fs.existsSync(this._path)) throw 'Specified file does not exist.'
        try {
            this._data = JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch (err) {
            throw 'An error occured when reading the DB\n' + err;
        }
    }

    _writeDB(data) {
        if(!data) throw 'Tried to write to DB without any data.'
        try {
            data = JSON.stringify(data);
            fs.writeFileSync(path.resolve(__dirname, 'tmp/data.json'), data);
            fs.renameSync('tmp/data.json', this._path)
            return true;
        } catch (err) {
            throw 'An error occured when writing to the DB:\n' + err;
        }
    }

    readDB() {
        try {
            return JSON.parse(fs.readFileSync(this._path, 'utf8'));
        } catch (err) {
            throw 'An error occured when reading the DB\n' + err;
        }
    }

    saveToDB(collection, key, data) {
        if(!collection) throw 'Tried to save to DB without a collection name'
        if(!key) throw 'Tried to save to DB without a key'
        if(!data) throw 'Tried to save to DB without an data'
        let dbData = readDB();
        dbData[collection][key] = data;
        writeDB(dbData);
        return true;
    }

    clearDB(boolean) {
        if(boolean !== true) throw 'Tried to clear DB without a true boolean.'
        writeDB({})
    }
}

module.exports = DB;
