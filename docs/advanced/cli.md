---
id: cli
title: Codehooks CLI tool
tags: [cli, 'command-line']
keywords: [
  "Codehooks CLI Guide",
  "Serverless Project Management",
  "CLI Commands for Deployment",
  "File Management via CLI",
  "Data Operations in CLI",
  "Project Creation Commands",
  "Serverless Environment Setup",
  "Codehooks Command Line Tool",
  "CLI for Backend Development",
  "Codehooks Project Deployment"
]
---

Command line interface (CLI) for codehooks.io ([npm package](https://www.npmjs.com/package/codehooks)).

**Version**: `1.2.4`

The CLI lets you manage projects and spaces (environments) (serverless functions + datastore + settings) from the command line.

## Popular commands

- New Project: `coho create myproject`
- Start coding: `mkdir myproject && cd myproject && coho init myproject-f2a0 --empty`
- Show project info: `coho info`
- New Space (environment): `coho add myspace`
- New Collection: `coho createcoll 'customers'`
- Import data: `coho import -f '/home/myfile.csv' -c 'customers' --separator ','`
- Invite: `coho invite jane@example.com myproject`
- Deploy your app: `coho deploy`
- Real time logs: `coho logs -f`
- Query the datastore: `coho query --collection products --query 'type=soft'`
- Upload static files: `coho upload './assets'`


## Install

```sh
$ npm i codehooks -g
```

## Usage

```sh
$ codehooks --help
```

Help output:

```
codehooks <command>

Commands:
  codehooks admin                                                      Open the codehooks.io admin account UI at account.codehooks.io
  codehooks docs                                                       Open the codehooks.io documentation
  codehooks login [provider]                                           Authenticate CLI - sign up and/or sign in
  codehooks logout                                                     Log out of the CLI
  codehooks account                                                    Show info about account, projects and invitations
  codehooks invite [email] [projectname]                               Invite user to project
  codehooks join [projectname]                                         Join project
  codehooks leave [projectname]                                        Leave project
  codehooks create [projectname] [teamid] [description]                Create and initialize a new codehooks project  [aliases: init]
  codehooks init [projectname] [space]                                 Initialise an existing project space in the current folder. Sets up default CRUD template in index.js.
  codehooks add [space] [projectname] [restricted]                     Add new space to project
  codehooks use [name]                                                 Set active space
  codehooks info [projectname] [space]                                 Show info about project and spaces
  codehooks stats [project]                                            Show usage metrics for project spaces
  codehooks file-upload [src] [target]                                 Upload files to server  [aliases: up, upload]
  codehooks file-delete [filename]                                     Delete a file from server  [aliases: delete]
  codehooks file-list [path]                                           List files from server  [aliases: files]
  codehooks verify [dir]                                               Compile code (defaults to current dir)  [aliases: compile, ver, comp]
  codehooks deploy                                                     Deploys current codehook folder  [aliases: de, dep]
  codehooks undeploy                                                   Undeploy current codehook folder  [aliases: unde, undep]
  codehooks install [template]                                         Install a template application  [aliases: inst, i]
  codehooks log [space] [tail] [follow] [context]                      Show system logs for a space.  [aliases: logs]
  codehooks count [collection] [space]                                 Count objects in a collection in current space  [aliases: co]
  codehooks query [collection] [query]                                 Run query on collection in current space  [aliases: q]
  codehooks createindex [collection] [index] [space]                   Add field(s) to a query index  [aliases: index, idx, create-index]
  codehooks dropindex [collection] [index] [space]                     Remove field(s) from a query index  [aliases: removeindex, remove-index, rmindex, delete-index]
  codehooks get [key] [keyspace] [space] [json]                        Retrieve key-value pair(s) from a space
  codehooks set [key] [val]                                            Set key-value pair in a space
  codehooks del [key] [keyspace] [space] [json]                        Delete key-value pair in a space
  codehooks collection [project] [output]                              Show collections for space  [aliases: coll, col, ls]
  codehooks createcollection [collection]                              Create a new collection  [aliases: createcoll, add-collection]
  codehooks dropcollection [collection]                                Delete all data in collection and remove collection name  [aliases: dropcoll, rmcoll, deletecoll]
  codehooks add-schema [collection] [schema]                           Add a JSON schema to a collection  [aliases: schema, create-schema]
  codehooks remove-schema [collection]                                 Remove JSON schema for a collection  [aliases: delete-schema, del-schema]
  codehooks cap-collection [collection] [cap] [capdelay]               Cap a collection  [aliases: cap, cap-coll, capcoll]
  codehooks uncap-collection [collection]                              Remove cap on a collection  [aliases: uncap]
  codehooks import [filepath] [collection] [project] [space] [dryrun]  Import JSON or CSV data from file  [aliases: imp]
  codehooks export [collection] [project] [space]                      Export JSON or CSV data
  codehooks add-token [readonly]                                       Add token to space
  codehooks remove-token [token]                                       Remove token from space
  codehooks set-env [key] [value] [encrypted]                          Set environment variable for space
  codehooks remove-env [key]                                           Remove environment variable from space
  codehooks jwks [url]                                                 Set/replace JWKS endpoint for OAuth2 authentication. Set to "" (empty string) to remove.
  codehooks whitelist [ip]                                             Add host to whitelist (use to restrict space access)
  codehooks whitelist-remove [ip]                                      Remove host from whitelist
  codehooks completion                                                 Generate command completion script. Just add this to your .bashrc, .bash_profile, .zshrc (or similar) on *nix machines
  codehooks remove-project [projectname]                               Remove the project
  codehooks remove-space [space] [projectname]                         Remove space and data
  codehooks admintokens                                                Show active admintokens for account or team
  codehooks add-admintoken                                             Add admin token to account or team (for use with CI)
  codehooks remove-admintoken                                          Remove admin token from account or team

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]


 No project active in this folder! Use 'coho create' or 'codehooks create' to create a new project.

 created by Codehooks AS - info@codehooks.io
```

## Available commands

* [admin](#admin)
* [docs](#docs)
* [login](#login)
* [logout](#logout)
* [account](#account)
* [invite](#invite)
* [join](#join)
* [leave](#leave)
* [create](#create)
* [init](#init)
* [add](#add)
* [use](#use)
* [info](#info)
* [stats](#stats)
* [file-upload](#file-upload)
* [file-delete](#file-delete)
* [file-list](#file-list)
* [verify](#verify)
* [deploy](#deploy)
* [undeploy](#undeploy)
* [install](#install)
* [log](#log)
* [count](#count)
* [query](#query)
* [createindex](#createindex)
* [dropindex](#dropindex)
* [get](#get)
* [set](#set)
* [del](#del)
* [collection](#collection)
* [createcollection](#createcollection)
* [dropcollection](#dropcollection)
* [add-schema](#add-schema)
* [remove-schema](#remove-schema)
* [cap-collection](#cap-collection)
* [uncap-collection](#uncap-collection)
* [import](#import)
* [export](#export)
* [add-token](#add-token)
* [remove-token](#remove-token)
* [set-env](#set-env)
* [remove-env](#remove-env)
* [jwks](#jwks)
* [whitelist](#whitelist)
* [whitelist-remove](#whitelist-remove)
* [completion](#completion)
* [remove-project](#remove-project)
* [remove-space](#remove-space)
* [admintokens](#admintokens)
* [add-admintoken](#add-admintoken)
* [remove-admintoken](#remove-admintoken)

### admin

```sh
$ codehooks admin --help
```

Help output:

```
codehooks admin

Open the codehooks.io admin account UI at account.codehooks.io

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### docs

```sh
$ codehooks docs --help
```

Help output:

```
codehooks docs

Open the codehooks.io documentation

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### login

```sh
$ codehooks login --help
```

Help output:

```
codehooks login [provider]

Authenticate CLI - sign up and/or sign in

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### logout

```sh
$ codehooks logout --help
```

Help output:

```
codehooks logout

Log out of the CLI

Options:
  -d, --debug    show debug (verbose) information
      --dir  [default: "."]
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### account

```sh
$ codehooks account --help
```

Help output:

```
codehooks account

Show info about account, projects and invitations

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### invite

```sh
$ codehooks invite --help
```

Help output:

```
codehooks invite [email] [projectname]

Invite user to project

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
  -t, --email  [string] [required]
      --role  [string] [default: "ADMIN"]
      --remove       remove invitation  [boolean]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### join

```sh
$ codehooks join --help
```

Help output:

```
codehooks join [projectname]

Join project

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### leave

```sh
$ codehooks leave --help
```

Help output:

```
codehooks leave [projectname]

Leave project

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### create

```sh
$ codehooks create --help
```

Help output:

```
codehooks create [projectname] [teamid] [description]

Create and initialize a new codehooks project

Options:
  -d, --debug        show debug (verbose) information
      --description  A few words about this project
  -n, --projectname  Project name
  -t, --teamid       Add project to team with this id
  -g, --ga-deploy    Add Github Action for automatic deploy  [boolean]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### init

```sh
$ codehooks init --help
```

Help output:

```
codehooks init [projectname] [space]

Initialise an existing project space in the current folder. Sets up default CRUD template in index.js.

Options:
  -d, --debug        show debug (verbose) information
  -n, --projectname  Project name
  -s, --space        Space (environment) name  [default: "dev"]
  -e, --empty        Only create the project config file  [boolean]
      --download     Download source code from project  [boolean] [default: true]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]

Examples:
  codehooks init
  codehooks init --empty
  codehooks init --download
```

### add

```sh
$ codehooks add --help
```

Help output:

```
codehooks add [space] [projectname] [restricted]

Add new space to project

Options:
  -d, --debug        show debug (verbose) information
      --projectname  [required]
  -n, --space        space name  [required]
      --restricted   only team admins or owner can use if restricted  [boolean]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### use

```sh
$ codehooks use --help
```

Help output:

```
codehooks use [name]

Set active space

Options:
  -d, --debug        show debug (verbose) information
      --projectname  [required]
  -n, --name
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### info

```sh
$ codehooks info --help
```

Help output:

```
codehooks info [projectname] [space]

Show info about project and spaces

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Active project  [required]
      --json         Output info as JSON (not table)  [boolean]
      --space        Only show info for this space  [string]
  -e, --examples     Include cURL examples  [boolean]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### stats

```sh
$ codehooks stats --help
```

Help output:

```
codehooks stats [project]

Show usage metrics for project spaces

Options:
  -d, --debug    show debug (verbose) information
  -p, --project  Select which project to query
      --space    Only show info for this space  [string]
      --json     Output info as json  [boolean]
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### file-upload

```sh
$ codehooks file-upload --help
```

Help output:

```
codehooks file-upload [src] [target]

Upload files to server

Options:
  -d, --debug        show debug (verbose) information
  -f, --src          Path to directory or file  [default: "."]
  -t, --target       Target directory on server, same as local if not set
  -e, --ext          Include files matching the extension  [string]
      --space        Select which space (environment) to access
  -p, --projectname  Select which project name to use
      --admintoken   Use admin token authentication (use for CI)
      --dryrun       Output files to upload without performing the action  [boolean]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]

Examples:
  codehooks file-upload './static'
  codehooks file-upload --src './local' --target '/remote'
  codehooks file-upload --src './local' --target '/remote' --ext 'png'
  codehooks file-upload --src './local' --target '/remote' --ext 'png|jpg|jpeg|gif'
  codehooks file-upload afile.txt
```

### file-delete

```sh
$ codehooks file-delete --help
```

Help output:

```
codehooks file-delete [filename]

Delete a file from server

Options:
  -d, --debug        show debug (verbose) information
  -f, --filename     Delete file with match on absolute path/filename
  -r, --match        Delete multiple file that matches regular expression to a file path
      --space        Select which space (environment) to access
  -p, --projectname  Select which project name to use
      --admintoken   Use admin token authentication (use for CI)
      --dryrun       Output files to upload without performing the action  [boolean]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]

Examples:
  codehooks file-delete --filename '/static/myfile.txt'
  codehooks file-delete --match '/static/*'
  codehooks file-delete --match '.css$'
```

### file-list

```sh
$ codehooks file-list --help
```

Help output:

```
codehooks file-list [path]

List files from server

Options:
  -d, --debug       show debug (verbose) information
  -f, --path        Path to directory or file  [default: "."]
      --space       Select which space (environment) to access
  -p, --project     Select which project name to use
      --admintoken  Use admin token authentication (use for CI)
      --reverse     Scan index in reverse order
      --table       Output data as formatted table (not JSON)  [boolean]
      --json        Output data as formatted JSON  [boolean]
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks file-list '/static/'
```

### verify

```sh
$ codehooks verify --help
```

Help output:

```
codehooks verify [dir]

Compile code (defaults to current dir)

Options:
  -d, --debug        show debug (verbose) information
      --dir  [default: "."]
      --space        Select which space to access
  -p, --projectname  Select which project name to use
      --admintoken   Use admin token authentication (use for CI)
  -e, --main         Application main file, default is index.js  [default: "index"]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### deploy

```sh
$ codehooks deploy --help
```

Help output:

```
codehooks deploy

Deploys current codehook folder

Options:
  -d, --debug        show debug (verbose) information
      --dir  [default: "."]
  -s, --space        Select which space to access
  -p, --projectname  Select which project name to use
      --history      Show deployment history
      --rollback     Undo last deployment, set previous as active
      --json         Output JSON format
      --admintoken   Use admin token authentication (use for CI)
      --template     Deploy a pre defined code template
      --upload       Upload source code assets to codehooks.io this projects environment  [boolean] [default: true]
  -e, --main         Application main file, default is index.js  [default: "index"]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### undeploy

```sh
$ codehooks undeploy --help
```

Help output:

```
codehooks undeploy

Undeploy current codehook folder

Options:
  -d, --debug        show debug (verbose) information
      --dir  [default: "."]
  -s, --space        Select which space to access
  -p, --projectname  Select which project name to use
      --json         Output JSON format
      --admintoken   Use admin token authentication (use for CI)
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### install

```sh
$ codehooks install --help
```

Help output:

```
codehooks install [template]

Install a template application

Options:
  -d, --debug        show debug (verbose) information
  -t, --template     Template directory from Github repo with templates  [string] [required]
      --space        Select which space (environment) to access
  -p, --projectname  Select which project name to use
      --admintoken   Use admin token authentication (use for CI)
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]

Examples:
  codehooks install 'static-website-tailwincss'
```

### log

```sh
$ codehooks log --help
```

Help output:

```
codehooks log [space] [tail] [follow] [context]

Show system logs for a space.

Options:
  -d, --debug    show debug (verbose) information
  -p, --project  Select which project name to use
  -s, --space    Select which space to log
  -t, --tail     Chop log to n lines  [default: 100]
  -f, --follow   Keep log stream open
  -c, --context  Filter log on: jobhooks, queuehooks, routehooks, datahooks, auth
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]

Examples:
  codehooks log
  codehooks log -f
  codehooks coho log --tail 10
  coho log --project 'pets-ff00' --space prod
```

### count

```sh
$ codehooks count --help
```

Help output:

```
codehooks count [collection] [space]

Count objects in a collection in current space

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to query
  -s, --space       Select which space to query
  -c, --collection  Collection name  [required]
      --table       Output info as table (not JSON)  [boolean]
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]
```

### query

```sh
$ codehooks query --help
```

Help output:

```
codehooks query [collection] [query]

Run query on collection in current space

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to query
  -s, --space       Select which space to query
  -q, --query       Limit selection with a query expression  [default: ""]
  -n, --count       Count query results
  -c, --collection  Collection name  [required]
      --delete      Delete all items from query result
      --update      Patch all items from query result with JSON string '{...}'  [string]
      --replace     Replace all items from query result with JSON string '{...}'  [string]
      --useindex    Use an indexed field to scan data in query  [string]
      --start       Start value for index scan  [string]
      --end         End value for index scan  [string]
      --limit       Limit query result  [number]
      --fields      Comma separated list of fields to include  [string]
      --sort        Comma separated list of fields to sort by  [string]
      --offset      Skip items before returning data in query result  [number]
      --enqueue     Add query result to queue topic  [string]
      --pretty      Output data with formatting and colors
      --reverse     Scan index in reverse order
      --table       Output data as formatted table (not JSON)  [boolean]
      --csv         Output data in CSV format  [boolean]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks query pets name=Polly
  codehooks query --collection pets --query 'name=Polly&type=Parrot'
  codehooks query --collection pets --query 'name=/^po/'
  codehooks query --collection pets --query 'name=/^po/' --sort 'age,name'
  codehooks query pets 'name=Polly' --useindex name --fields 'name,type'
  codehooks q pets 'name=Polly&type=Parrot' --update '{"name": "Zilla"}'
  codehooks q pets 'type=Fish' --delete
  codehooks q pets 'type=Snake' --enqueue 'mytopic'
```

### createindex

```sh
$ codehooks createindex --help
```

Help output:

```
codehooks createindex [collection] [index] [space]

Add field(s) to a query index

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection with indexes  [required]
  -i, --index       Field to index  [required]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks createindex --collection pets --index name
  codehooks idx pets name
  codehooks idx pets -i name -i type -i 'price-in-dollar'
```

### dropindex

```sh
$ codehooks dropindex --help
```

Help output:

```
codehooks dropindex [collection] [index] [space]

Remove field(s) from a query index

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection with indexes  [required]
  -i, --index       Field to remove index for  [required]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks removeindex pets name
  codehooks removeindex --collection pets --index 'name' --index 'type'
```

### get

```sh
$ codehooks get --help
```

Help output:

```
codehooks get [key] [keyspace] [space] [json]

Retrieve key-value pair(s) from a space

Options:
  -d, --debug     show debug (verbose) information
  -p, --project   Select which project to use
  -s, --space     Select which space to query
  -k, --key       Key to match, or key* to fetch list  [default: "*"]
      --keyspace  Keyspace to scan
      --text      Output info as text line  [boolean]
  -h, --help      Show help  [boolean]
  -v, --version   Show version number  [boolean]

Examples:
  codehooks get 'my-value-one'
  codehooks get 'my*'
  codehooks get '*' --keyspace spacex
```

### set

```sh
$ codehooks set --help
```

Help output:

```
codehooks set [key] [val]

Set key-value pair in a space

Options:
  -d, --debug     show debug (verbose) information
  -p, --project   Select which project to use  [string]
  -s, --space     Select which space to use  [string]
      --key       Key to set  [string] [required]
      --val       Value to set  [string] [required]
      --keyspace  Keyspace to use  [string]
      --ttl       Time to live in millis for value  [number]
      --json      Output info as JSON (not table)  [boolean]
  -h, --help      Show help  [boolean]
  -v, --version   Show version number  [boolean]

Examples:
  codehooks set 'my-value-one' 'foo'
  codehooks set 'my-value-two' 'bar'
  codehooks set 'session-4f51-9bed' 'OK' --keyspace 'spacex' --ttl 60000
```

### del

```sh
$ codehooks del --help
```

Help output:

```
codehooks del [key] [keyspace] [space] [json]

Delete key-value pair in a space

Options:
  -d, --debug     show debug (verbose) information
  -p, --project   Select which project to use
  -s, --space     Select which space to use
      --key       Key to delete  [required]
      --keyspace  Keyspace to use
      --json      Output info as JSON (not table)  [boolean]
  -h, --help      Show help  [boolean]
  -v, --version   Show version number  [boolean]

Examples:
  codehooks del 'my-value-one'
  codehooks del 'my-value-two' --keyspace 'spacex'
```

### collection

```sh
$ codehooks collection --help
```

Help output:

```
codehooks collection [project] [output]

Show collections for space

Options:
  -d, --debug    show debug (verbose) information
  -p, --project  Select which project to query
  -s, --space    Select which space to query
      --json     JSON output format
      --sys      Show system collections  [boolean]
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### createcollection

```sh
$ codehooks createcollection --help
```

Help output:

```
codehooks createcollection [collection]

Create a new collection

Options:
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection name  [required]
      --admintoken  Use admin token authentication (use for CI)
  -k, --cap         Cap collection to max documents
  -d, --capdelay    show debug (verbose) information
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks createcollection pets
  codehooks createcollection logs --cap 5000
```

### dropcollection

```sh
$ codehooks dropcollection --help
```

Help output:

```
codehooks dropcollection [collection]

Delete all data in collection and remove collection name

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection name  [required]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks dropcollection pets
```

### add-schema

```sh
$ codehooks add-schema --help
```

Help output:

```
codehooks add-schema [collection] [schema]

Add a JSON schema to a collection

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection name  [required]
      --admintoken  Use admin token authentication (use for CI)
  -j, --schema      Path to file with JSON schema for collection  [required]
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks add-schema --collection 'person' --schema './personSchema.json'
```

### remove-schema

```sh
$ codehooks remove-schema --help
```

Help output:

```
codehooks remove-schema [collection]

Remove JSON schema for a collection

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection name  [required]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks remove-schema --collection 'person'
```

### cap-collection

```sh
$ codehooks cap-collection --help
```

Help output:

```
codehooks cap-collection [collection] [cap] [capdelay]

Cap a collection

Options:
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection name  [required]
      --admintoken  Use admin token authentication (use for CI)
  -k, --cap         Cap collection to max documents  [default: 1000]
  -d, --capdelay    show debug (verbose) information  [default: 1000]
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks capcollection --collection 'temperature' --cap 10000
```

### uncap-collection

```sh
$ codehooks uncap-collection --help
```

Help output:

```
codehooks uncap-collection [collection]

Remove cap on a collection

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Select which project to use
  -s, --space       Select which space to use
  -c, --collection  Collection name  [required]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  codehooks uncap-collection --collection 'temperature'
```

### import

```sh
$ codehooks import --help
```

Help output:

```
codehooks import [filepath] [collection] [project] [space] [dryrun]

Import JSON or CSV data from file

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Project name  [string] [required]
  -s, --space       A space in your project  [string]
  -c, --collection  A collection in a Space  [string] [required]
  -f, --filepath    File to import  [string] [required]
      --separator   Field separator character, default is ',', also normal with '\t' or ';'  [string] [default: ","]
      --dryrun      Test only, will not import any data  [boolean] [default: false]
      --rowcount    Add a row count field to each imported record  [boolean] [default: false]
      --admintoken  Use admin token authentication (use for CI)
      --local       Import data to local development server on port parameter  [number]
      --encoding    String encoding to use, latin1, utf8, ascii, hex, ucs2  [string] [default: "utf8"]
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]

Examples:
  # shorthand
  codehooks import ./myfile.csv mycollection

  # explicit parameters
  codehooks import --filepath ./myfile.csv --collection mycollection

  # parameter shortcuts
  codehooks import -f ./myfile.json -c mycollection

  # Import CSV data with custom separator and encoding
  codehooks import -f ./myfile.csv -c mycollection --separator ';' --encoding 'latin1'
```

### export

```sh
$ codehooks export --help
```

Help output:

```
codehooks export [collection] [project] [space]

Export JSON or CSV data

Options:
  -d, --debug       show debug (verbose) information
  -p, --project     Project name  [string] [required]
  -s, --space       a space name in your project  [string]
      --collection  A collection in the space  [string] [required]
  -f, --filepath    Filename to save export data  [string]
      --csv         Export to CSV  [boolean]
      --admintoken  Use admin token authentication (use for CI)
  -h, --help        Show help  [boolean]
  -v, --version     Show version number  [boolean]
```

### add-token

```sh
$ codehooks add-token --help
```

Help output:

```
codehooks add-token [readonly]

Add token to space

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
      --readonly  [boolean] [default: false]
      --description  [string] [default: ""]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### remove-token

```sh
$ codehooks remove-token --help
```

Help output:

```
codehooks remove-token [token]

Remove token from space

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
  -t, --token  [string] [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### set-env

```sh
$ codehooks set-env --help
```

Help output:

```
codehooks set-env [key] [value] [encrypted]

Set environment variable for space

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
      --encrypted  [boolean] [default: false]
      --key  [string] [required]
      --value  [string] [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### remove-env

```sh
$ codehooks remove-env --help
```

Help output:

```
codehooks remove-env [key]

Remove environment variable from space

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
  -k, --key  [string] [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### jwks

```sh
$ codehooks jwks --help
```

Help output:

```
codehooks jwks [url]

Set/replace JWKS endpoint for OAuth2 authentication. Set to "" (empty string) to remove.

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
      --url          URL of JWKS endpoint (must be https)  [string] [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### whitelist

```sh
$ codehooks whitelist --help
```

Help output:

```
codehooks whitelist [ip]

Add host to whitelist (use to restrict space access)

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
      --ip           IP address which should be allowed access to space  [string] [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### whitelist-remove

```sh
$ codehooks whitelist-remove --help
```

Help output:

```
codehooks whitelist-remove [ip]

Remove host from whitelist

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name  [required]
      --space        A space in your project  [required]
      --ip           The IP address to remove from the whitelist.  [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### completion

```sh
$ codehooks completion --help
```

Help output:

```
codehooks completion

Generate command completion script. Just add this to your .bashrc, .bash_profile, .zshrc (or similar) on *nix machines

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### remove-project

```sh
$ codehooks remove-project --help
```

Help output:

```
codehooks remove-project [projectname]

Remove the project

Options:
  -d, --debug        show debug (verbose) information
  -p, --projectname  Project name  [string] [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### remove-space

```sh
$ codehooks remove-space --help
```

Help output:

```
codehooks remove-space [space] [projectname]

Remove space and data

Options:
  -d, --debug        show debug (verbose) information
      --projectname  Project name
      --space        A space in your project  [required]
  -h, --help         Show help  [boolean]
  -v, --version      Show version number  [boolean]
```

### admintokens

```sh
$ codehooks admintokens --help
```

Help output:

```
codehooks admintokens

Show active admintokens for account or team

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### add-admintoken

```sh
$ codehooks add-admintoken --help
```

Help output:

```
codehooks add-admintoken

Add admin token to account or team (for use with CI)

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```

### remove-admintoken

```sh
$ codehooks remove-admintoken --help
```

Help output:

```
codehooks remove-admintoken

Remove admin token from account or team

Options:
  -d, --debug    show debug (verbose) information
  -h, --help     Show help  [boolean]
  -v, --version  Show version number  [boolean]
```