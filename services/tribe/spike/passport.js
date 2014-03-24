
var mongoose              = require('mongoose')
  , passport              = require('passport')
  , BearerStrategy        = require('passport-http-bearer').Strategy
  , GoogleStrategy        = require('passport-google-oauth').Strategy
  , CONFIG                = require('config');
  // , TwitterStrategy       = require('passport-twitter').Strategy
  // , GitHubStrategy        = require('passport-github').Strategy

var Person                = mongoose.model('Person');


module.exports = function () {

  // bearer strategy
  passport.use(new BearerStrategy(
    function(token, done) {
      if ( token && (token.length === CONFIG.tokenLength ) ) {
        User.findOne({ token: token }, function (err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          return done(null, user);
        });
      } else {
        return done(null, false);
      }
    }
  ));


    // use google strategy
  passport.use(new GoogleStrategy({
      consumerKey: CONFIG.google.clientID,
      consumerSecret: CONFIG.google.clientSecret,
      callbackURL: CONFIG.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'google.id': profile.id }, function (err, user) {
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'google'
            , google: profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));

  // use twitter strategy
  passport.use(new TwitterStrategy({
        consumerKey: CONFIG.twitter.clientID
      , consumerSecret: CONFIG.twitter.clientSecret
      , callbackURL: CONFIG.twitter.callbackURL
    },
    function(token, tokenSecret, profile, done) {
      User.findOne({ 'twitter.id': profile.id }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          user = new User({
              name: profile.displayName
            , username: profile.username
            , provider: 'twitter'
            , twitter: profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        }
        else {
          return done(err, user)
        }
      })
    }
  ))

  // use github strategy
  passport.use(new GitHubStrategy({
      clientID: CONFIG.github.clientID,
      clientSecret: CONFIG.github.clientSecret,
      callbackURL: CONFIG.github.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ 'github.id': profile.id }, function (err, user) {
        if (!user) {
          user = new User({
              name: profile.displayName
            , email: profile.emails[0].value
            , username: profile.username
            , provider: 'github'
            , github: profile._json
          })
          user.save(function (err) {
            if (err) console.log(err)
            return done(err, user)
          })
        } else {
          return done(err, user)
        }
      })
    }
  ));

  return {
    passport : passport
  }
}
