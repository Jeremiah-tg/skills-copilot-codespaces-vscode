//create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const port = 3000;

//middleware
app.use(bodyParser.json());
app.use(cors());

// read json file
const commentsPath = path.join(__dirname, 'data/comments.json');
const comments = JSON.parse(fs.readFileSync(commentsPath, 'utf-8'));

// get all comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// get single comment
app.get('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if(!comment) return res.status(404).send('The comment with the given ID was not found.');
    res.json(comment);
});

// create new comment
app.post('/comments', (req, res) => {
    const comment = {
        id: comments.length + 1,
        name: req.body.name,
        comment: req.body.comment
    };
    comments.push(comment);
    fs.writeFileSync(commentsPath, JSON.stringify(comments));
    res.json(comment);
});

// update comment
app.put('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if(!comment) return res.status(404).send('The comment with the given ID was not found.');

    comment.name = req.body.name;
    comment.comment = req.body.comment;
    fs.writeFileSync(commentsPath, JSON.stringify(comments));
    res.json(comment);
});

// delete comment
app.delete('/comments/:id', (req, res) => {
    const comment = comments.find(c => c.id === parseInt(req.params.id));
    if(!comment) return res.status(404).send('The comment with the given ID was not found.');

    const index = comments.indexOf(comment);
    comments.splice(index, 1);
    fs.writeFileSync(commentsPath, JSON.stringify(comments));
    res.json(comment);
});

// listen to port
app.listen(port, () => console.log(`Server started on port ${port}...`));