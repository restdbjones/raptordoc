---
id: nodenosql
slug: nosql-database-api
title: Database API
tags: [nosql, database,'nosql dbs', query, crud, stream]
keywords: [
  "NoSQL Database API",
  "Serverless NoSQL Database",
  "CRUD Operations NoSQL",
  "Data Streaming API",
  "JavaScript Database API",
  "Datastore.open()",
  "InsertOne NoSQL",
  "GetOne Query NoSQL",
  "UpdateOne NoSQL",
  "RemoveOne NoSQL",
  "JSON Schema Validation",
  "NoSQL Collection Management",
  "Serverless Data Storage",
  "NoSQL Query Language",
  "NoSQL Data Manipulation",
  "How to use NoSQL database",
  "NoSQL vs SQL",
  "Best practices for NoSQL",
  "NoSQL performance optimization",
  "NoSQL data modeling"
]
---

# Database API

The Database API provides a powerful and flexible interface for interacting with the built-in NoSQL datastore in your Codehooks project. This API allows you to perform a wide range of operations, from basic CRUD (Create, Read, Update, Delete) to more advanced querying and data manipulation.

## Key Features

- **NoSQL Flexibility**: Work with schema-less data structures for maximum adaptability.
- **CRUD Operations**: Easily insert, retrieve, update, and delete documents.
- **Advanced Querying**: Use MongoDB-style query language for complex data retrieval.
- **Data Streaming**: Efficiently handle large datasets with streaming capabilities.
- **Schema Validation**: Optionally enforce data structure with JSON Schema.
- **Collection Management**: Programmatically create and manage database collections.

## Getting Started

To use the Database API, you'll first need to open a connection to the datastore:

```js
import { Datastore } from 'codehooks-js'

async function myDatabaseFunction() {
    const conn = await Datastore.open();
    // Use conn to interact with the database
    // ...
}
```

Once you have a connection, you can use various methods to interact with your data. Here's a quick overview of some common operations:

- `insertOne()`: Add a new document to a collection
- `getOne()`: Retrieve a single document by ID or query
- `getMany()`: Retrieve multiple documents matching a query
- `updateOne()`: Modify a single document
- `removeOne()`: Delete a single document

For more detailed information on each method and advanced usage, refer to the specific sections below.

**API quick overview**

<TOCInline toc={toc} />

## Datastore.open()

Datastore.open() opens a connection to a datastore in the active project space.

```js
import {Datastore} from 'codehooks-js'

async function myfunc() {
    const conn = await Datastore.open();
    // use conn to call API functions
    ...
}
```

**Returns** Promise / Datastore connection

## insertOne(collection, document)

Insert a new data object into a collection in a datastore.

**Parameters**

- **collection**: collection name
- **document**: JSON document or array of JSON documents

**Returns:** Promise with the new JSON document and an unique `_id` value.

