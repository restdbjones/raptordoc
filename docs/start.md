---
id: quickstart-cli
title: Getting started
slug: /quickstart-cli
tags: [introduction, CLI]
keywords: [
  "Codehooks CLI Quickstart",
  "Serverless Project Creation",
  "CLI for Backend Development",
  "JavaScript Function Deployment",
  "Codehooks CLI Installation",
  "Create Serverless Codehook",
  "Deploy Code to Cloud",
  "Backend Development Tutorial",
  "Command Line Interface Guide",
  "Codehooks Project Setup"
]
---
# Quickstart

This short tutorial will show you how to create codehooks projects and spaces using the command line interface (CLI). Check out the [concepts](concepts) page for a more in-depth introduction. To use the Studio to create projects, check out this [quickstart](/docs).


## Install the CLI

Install the Codehooks command line interface (CLI), this lets you fully manage your projects from the command line.


```bash
npm i -g codehooks
```
> You need [Node.js](https://nodejs.org) to install the CLI.

:::tip Use 'Dev containers' to set up your codehooks development environment
Our CLI requires use of the terminal window, which can sometimes be challenging especially for Windows users. Check out our blog post about [how to set up a dev container](/blog/simplify-codehooks-development-with-devcontainers) for simplified and more consistent codehooks.io development environment on all platforms. 
:::

## Sign up and Log in

Next you need to sign up / log in to your account (it's totally free), in this example we use a Github account. Your browser will open and direct you a  secure login page, and there you can return to the CLI - logged in.

```bash
coho login
```

Then choose login method, e.g. Github.

```bash
Select option below

❯ Use Github
  Use Google
  Exit
```

## Create project

Lets go forward and create a new project on your account.
A project contains the source code for your serverless functions.

```bash
coho create myproject
```
Follow the guide to create a personal or team project type.

Finally change directory to the new project and install the Codehooks standard library.

```bash
cd myproject
```

The `coho create` command has now created a new project space and generated a unique name for the API, in this example it's named `myproject-2b39` and `dev`.
Your account will be the owner of the project. This can be changed later.

:::note Deploy code to an existing project
If you have an existing project you'd like to use, for example created with the Studio application, you can connect and deploy the code to that project using the [CLI command](/docs/cli#init) `coho init` instead of `coho create`.
:::

## Create a serverless JavaScript Codehook

First, in the project directory, install the Codehooks standard open source libraries [codehooks-js](https://www.npmjs.com/package/codehooks-js).

```bash
npm i codehooks-js
```

Next, start your favorite code editor and open the auto generated `index.js` in your project directory. 


```js title="index.js"
/*
* Auto generated Codehooks (c) example
*/
import {app} from 'codehooks-js'

// test route for https://<PROJECTID>.api.codehooks.io/dev/
app.get('/', (req, res) => {
  res.send('CRUD server ready')
})

// Use Crudlify to create a REST API for any database collection
app.crudlify()

// bind to serverless runtime
export default app.init();
```

Save the JavaScript file. 

## TypeScript support
Codehooks supports TypeScript (version 5) with strong typing. Just rename the index.js file to index.ts, update the package.json main property, and your're ready to go. 

The code example below shows the initial code example using TypeScript.

```ts title="index.ts"
/* TypeScript */
import {app, httpRequest, httpResponse} from 'codehooks-js'

// strong typing for request and response
app.get('/', (req: httpRequest, res: httpResponse) => {
  res.send('CRUD server ready')
})

// Use Crudlify to create a REST API for any database collection
app.crudlify()

// bind to serverless runtime
export default app.init();
```

```js title="package.json"
{
  // rest of your package.json file
  "main": "index.ts"
}
```

You are now ready to deploy your project.

## Deploy the code to the serverless cloud

```bash
coho deploy
```
Example output from the deploy command.

```bash
Deploying to Project: myproject-2b39 Space: dev
Deployed Codehook successfully! 🙌 
```

You can now test the [database CRUD REST API](/docs/databaserestapi.md) with a sample collection, for example `users`. 

:::tip
Use the `coho info --examples` command to find your project name, API tokens and working curl examples.
:::

```bash title="curl shell command - POST a new user"
curl --location 'https://<YOUR-PROJECT-NAME>.api.codehooks.io/dev/users' \
--header 'x-apikey: <YOUR-API-TOKEN-HERE>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Bill",
    "email": "william@example.com",
    "active": true
}'
```
Example output from the curl test.

```js
{
    "name": "Bill",
    "email": "william@example.com",
    "active": true,
    "_id": "6421b3e6a3c762051688edf7"
}
```

Lets also test a query for the same data we've added.

```bash title="curl shell command - query users"
curl --location 'https://<YOUR-PROJECT-NAME>.api.codehooks.io/dev/users?name=Bill' \
--header 'x-apikey: <YOUR-API-TOKEN-HERE>' \
--header 'Content-Type: application/json' \
```

Which returns an array of 1 object from the database.

```js
[
    {
        "name": "Bill",
        "email": "william@example.com",
        "active": true,
        "_id": "6421b3e6a3c762051688edf7"
    }
]
```

Our test shows that the automatic REST API is accessible on the `/dev/users` route, and we can successfully add and retrieve data from the database to the client.

👏👏