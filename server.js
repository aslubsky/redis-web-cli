var redis = require("redis");
var cors = require("./cors");

//console.log(process.env.REDIS_URL);

var express = require('express');
var app = express();

if (process.env.REDIS_URL) {
    var rtg = require("url").parse(process.env.REDIS_URL);
    var client = redis.createClient(rtg.port, rtg.hostname);
    client.auth(rtg.auth.split(":")[1]);
} else {
    var client = redis.createClient();
}

client.on("error", function (err) {
    console.log("Error " + err);
});

app.use(cors.cors);

app.get('/', function (expReq, expRes) {
    var msg = expReq.query.cmd || 'info';
    console.log('cmd', msg);


    var args = msg.split(' ');
    var cmd = args.shift();
    if (cmd == 'set') {
        var key = args.shift();
        args = [
            key,
            args.join(' ')
        ];
    }
    //console.log('message: ', cmd, args);
    args.push(function (err, res) {
        //console.log('cb', err, res);
        if (err) {
            expRes.json(err);
        } else {
            expRes.json(res);
        }
    });
    client[cmd].apply(client, args);
});

app.listen((process.env.PORT || 5000), function () {
    console.log('listening on *:5000');
});