**Validation exceptions:** [See JSON-schema validation](#data-validation)

**Code example**
```js {6}
import {app, Datastore} from 'codehooks-js'

async function createSale(req, res) {
    const conn = await Datastore.open();    
    try {
        const doc = await conn.insertOne('sales', req.body);  
        // return new document to client
        res.status(201).json(doc);
    } catch (error) {
        if (error.schemaError) {
            // JSON-schema validation error
            res.status(400).json(error);
        } else {
            // unknown error
            res.status(500).json({error: error.message})
        }        
    }
}
// Serverless route hook
app.post('/sales', createSale);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
POST
https://myproject-ff00.api.codehooks.io/dev/sales

Example input:
{
    "Region": "North America",
    "Item Type": "Cereal",
    "Volume": 200
}

Example output:
{
    "_id": "640f60e2b4fdc00015c4280f",
    "Region": "North America",
    "Item Type": "Cereal",
    "Volume": 200
}
```



## getOne(collection, ID | Query)

Get one data object by ID or by Query from a collection in a datastore.

**Parameters**

- **collection**: name of collection
- **ID** or **Query**: the `_id` value, or a Query `{value: "some value"}`

**Returns** Promise with json document

**Code example**
```js {7}
import {app, Datastore} from 'codehooks-js'

async function getOne(req, res) {
    try {
        const conn = await Datastore.open();
        const {id} = req.params;
        const data = await conn.getOne('customer', id); // same as conn.getOne('customer', {_id: id})
        res.json(data)
    } catch (error) {
        // not found
        res.status(404).json({error: error.message})
    }
}
// Serverless route hook
app.get('/cust/:id', getOne);

export default app.init(); // Bind functions to the serverless runtime
```
**Example input and result**
```js
GET
https://myproject-ff00.api.codehooks.io/dev/cust/640f60f2b4fdc00015c42811

Example output:
{
    "name": "Acme Inc.",
    _id: "640f60f2b4fdc00015c42811"
}
```

## findOne(collection, ID | Query)

Alias for [getOne](#getonecollection-id--query)

## find(collection, query, options)

Alias for [getMany](#getmanycollection-query-options)

## getMany(collection, query, options)

Stream multiple data objects from a collection in a datastore.
Data are sorted naturally by the index for the collection, default index is by `_id` which will stream data in chronological order.


**Parameters**

- **collection**: collection name (mandatory)
- **query**: mongoDB query object, e.g. `{name: "Jane"}` [(Read query language docs)](nosql-database-query-language). Default query is empty `{}`, i.e. all objects 
- **options** (optional settings)
  - **sort**: mongoDB sort object. E.g. sort by name ascending `{"name": 1}`
  - **limit**: how many items to return
  - **hints**: include or omit fields
    - Include fields example: `{$fields: {name: 1, address: 1}}`
    - Omit fields example: `{$fields: {name: 0, _id_: 0}}`
  - **offset**: how many items to skip before returning any
  
**Returns** a JSON array data stream.


### Simple code example
```js {5}
import {app, Datastore} from 'codehooks-js'

async function getSales(req, res) {
    const conn = await Datastore.open();    
    conn.getMany('sales').json(res); // pipe json stream to client
}
// Serverless route hook
app.get('/sales', getSales);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
GET
https://myproject-ff00.api.codehooks.io/dev/sales

Example output:
[
    {
        "Region": "France",
        "Item Type": "Veal",
        "Volume": 130,
        "Unit Price": 2005.7,
        "Unit Cost": 11s7.11,
        "_id": "640f60e2b4fdc00015c4280f"
    },
    {
        "Region": "Germany",
        "Item Type": "Haxe",
        "Volume": 30,
        "Unit Price": 30.4,
        "Unit Cost": 32.43,
        "_id": "640f60e2b4fdc00015c4282f"
    }
]
```

### Advanced code example
```js {10}
import {app, Datastore} from 'codehooks-js'

async function getSales(req, res) {
    const conn = await Datastore.open();
    const query = {"Volume": {$gt: req.params.vol}};
    const options = {
        limit: 1000,
        hints: {$fields: {status: 0, _id: 0}}        
    }    
    conn.getMany('sales', query, options).json(res); // json stream is piped back to client
}
// Serverless route hook
app.get('/sales/:vol', getSales);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
GET
https://myproject-ff00.api.codehooks.io/dev/sales/1000

Example output:
[
    {
        "Region": "North America",
        "Item Type": "Cereal",
        "Volume": 1304,
        "Unit Price": 205.7,
        "Unit Cost": 117.11
    },
    {
        "Region": "North America",
        "Item Type": "Cereal",
        "Volume": 1306,
        "Unit Price": 10.3,
        "Unit Cost": 3.3
    }
]
```

### Streaming data code example
With the steaming API you're in full control over how to deliver data back to a client.
In this example the `content-type` is set first, next the code is using `forEach` to iterate the stream to output one line of data per database object.

```js {8,10}
import {app, Datastore} from 'codehooks-js'

async function getSales(req, res) {
    res.set('content-type', 'text/plain')
    const conn = await Datastore.open();    
    let count = 0;
    const cursor = conn.getMany('sales', {"Item Type": "Cereal"})
    await cursor.forEach((item) => {
        // use the response.write to stream data back to client
        res.write(`Item ${count++} has volume ${item.Volume}\n`)
    })
    res.end()
}
// Serverless route hook
app.get('/sales', getSales);

export default app.init(); // Bind functions to the serverless runtime
```

Output from the streaming data code example:

```
Item 0 has volume 1304
Item 1 has volume 1306
...
```

## toArray(collection, query, options)

Utility function to return multiple data objects as an array of objects from the [getMany](#getmanycollection-options) API call.

**Simple code example**
```js {6}
import {app, Datastore} from 'codehooks-js'

async function getSales(req, res) {
    const conn = await Datastore.open();    
    const query = {"product": "foo"}; // query for foo products
    const array = await conn.getMany('sales', query).toArray(); // as array
    // return json array
    res.json(array);
}
// Serverless route hook
app.get('/sales', getSales);

export default app.init(); // Bind functions to the serverless runtime
```

## updateOne(collection, ID | Query, updateoperators, options)

Update one data object by ID or by Query in a datastore collection.
Input document is patched with the matched database object.

**Parameters**

- **collection**: name of collection
- **ID** or **Query**: the `_id` value, or a Query `{value: "some value"}`
- **updateoperators**: new json document to update or [manipulate data operators](dataoperators)
- **options**: (optional settings)
    - **upsert**: Create a new document if ID does not exist by `{upsert: true}`

**Returns:** Promise with updated json document

**Validation exceptions:** [See JSON-schema validation](#data-validation)

### Code example: update by ID
```js {7}
import {app, Datastore} from 'codehooks-js'

async function myFunc(req, res) {
    const {id} = req.params;
    const {body} = req;
    const conn = await Datastore.open();
    const data = await conn.updateOne('customer', {_id: id}, {$set: body});
    res.json(data);
}
// Serverless route hook
app.put('/cust/:id', myFunc);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
POST
https://myproject-ff00.api.codehooks.io/dev/cust/640f60f2b4fdc00015c42811

Example input:
{
    "name": "Acme Inc.",
    "sales": 42
}
```

### Code example: update using the upsert option

```js {17}
// upsert api route
app.post('/update', async (req, res) => {
  const {email} = req.body;
  console.log('upsert', email)
  const conn = await datastore.open()
  const upsertResult = await conn.updateOne('users', 
  // query
  {
    "emailAddress": email
  },
  // update operators
  {
    $set: { "emailAddress": email },
    $inc: { "visits": 1 }
  }, 
  // upsert option
  {upsert: true})
  res.json(upsertResult)
})
```

**Example input and result**

```js
POST
https://myproject-ff00.api.codehooks.io/dev/update

# example input:
{
    "email": "jane@examle.com"
}

# example output:
{
    "emailAddress": "jane@example.com",
    "visits": 8,
    "_id": "658af419d44110bef4e88beb"
}

```

## updateMany(collection, query, document, options)

Update multiple data objects in a datastore collection.
Input document is patched with the matched database objects.

**Parameters**

- **collection**: name of collection
- **query**: mongoDB query object [(docs)](nosql-database-query-language)
- **document**: new json document to update or [manipulate](dataoperators)
- **options** (optional settings)

**Returns:** Promise with count of objects updated

**Validation exceptions:** [See JSON-schema validation](#data-validation)

**Code example**
```js {12}
import {app, Datastore} from 'codehooks-js'

async function myFunc(req, res) {
    const conn = await Datastore.open();
    const query = {
        "customerStatus": "GOLD"
    }
    const doc = {
        $inc: {"bonus": "20"}, 
        $set: {customerStatus: "PLATINUM"}
    };
    const data = await conn.updateMany('customer', query, doc);
    res.json(data);
}
// Serverless route hook
app.put('/cust', myFunc);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
PUT
https://myproject-ff00.api.codehooks.io/dev/cust

Example output:
[
    {
    "name": "Acme Inc.",
    "customerStatus": "PLATINUM",
    "bonus": "20",
    _id: "640f60f2b4fdc00015c42811"
    },
    {
    "name": "Colo Inc.",
    "customerStatus": "PLATINUM",
    "bonus": "30",
    _id: "640f60f2b4fdc00015c42f00"
    },
    ...
]
```

## replaceOne(collection, ID | Query, document, options)

Replace one data object by ID or by Query in a datastore collection.
Input document overwrites the matched database object, the `_id` value is not overwritten.

**Parameters**

- **collection**: name of collection
- **ID** or **Query**: the `_id` value, or a Query `{value: "some value"}`
- **document**: new json document to replace
- **options**: (optional settings)
  - **upsert**: Create a new document if ID does not exist by `{upsert: true}`

**Returns** Promise with updated json document

**Validation exceptions:** [See JSON-schema validation](#data-validation)

**Code example**
```js {5}
import {app, Datastore} from 'codehooks-js'

async function myFunc(req, res) {
    const conn = await Datastore.open();
    const data = await conn.replaceOne('customer', {_id: req.params.id}, req.body);
    res.json(data);
}
// Serverless route hook
app.put('/cust/:id', myFunc);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
POST
https://myproject-ff00.api.codehooks.io/dev/cust/640f60f2b4fdc00015c42811

Example input:
{
    "name": "Acme Replacement Inc.",
    "sales": 0
}
```

## replaceMany(collection, query, document, options)

Replace multiple data objects in a datastore collection.
Input document overwrites the matched database objects. The `_id` value is not overwritten.

**Parameters**

- **collection**: name of collection
- **query**: mongoDB query object [(docs)](nosql-database-query-language)
- **document**: new json document to replace
- **options** (optional settings)

**Returns** Promise with count of objects updated

**Validation exceptions:** [See JSON-schema validation](#data-validation)

**Code example**
```js {11}
import {app, Datastore} from 'codehooks-js'

async function myFunc(req, res) {
    const conn = await Datastore.open();
    const query = {
        "customerStatus": "GOLD"
    }
    const doc = {
        "Acme": "was here"
    };
    const data = await conn.replaceMany('customer', query, doc);
    res.json(data);
}
// Serverless route hook
app.put('/cust', myFunc);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
PUT
https://myproject-ff00.api.codehooks.io/dev/cust

Example output:
[
    {
    "Acme": "was here"
    _id: "640f60f2b4fdc00015c42811"
    },
    {
    "Acme": "was here"
    _id: "640f60f2b4fdc00015c400fe"
    },
    ...
]
```

## removeOne(collection, ID | Query)

Remove one data object by ID or by Query in a datastore collection.

**Parameters**

- **collection**: name of collection
- **ID** or **Query**: the `_id` value, or a Query `{value: "some value"}`

**Returns** Promise with document ID

**Code example**

```js {5}
import {app, Datastore} from 'codehooks-js'

async function myFunc(req, res) {
    const conn = await Datastore.open();
    const data = await conn.removeOne('customer', {_id: req.params.id});
    res.json(data);
}
// Serverless route hook
app.delete('/cust/:id', myFunc);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
DELETE
https://myproject-ff00.api.codehooks.io/dev/cust/640f60f2b4fdc00015c42811

Example output:
640f60f2b4fdc00015c42811
```

## removeMany(collection, query, options)

Remove multiple data objects in a datastore collection.

**Parameters**

- **collection**: name of collection
- **query**: mongoDB query object [(docs)](nosql-database-query-language)
- **options** (optional settings)

**Returns** Promise with count of objects deleted

**Code example**
```js {8}
import {app, Datastore} from 'codehooks-js'

async function myFunc(req, res) {
    const conn = await Datastore.open();
    const query = {
        "customerStatus": "GOLD"
    }
    const data = await conn.removeMany('customer', query);
    res.json(data);
}
// Serverless route hook
app.delete('/cust', myFunc);

export default app.init(); // Bind functions to the serverless runtime
```

**Example input and result**
```js
DELETE
https://myproject-ff00.api.codehooks.io/dev/cust

Example output:
{"count": 3}
```

## Data validation

Add data validation (JSON-schema) to any database collection directly to the database collection using the [CLI command](/docs/cli#add-schema) `add-schema` or the Codehooks Studio application navigating to Collection/Settings/JSON-Schema.

![json-schema](./images/studio/json-schema.png)

### Example: Defining a JSON Schema using the CLI

To ensure your data is consistent and secure, you can define a [JSON Schema](https://json-schema.org/) for your collections. This schema will validate the data structure and enforce data types.

Create a schema file (e.g., `personSchema.json`) defining the structure of your data:

```js
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Person",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string",
      "description": "The person's first name."
    },
    "lastName": {
      "type": "string",
      "description": "The person's last name."
    },
    "age": {
      "type": "integer",
      "description": "The person's age.",
      "minimum": 0
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "The person's email address."
    },
  },
  "required": [
    "firstName",
    "lastName",
    "email"
  ]
}
```

Use the CLI to add this JSON Schema to your collection:

```bash
codehooks add-schema --collection 'person' --schema './personSchema.json'
```

### JSON-Schema validation errors and status code

In the event that clients sends data not following the JSON-Schema, a validator error will be thrown.
E.g. when the API posts a JSON object missing a required field a validator `schemaError` error array of objects will be returned.

```js
{
    "schemaError": [
        {
            "instancePath": "",
            "schemaPath": "#/required",
            "keyword": "required",
            "params": {
                "missingProperty": "firstName"
            },
            "message": "must have required property 'firstName'"
        }
    ]
}
```

### Data validation JSON schema API

The following API methods allow you to programmatically manage JSON schemas for your collections, providing an alternative to using the CLI or Codehooks Studio for schema management.

#### setSchema(collection, schema)

Set a JSON schema for a collection to enforce data validation.

**Parameters**

- **collection**: name of the collection
- **schema**: JSON schema object

**Returns** Promise with the result of the operation

**Code example**
```js
import { app, Datastore } from 'codehooks-js'
import { mySchema } from './schema.json'

async function setCollectionSchema(collection) {
    const conn = await Datastore.open();
    const result = await conn.setSchema(collection, mySchema);
    return result;
}

export default app.init(async () => {
    try {
        const result = await setCollectionSchema('person');
        console.log('Schema set successfully:', result);
    } catch (error) {
        console.error('Error setting schema:', error.message);
    }
});
```

#### getSchema(collection)

Retrieve the JSON schema for a collection.

**Parameters**

- **collection**: name of the collection

**Returns** Promise with the JSON schema or null if not set

**Code example**
```js
import {app, Datastore} from 'codehooks-js'

async function getCollectionSchema(req, res) {
    const conn = await Datastore.open();
    const {collection} = req.params;
    try {
        const schema = await conn.getSchema(collection);
        res.json(schema);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

app.get('/get-schema/:collection', getCollectionSchema);

export default app.init();
```

#### removeSchema(collection)

Remove the JSON schema from a collection.

**Parameters**

- **collection**: name of the collection

**Returns** Promise with the result of the operation

**Code example**
```js
import {app, Datastore} from 'codehooks-js'

async function removeCollectionSchema(req, res) {
    const conn = await Datastore.open();
    const {collection} = req.params;
    try {
        const result = await conn.removeSchema(collection);
        res.json(result);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

app.delete('/remove-schema/:collection', removeCollectionSchema);

export default app.init();
```

## Collection Management

The database API provides methods to create and drop collections, allowing you to manage the structure of your database.

### createCollection(collection, options)

Creates a new collection in the database.

**Parameters**

- **collection**: (String) The name of the collection to create.
- **options**: (Object, optional) Additional options for creating the collection.
  - **cap**: (Number, optional) Maximum number of documents in the collection.
  - **capdelay**: (Number, optional) Milliseconds to wait before capping the collection.
  - **schema**: (Object, optional) JSON Schema for validating documents in the collection. Must follow the [JSON Schema standard](https://json-schema.org/).

**Returns** Promise that resolves with the result of the operation.

**Simple code example**
```js
import { Datastore } from 'codehooks-js'

async function createSimpleCollection() {
    const conn = await Datastore.open();
    try {
        const result = await conn.createCollection('simpleCollection');
        console.log('Collection created:', result);
    } catch (error) {
        console.error('Error creating collection:', error);
    }
}
```

**Advanced example with schema and cap options**

```js
import { Datastore } from 'codehooks-js'

async function createAdvancedCollection() {
    const conn = await Datastore.open();
    try {
        const options = {
            cap: 100000,
            schema: {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "title": "IoTLog",
                "type": "object",
                "properties": {
                    "deviceId": {
                        "type": "string",
                        "description": "Unique identifier for the IoT device"
                    },
                    "timestamp": {
                        "type": "string",
                        "format": "date-time",
                        "description": "Timestamp of the log entry"
                    },
                    "temperature": {
                        "type": "number",
                        "description": "Temperature reading from the device"
                    },
                    "humidity": {
                        "type": "number",
                        "description": "Humidity reading from the device"
                    },
                    "batteryLevel": {
                        "type": "number",
                        "minimum": 0,
                        "maximum": 100,
                        "description": "Battery level of the device"
                    }
                },
                "required": ["deviceId", "timestamp", "temperature", "humidity", "batteryLevel"]
            }
        };
        await conn.createCollection('iotLogs', options);
        console.log('IoT Log collection created successfully');
    } catch (error) {
        console.error('Error creating IoT Log collection:', error);
    }
}
```

These examples demonstrate how to create a simple collection without any options, and how to create an advanced collection with a schema

### dropCollection(collection)

Removes an existing collection from the database.

**Parameters**

- **collection**: (String) The name of the collection to drop.

**Returns** Promise that resolves with the result of the operation.

**Code example**

```js
import { Datastore } from 'codehooks-js'

async function removeCollection() {
    const conn = await Datastore.open();
    try {
        const result = await conn.dropCollection('oldCollection');
        console.log('Collection dropped:', result);
    } catch (error) {
        console.error('Error dropping collection:', error);
    }
}
```

These methods allow you to programmatically manage the collections in your database. Use `createCollection` to add new collections and `dropCollection` to remove existing ones. Be cautious when using `dropCollection`, as it will permanently delete the collection and all its data.
