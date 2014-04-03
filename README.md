
# Objective

Serve as a proxy to spree commerce to support a slick user experience using an angular based browsing app using Bacon.js with sockets as eluded to by toploser in his AngularORM talk.

But the real objective is to use Seneca to develop an underlying MSA for business logic to meet the following objectives

* Evolve this become the validation middleware
* Compare express, koa, restify and hapi
* Get to understand how exactly to use Seneca to migrate to MSA
* Augment spree commerce with features built in express MSA  (experiment with other languges Go, Clojure etc)
* Slowly replace spree features but no need to reinvent for the sack of it.
* Use this an example for how to use docker to setup an MSA example

## Essentials

* CORS
* Security - token auth


## Features

* Provide CORS api for angular (other) web apps for CRUD
* Simple CMS / light readability (marketing) driven interface (may use [apostrophe](http://apostrophenow.org/))
* Use gulp for asset management for consistency


## The StackMates

### Client

* [mobile => start.ionic](https://github.com/dreamineering/start.ionic)
* [tablet => start.angular](https://github.com/dreamineering/start.drmg.angular)
* a famo.us experiment (future)
* an admin interface (future)

### Services

* [spreecommerce](https://github.com/dreamineering/drmg.spree.api)
* drmg.koa.gateway
* drmg.hapi.gateway


See [stackmates](stackmates.dreamineering.com) for details on the whats, the whys and do you mind if don'ts



## Based upon

https://github.com/inadarei/nodebootstrap and the talk by TJ on vimeo.

## Key

Q??? - hmmm is this a dumb idea?