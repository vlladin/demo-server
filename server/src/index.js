import path from 'path';

import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

import Database from './lib/database.js';
import Authentication from './lib/auth.js';


let app = express();
app.use(cors());
app.use(bodyParser.json());

let database = new Database();
let auth = new Authentication(database);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/authenticate', (req, res) => {
    let authStatus = auth.authenticate(req.body);
    switch(authStatus.status){
        case 0:
            res.status(200);
            break;
        case 1:
            res.status(400);
            break;
    }
    res.json({session:authStatus.session});
});

app.get('/logout', (req, res) => {
    if(auth.canAccess(req, res, "*")){
        auth.logout(req);
    }
    res.json({});
});

app.get('/users', (req, res) => {
    if(!auth.canAccess(req, res, "admin")){
        res.json({});
    } else {
        res.json(database.getAllUsers());
    }
});

app.get('/user/:id', (req, res) => {
    if(!auth.canAccess(req, res, "admin")){
        res.json({});
    } else {
        res.json(database.getUserById(req.params.id));
    }
});

app.post('/user/create', (req, res) => {
    let createUser = database.createUser(req.body);
    switch(createUser.status){
        case 0:
            res.status(200);
            break;
        case 1:
            res.status(400);
            break;
        case 2:
            res.status(409);
            break;
    }

    res.send();
});


app.listen(3001, function () {
    console.log('Server listening on port 3001!')
});