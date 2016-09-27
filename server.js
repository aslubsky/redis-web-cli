var redis = require("redis");
var cors = require("./cors");

//console.log(process.env.REDIS_URL);

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    transports: ['polling'],
    'polling duration': 10
});

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

app.get('/api', function (expReq, expRes) {
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
            expRes.json({
                code: "OK",
                data: res
            });
        }
    });
    client[cmd].apply(client, args);
});





app.get('/', function (req, res) {
    res.sendfile('index.html');
});
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

///REDIS_URL:

io.on('connection', function (socket) {
    console.log('a user connected');

    //client.set("string key", "string val", redis.print);
    //client.get("string key", "string val", redis.print);

    socket.on('sioin', function (msg) {
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
                socket.emit('sioerr', err);
            } else {
                socket.emit('sioout', res);
            }
        });
        client[cmd].apply(client, args);
    });
});


http.listen((process.env.PORT || 5000), function () {
    console.log('listening on *:5000');
});
