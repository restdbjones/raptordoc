# Query language

What is a NoSQL Query? Querying your [NoSQL](https://en.wikipedia.org/wiki/NoSQL) database is essential in many applications. The codehooks.io NoSQL database use a subset of the popular [MongoDB](https://mongodb.com) NoSQL query language.
NoSQL queries are used in the [database API](nosql-database-api) to find and filter data.
NoSQL database queries are powerful tools for developing backend application logic.

<div class="alert alert-info mt-6">
<div>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
<span>
REST API query
The NoSQL query language can be used directly for REST API queries when you use the 'crudlify' API. Read more about using REST API queries <a href="/docs/database-rest-api">on this page</a>.
</span>
</div>
</div>


## NoSQL Query Example: A Complete Code Example for a Database REST API

The example serverless JavaScript function below shows how to create a REST API that runs a NoSQL query against the database to fetch 100 items from the `customers` collection `where` the `customer.status` equals `GOLD`.

```js {5}
import {app, Datastore} from 'codehooks-js'

async function getData(req, res) {
    const conn = await Datastore.open();
    const query = {"status": "GOLD"};
    const options = {
        limit:100
    }
    conn.getMany('customers', query, options).json(res);
}

// Serverless REST API and query route
app.get('/customers', getData);

export default app.init(); // Bind functions to the serverless runtime
```

:::note
All query fields are case sensitive.
:::

## Filtering data from the database

![Filter data using REST API NoSQL Query and logical operators](/images/Search.png)

Filtering are performed using a combination of filters, logical and conditional operators explained below.

### Quick overview
|Operator|Description|Example|
|---|:---|---|
|field | Match a single field value | `{"field": "value"}` |
|fields | Match multiple fields and values | `{"field1": "value1", "field2": "value2"}` |
|[$regex](#regex-operator)  | Match field with a regular expression |`{"field" : {$regex : "^foo"}}`|
|[$startsWith](#startswith-operator) | Match field with start string segment | `{"field": {"$startsWith": "value"}}` |
|[$endssWith](#endswith-operator) | Match field with end string segment | `{"field": {"$endsWith": "value"}}` |

### Match multiple fields

Multiple fields are matched by name-value pairs in the a query:

```js
const query = {"field1": "value1", "field2": "value2"}
```

This is actually the same as using the `$and` operator: 

```js
const query = {$and: [{"field1": "value1"}, {"field2": "value2"}]}
```


### Match sub fields

Sub fields are matched by dot.property in the URL query parameter: 

```js
const query = {"field1.property": "value1"}
```

If your sub propery is an array, you must use the [$elemMatch](#elemmatch-operator) operator.

### **$regex** operator
Match a [regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet) against field. Optional `$options` values [docs.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags)

```js
const query = {"name" : {$regex : "^joe", $options: "i"}}

// or with native JS Regex
const query = {"name" : /^joe/}}
```

### **$startsWith** operator

Field is matched by starting string of value: 

```js
const query = {"Player": {"$startsWith": "Lionel"}}
```

### **$endsWith** operator

Field is matched by ending string of value: 

```js
const query = {"Player": {"$endsWith": "Messi"}}
```



## Logical operators

### Quick overview
|Operator|Description|Example|
|---|:---|---|
|[$not](#not-operator) | Negation logical operator|`{"field" : {$not : val}}`|
|[$in](#in-operator)   | Match any value in array |`{"field" : {$in : [value1, value2, ...]}}`|
|[$nin](#nin-operator)  | Not match any value in array |`{"field" : {$nin : [value1, value2, ...]}}`|
|[$or](#or-operator)  | Logical operator |`{$or: [{"status": "GOLD"}, {"status": "SILVER"}]}`|
|[$and](#and-operator)  | Logical operator |`{$and: [{"status": "GOLD"}, {"sales": 1000}]}`|


### **$not** operator
Return documents not matching the query.

```js
const query = {"name" : {$not : "Joe"}}
```

### **$in** operator
Return documents matching any values.

```js
const query = {"name" : {$in : ["Joe", "Jane", "Donald"]}}
```

### **$nin** operator
Return documents not matching any of the values.

```js
const query = {"name" : {$nin : ["Joe", "Jane", "Donald"]}}
```


### **$or** operator
Return documents that matches one or the other field.

```js
const query = {$or: [{"name": "Jane"}, {"name": "Donald"}]}
```

### **$and** operator
Return documents both fields.

```js
const query = {$and: [{"name": "Jane"}, {"last-name": "Cassidy"}]}
```

## Conditional operators

### Quick overview

|Operator|Description|Example|
|---|:---|---|
|$gt | Greater than |`{"salary": {$gt: 10000}}`|
|$gte | Greater than or equal |`{"salary": {$gte: 10000}}`|
|$lt | Less than |`{"salary": {$lt: 10000}}`|
|$lte | Less than or equal |`{"salary": {$lte: 10000}}`|
|$ne | Not equal |`{"email": {$ne: ""}}`|
|$exists | Check if field exists |`{"field": {$exists: true`&#124;`false}}`|
|$elemMatch | Array element matching |`{"contact":{$elemMatch:{"name":"Anderson", age:35}}}`|


### **$gt** operator
Return documents that matches each field value greater than numeric value.

```js
const query = {"salary": {$gt: 10000}}
```

### **$gte** operator
Return documents that matches each field value greater than or equal to numeric value.

```js
const query = {"salary": {$gte: 10000}}
```

### **$lt** operator
Return documents that matches each field value less than numeric value.

```js
const query = {"salary": {$lt: 10000}}
```

### **$lte** operator
Return documents that matches each field value less than or equal to numeric value.

```js
const query = {"salary": {$lte: 10000}}
```


### **$exists** operator
Return documents that matches each field with a value.

```js
const query = {"field": {$exists: true}}
```

### **$exists (sub array)** operator
Return documents that matches each sub field with any value.

```js
const query = {"field.0": {$exists: true}}
```

### **$elemMatch** operator
Return documents that matches at least one of the elements in an array field.

```js
const query = {"contact":{$elemMatch:{"name":"Anderson", age:35}}}
```

### **$date** operator

Querying based on dates are done using the `$date` operator combined with ISO date strings.
For example:
```js
// between two dates
const query = {"_changed":{$gt:{"$date":"2016-08-01"}, $lt:{"$date":"2016-08-05"}}}
```

## SQL to NoSQL query mapping examples

The following list shows [SQL](https://en.wikipedia.org/wiki/SQL) example statements expressed as NoSQL queries.

#### `SELECT * FROM users`
```js
/*
* SQL statement: 
* SELECT * FROM users
* expressed as a nosql database query
*/
const db = await Datastore.open();
db.find('users')
```

#### `SELECT user_id, status FROM users`

```js
const query = {};
const opt = {
    hints: {$fields: {user_id: 1, status: 1}}
}
db.find('users', query, opt)
```
#### `SELECT * FROM users  WHERE status = "A"`

```js
const query = {status: "A"};
db.find('users', query)
```

#### `SELECT * FROM users  WHERE status != "A"`

```js
const query = {"status":{"$not":"A"}}
db.find('users', query)
```

#### `SELECT * FROM users  WHERE status = "A" AND age = 50`

```js
const query = {"status": "A", "age": 50 }
db.find('users', query)
```

#### `SELECT * FROM users  WHERE status = "A" OR age = 50`

```js
const query = { "$or": [ { "status": "A" } ,{ "age": 50 } ] }
db.find('users', query)
```

#### `SELECT * FROM users  WHERE age > 25`

```js
const query = { "age": { "$gt": 25 } }
db.find('users', query)
```

#### `SELECT * FROM users  WHERE user_id like "bc%"`

```js
const query = { "user_id": /^bc/}
db.find('users', query)
```

#### `SELECT * FROM users  WHERE status = "A" ORDER BY name ASC`

```js {5}
// Use the CLI to create a sorted index
// $ codehooks createindex --collection users --index name
const query = { "status": "A" }
const opt = {
    sort: {"name": 1}
}
db.find('users', query, opt)
```

#### `SELECT * FROM users  WHERE status = "A" ORDER BY name DESC`

```js {6}
// Use the CLI to create a sorted index
// $ codehooks createindex --collection users --index name
const query = { "status": "A" }
const opt = {
    sort: {"name": -1}
}
db.find('users', query, opt)
```

#### `SELECT COUNT(*) FROM users`

```js
const query = {}
const opt = {
    hints: {$onlycount: true}, 
}
db.find('users', query, opt)
```

#### `SELECT COUNT(*) FROM users WHERE age > 30`

```js
const query = {age: {$gt: 30}}
const opt = {
    hints: {$onlycount: true}
}
db.find('users', query, opt)
```

#### `SELECT * FROM users LIMIT 1`

```js
const query = {}
const opt = { limit: 1 }
db.find('users', query, opt)
```

#### `SELECT * FROM users LIMIT 5 SKIP 10`

```js
const query = {}
const opt = {
    limit: 5,
    offset: 10
}
db.find('users', query, opt)
```
