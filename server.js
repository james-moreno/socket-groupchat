var express = require("express");
var path = require("path");
var app = express();
var history = [];


app.use(express.static(path.join(__dirname, "./static")));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render("index");
});

app.post('/posting_form', function(req, res) {
    res.render('results', ("POST DATA", req.body));
});

var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});

var io = require ('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    var username;
    socket.on('name_input', function(data) {
        username = data.name;
        socket.emit('show_chat', username, history);
    });
    socket.on('message_input', function(data) {
        var message = (username+": "+data.message);
        history.push(message);
        io.emit('update_board', history);
    });
    console.log(socket.id);
});
