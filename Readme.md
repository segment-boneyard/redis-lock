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
var lock = require('redis-lock')({ redis: redis });

setInterval(function(){
  var id = Math.random() * 50 | 0;
  lock(id, '10s', function(err, locked){
    if (err) throw err;
    if (locked) return;
    console.log('%s - process', id);
  });
}, 10);
```

# License

  MIT