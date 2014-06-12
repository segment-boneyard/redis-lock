
/**
 * Module dependencies.
 */

var debug = require('debug')('redis-lock');
var assert = require('assert');
var ms = require('ms');

/**
 * Expose `Lock`.
 */

module.exports = Lock;

/**
 * Initialize a lock with the given `opts`.
 *
 * @param {Object} opts
 * @api public
 */

function Lock(opts) {
  assert(opts, 'settings required');
  assert(opts.name, '.name required');
  assert(opts.redis, '.redis required');
  this.db = opts.redis;
  this.name = opts.name;
  this.timeout = opts.timeout || '30s';
  if ('string' == typeof this.timeout) this.timeout = ms(this.timeout);
}

/**
 * Lock and reply with `fn(err, locked)` immediately.
 *
 * @param {Function} fn
 * @api public
 */

Lock.prototype.lock = function(fn){
  var ttl = this.timeout;
  var key = this.name;

  debug('%j - check (ttl=%s)', key, ttl);
  this.db.set(key, 1, 'NX', 'PX', ttl, function(err, set){
    if (err) return fn(err);
    debug('%j - response (locked=%s)', key, !set);
    fn(null, !set);
  });
};

/**
 * Retry aquiring the lock with the given `interval`
 * defaulting to 1s.
 *
 * @param {Function} fn
 * @param {Number} [interval]
 * @api public
 */

Lock.prototype.retry = function(fn, interval){
  interval = interval || 1000;
  var self = this;

  this.lock(function(err, locked){
    if (err) return fn(err);
    if (!locked) return fn();
    setTimeout(function(){
      self.retry(fn, interval);
    }, interval);
  });
};

/**
 * Unlock and invoke `fn(err)`.
 *
 * @param {Function} fn
 * @api public
 */

Lock.prototype.unlock = function(fn){
  var key = this.name;
  debug('%j - unlock', key);
  this.db.del(key, fn);
};