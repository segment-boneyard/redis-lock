
var redis = require('redis').createClient();
var lock = require('..')({ redis: redis });

setInterval(function(){
  var id = Math.random() * 50 | 0;
  lock(id, '10s', function(err, locked){
    if (err) throw err;
    if (locked) return;
    console.log('%s - process', id);
  });
}, 10);