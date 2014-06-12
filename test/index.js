
var redis = require('redis').createClient();
var assert = require('assert');
var Lock = require('..');

var lock = new Lock({
  redis: redis,
  name: 'something',
  timeout: 100
});

beforeEach(function(done){
  redis.flushdb(done);
})

describe('Lock#lock(fn)', function(){
  it('should lock for the given ttl', function(done){
    lock.lock(function(err, locked){
      if (err) return done(err);
      assert(false === locked);

      lock.lock(function(err, locked){
        if (err) return done(err);
        assert(true === locked);

        setTimeout(function(){
          lock.lock(function(err, locked){
            if (err) return done(err);
            assert(false === locked);
            done();
          })
        }, 150);
      });
    });
  })

  it('should work when ttl is a string', function(done){
    lock.lock(function(err, locked){
      if (err) return done(err);
      assert(false === locked);

      lock.lock(function(err, locked){
        if (err) return done(err);
        assert(true === locked);

        setTimeout(function(){
          lock.lock(function(err, locked){
            if (err) return done(err);
            assert(false === locked);
            done();
          })
        }, 150);
      });
    });
  })
})

describe('Lock#unlock(fn)', function(){
  it('should unlock', function(done){
    lock.lock(function(err, locked){
      assert(!err && !locked);

      lock.unlock(function(err){
        assert(!err);

        lock.lock(function(err, locked){
          assert(!err && !locked);
          done();
        });
      });
    });
  })
})

describe('Lock#retry(fn, interval)', function(){
  it('should retry until acquired', function(done){
    var lock = new Lock({
      redis: redis,
      name: 'something',
      timeout: 2000
    });

    lock.lock(function(err, locked){
      assert(!err && !locked);

      var start = new Date;
      lock.retry(function(err){
        assert(!err);
        var ms = new Date - start;
        assert(ms >= 2000);
        done();
      }, 500);
    });
  })
})