
var redis = require('redis').createClient();
var assert = require('assert');
var lock = require('..')({ redis: redis });

describe('lock(name, ttl, fn)', function(){
  beforeEach(function(done){
    redis.flushdb(done);
  })

  it('should lock for the given ttl', function(done){
    lock('something', 100, function(err, locked){
      if (err) return done(err);
      assert(false === locked);

      lock('something', 100, function(err, locked){
        if (err) return done(err);
        assert(true === locked);

        setTimeout(function(){
          lock('something', 100, function(err, locked){
            if (err) return done(err);
            assert(false === locked);
            done();
          })
        }, 150);
      });
    });
  })

  it('should work when ttl is a string', function(done){
    lock('something', '100ms', function(err, locked){
      if (err) return done(err);
      assert(false === locked);

      lock('something', '100ms', function(err, locked){
        if (err) return done(err);
        assert(true === locked);

        setTimeout(function(){
          lock('something', '100ms', function(err, locked){
            if (err) return done(err);
            assert(false === locked);
            done();
          })
        }, 150);
      });
    });
  })
})