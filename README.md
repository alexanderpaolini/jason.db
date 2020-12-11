# jason.db (jason's db)

I was bored, so I made this garbage JSON database. Don't use it unless you are just staring a project and need a temperary database. It isn't very fast and is very memory inefficient.

---

### Example:

```js
const jasonDB = require("jason.db");
const DB = new jasonDB("db.json", { caching: true, renameFile: false });

DB.collection("data").set("data", "value");
DB.collection("data").push("dataArray", "value");
DB.collection("data").set("object.data", "nested value");

console.log(DB.collection("data").has("data")); // true
console.log(DB.collection("data").get("data")); // value
console.log(DB.collection("data").get("data")); // ["value"]
console.log(DB.collection("data").get("object")); // { data: "nested value" }
console.log(DB.collection("data").get()); // { data: 'value', dataArray: [ 'value' ], object: { data: 'nested value' } }

DB.clear(true);
console.log(DB.collection("data").get()); // {}
```

---

## Options

Options passed into the DB

| Option     | Type    | Default | Description                                                               |
| ---------- | ------- | ------- | ------------------------------------------------------------------------- |
| caching    | boolean | false   | Enables caching the entire json file in memory                            |
| renameFile | boolean | true    | Enable renaming the file, replacing all occurances of "json" with "jason" |

---

## DB

### DB.collection()

`DB.collection(name)`

**`returns`** - `Collection`

Returns a collection, if none exists with the name, it will be created.

- **`name (sring)`** - The name of the collection.

### DB.clear()

`DB.clear(boolean)`

**`returns`** - `boolean`

Returns a boolean, the success of the clear.

- **`boolean (boolean)`** - The name of the collection.

---

## Collection

### Collection.push()

`Collection.push(key, data)`

**`returns`** - `boolean`

Returns a boolean, the success of the save.

- **`key (string | number)`** - The key of the data.
- **`data (any)`** - The data to push to the array.

### Collection.set()

`Collection.set(key, data)`

**`returns`** - `boolean`

Returns a boolean, the success of the save.

- **`key (string | number)`** - The key of the data.
- **`data (any)`** - The data to save.

### Collection.get()

`Collection.get(key)`

**`returns`** - `any`

Returns the data set to the key.

- **`key (string | number)`** - The key of the data.

### Collection.has()

`Collection.push(key, data)`

**`returns`** - `boolean`

Returns a boolean, if the collection has data with that key.

- **`key (boolean)`** - The key of the data.

---

## Contributiors

[flazepe](https://github.com/flazepe) - Code for nested objects
