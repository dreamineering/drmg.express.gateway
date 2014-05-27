var crypto = require('crypto');

var tokens = function() {

    function _uid(len) {
      return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')
        .slice(0, len)
        .replace(/\//g, '-')
        .replace(/\+/g, '_');
    };

    return {
        generator: _uid
    };

}();

module.exports = tokens;