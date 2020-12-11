# JSON-DB

I was bored, so I made this garbage JSON database.

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
