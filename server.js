var redis = require("redis");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


//app.get('/', function(req, res){
//  res.sendfile('index.html');
//});

io.on('connection', function(socket){
    //console.log('a user connected');
  
    var client = redis.createClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    //client.set("string key", "string val", redis.print);
    //client.get("string key", "string val", redis.print);
    
    socket.on('sioin', function(msg){
        var args = msg.split(' ');
        var cmd = args.shift();
        if(cmd == 'set') {
            var key = args.shift();
            args = [
                key,
                args.join(' ')
            ];
        }
        //console.log('message: ', cmd, args);
        args.push(function (err, res) {
            //console.log('cb', err, res);
            if(err) {
                socket.emit('sioerr', err);
            } else {
                socket.emit('sioout', res);
            }
        });
        client[cmd].apply(client, args);
    });
});

http.listen(3000, function(){
    //console.log('listening on *:3000');
});