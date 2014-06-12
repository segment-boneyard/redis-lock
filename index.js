
/**
 * Module dependencies.
 */

var debug = require('debug')('redis-lock');
var assert = require('assert');
var ms = require('ms');

/**
 * Configure a lock with `opts` and
 * return the lock function.
 *
 * - `redis` client
 * - `retry` interval
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */

module.exports = function(opts){
  opts = opts || {};
  opts.name = opts.name || 'lock';
  assert(opts.redis, '.redis instance required');

  var db = opts.redis;

  return function check(name, ttl, fn){
    var key = opts.name + ':' + name;
    if ('string' == typeof ttl) ttl = ms(ttl);

    debug('%j - check (ttl=%s)', name, ttl);
    db.set(key, 1, 'NX', 'PX', ttl, function(err, set){
      if (err) return fn(err);

      var locked = !set;
      debug('%j - response (locked=%s)', name, locked);

      if (locked && opts.retry) {
        debug('%j - retry in %sms', name, opts.retry);
        setTimeout(function(){
          check(name, ttl, fn);
        }, opts.retry);
        return;
      }

      fn(null, !set);
    });
  }
}
