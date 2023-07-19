//create web server
var express = require('express');
//create an instance of express
var app = express();
//create a server with express
var server = require('http').createServer(app);
//create a socket connection
var io = require('socket.io')(server);
//create a connection to the database
var mongoose = require('mongoose');
//connect to the database
mongoose.connect('mongodb://localhost/comments');
//create an instance of the mongoose schema
var commentSchema = mongoose.Schema({
    name: String,
    comment: String
});
//create a model for the schema
var Comment = mongoose.model('Comment', commentSchema);
//create a route
app.get('/', function(req, res, next){
    res.sendFile(__dirname + '/index.html');
});
//create a route to get comments from the database
app.get('/comments', function(req, res, next){
    Comment.find({}, function(err, comments){
        res.json(comments);
    });
});
//create a route to post comments to the database
app.post('/comments', function(req, res, next){
    var newComment = new Comment(req.body);
    newComment.save(function(err, comment){
        io.emit('comment', newComment);
        res.json(comment);
    });
});
//listen for connections
io.on('connection', function(socket){
    console.log('a user connected');
    //listen for disconnections
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    //listen for comments
    socket.on('comment', function(comment){
        console.log('comment received');
        //send comment to the database
        var newComment = new Comment(comment);
        newComment.save(function(err, comment){
            io.emit('comment', newComment);
        });
    });
});
//listen for connections
server.listen(3000, function(){
    console.log('listening on port 3000');
});