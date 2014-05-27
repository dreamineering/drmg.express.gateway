/* Copyright (c) 2013 Richard Rodger, MIT License */
"use strict";


var _     = require('lodash');
var async = require('async');

var nid = require('nid')


module.exports = function( options ) {
  var seneca = this
  var plugin   = 'product'

  seneca.depends(plugin,['user','account'])


  options = seneca.util.deepextend({
    loadlimit:3,
    prefix: '/product',
    web:true,
    idgen:{human:false,length:6}
  },options)


  if( options.web ) {
    seneca.depends(plugin,['auth'])
  }


  var prodnid
  if( options.idgen.short ) {
    prodnid = nid({length:options.idgen.length})
  }


  var productent = seneca.make$('sys/product')
  var accountent = seneca.make$('sys/account')
  var userent    = seneca.make$('sys/user')


  seneca.add({role:plugin,cmd:'save'},          save_product)
  seneca.add({role:plugin,cmd:'start'},         start_product)
  seneca.add({role:plugin,cmd:'stop'},          stop_product)
  seneca.add({role:plugin,cmd:'move'},          move_product)
  seneca.add({role:plugin,cmd:'adduser'},       adduser)
  seneca.add({role:plugin,cmd:'removeuser'},    removeuser)
  seneca.add({role:plugin,cmd:'product_users'}, product_users)
  seneca.add({role:plugin,cmd:'user_products'}, user_products)
  seneca.add({role:plugin,cmd:'load'},          load_product)



  seneca.act({
    role:'util',
    cmd:'ensure_entity',
    pin:{role:plugin,cmd:'*'},
    entmap:{
      account:accountent,
      product:productent,
      user:userent,
    }
  })




  var pin = seneca.pin({role:plugin,cmd:'*'})




  function additem( ent, refent, name ) {
    if( ent && refent && name ) {
      ent[name] = ent[name] || []
      ent[name].push( refent.id )
      ent[name] = _.uniq( ent[name] )
    }
  }



  function loadall( name, ent, list, done ) {
    async.mapLimit(list||[],options.loadlimit,function(id,cb){
      if( id && id.entity$ ) return cb(null,id);
      ent.load$(id,cb)

    }, function( err, list ) {
      if( err ) return done(err);

      var out = {}
      out[name] = list
      return done( null, out )
    })
  }



  function save_product( args, done ) {
    var productent = this.make$('sys/product')

    var isnew = false

    if( args.id ) {
      productent.load$(args.id, function( err, product ){
        if( err ) return done( err );
        return update_project( product )
      })
    }
    else {
      isnew = true
      var newproj = productent.make$({id$:args.id$})


      if( prodnid ) return genid();
      return update_project( newproj );
    }

    function genid() {
      newproj.id$ = prodnid()
      productent.load$(newproj.id$, function(err,found){
        if( err) return done(err);
        if( found ) return genid();
        return update_project( newproj );
      })
    }

    function update_project( product ) {
      var fields = seneca.util.argprops(

        // default values
        { kind:'primary' },

        // caller specified values, overrides defaults
        args,

        // controlled values, can't be overridden
        {
          active: void 0 == args.active ? true : !!args.active,
          account:args.account.id,
        },

        // invalid properties, will be deleted
        'id, role, cmd, user')

      product.data$(fields)

      product.save$( function( err, product ) {
        additem( args.account, product, 'products')

        args.account.save$( function( err, account ) {
          if( err ) return done( err );

          done(null,{product:product,account:account,new:isnew})
        })
      })
    }
  }


  function load_product( args, done ) {
    done( null, {product:args.product} )
  }


  function start_product( args, done ) {
    args.product.active = true
    args.product.save$( function(err,product){
      return done(err,{ok:!err,product:product})
    })
  }



  function stop_product( args, done ) {
    args.product.active = false
    args.product.save$( function(err,product){
      return done(err,{ok:!err,product:product})
    })
  }



  function move_product( args, done ) {
    args.product.account = args.account.id
    args.product.save$( done )
  }



  function adduser( args, done ) {
    var user    = args.user
    var product = args.product

    additem( user,    product, 'products' )
    additem( product, user,    'users' )

    product.save$( function( err, product ){
      if( err ) return done(err);

      user.save$( done )
    })
  }



  function removeuser( args, done ) {
    var user    = args.user
    var product = args.product

    user.products = user.products || []
    user.products = _.reject(user.products,function(prdid){return prdid==product.id})

    product.users = product.users || []
    product.users = _.reject(product.users,function(usrid){return usrid==user.id})

    product.save$( function( err, product ){
      if( err ) return done(err);

      user.save$( done )
    })
  }



  function user_products( args, done ) {

    var productent = this.make$('sys/product')

    var user = args.user

    // specifically assigned to products
    var list = args.user.products ? _.clone(args.user.products) : []

    // all products in account, if product has no specific users
    async.mapLimit(user.accounts||[],options.loadlimit,function(accid,cb){

      var q = {account:accid}
      if( void 0 != args.kind ) {
        q.kind = args.kind
      }

      productent.list$({account:accid},function(err,products){
        if( err ) return cb(err);

        _.each( products, function( product) {
          if( product.users ) {
            if( _.contains( product.users, user.id ) ) {
              list.push( product.id )
            }
          }
          else {
            list.push( product.id )
          }
        })

        cb()
      })
    }, function( err, results ) {
      if( err ) return done(err);

      list = _.uniq(list)
      loadall( 'products', productent, list, function(err,out){
        if( err) return done(err);

        if( void 0 != args.kind ) {
          out.products = _.filter(out.products,function(proj){
            return args.kind == proj.kind
          })
        }

        done(err,out)
      })
    })
  }



  function product_users( args, done ) {
    var product = args.product

    // specifically assigned to product
    var list = product.users ? _.clone(product.users) : []

    accountent.load$( product.account, function( err, account ) {
      if( err ) return err;

      list = list.concat( account.users || [] )
      list = _.uniq(list)

      loadall( 'users', userent, list, done )
    })
  }



  function buildcontext( req, res, args, act, respond ) {
    var user = req.seneca && req.seneca.user

    if( user ) {
      args.user = user

      if( args.account && !_.contains(args.user.accounts,args.account) ) {
        return seneca.fail({code:'invalid-account'},respond)
      }
      else {
        args.account = args.user.accounts[0]
      }
    }
    else return seneca.fail({code:'user-required'},respond);

    act(args,respond)
  }


  // web interface
  seneca.act_if(options.web, {role:'web', use:{
    prefix:options.prefix,
    pin:{role:plugin,cmd:'*'},
    map:{
      'user_products': { GET:buildcontext },

      'load':  { GET:buildcontext, alias:'load/:product' },
      'save':  { POST:buildcontext },
      'start': { POST:buildcontext },
      'stop':  { POST:buildcontext }
    }
  }})




  seneca.add({init:plugin}, function( args, done ){
    seneca.act('role:util, cmd:define_sys_entity', {list:[productent.canon$()]})
    done()
  })


  return {
    name: plugin
  }
}
