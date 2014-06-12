[![Build Status](https://circleci.com/gh/segmentio/redis-lock.png?circle-token=)](https://circleci.com/gh/segmentio/redis-lock)

# redis-lock

  Node redis lock implementation for locking with a TTL. Requires redis 2.6.12 or above.

## Installation

```
$ npm install segmentio/redis-lock
```

## Example

```js
var redis = require('redis').createClient();
var Lock = require('redis-lock');

var lock = new Lock({
  name: 'locks:something',
  redis: redis,
  timeout: '10s;' // or number
});

// try acquiring lock
lock.lock(function(err, locked){

});

// try acquiring lock with retry interval
lock.retry(function(err){

}, 500);
```

# License

  MIT