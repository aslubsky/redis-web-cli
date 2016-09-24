if (process.env.REDIS_URL) {
    var rtg = require("url").parse(process.env.REDIS_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]);
} else {
    var redis = require("redis");
}

console.log(process.env.REDIS_URL);

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    transports: ['polling'],
    'polling duration': 10
});

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

///REDIS_URL:

io.on('connection', function (socket) {
    console.log('a user connected');
    console.log('redis', redis);

    var client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

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