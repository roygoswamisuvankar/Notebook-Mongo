//using dependencies body-parser, express, mysql, ejs
const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const app = express();

//create connection
const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'test'
});

//connect to database
conn.connect((err) => {
    if(err) throw err;
    console.log("Connected to my mysql ");
});

//routes to views engines
app.set('views', path.join(__dirname, 'views'));
//set view engine to see the ejs files graphically
app.set('view engine', 'ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended : false }));

//to use the static files which are situated in public folders, for example css files, js files etc.
app.use('/public',express.static(__dirname+'/public')); 

//view folder 
//route to note_edit.ejs
app.get('/note_edit', (req, res) => {
    res.render('noteedit');
});

//routes for home pages using GET method
app.get('/', (req, res) => {
    let sql = "select *from notebook";
    let query = conn.query(sql, (err, rows) => {
        if(err) throw err;
        res.render('index', {
            'results': rows
        });
    });
});
//save notes using POST method
app.post('/save_notes', (req, res) => {
    let data = {myNote : req.body.myNote, myDate : req.body.myDate};
    let sql = "insert into notebook set ?";
    let query = conn.query(sql, data, (err, results) => {
        let massage;
        if(err) throw err;
        else{
            massage = "Your notes save successfully";
            res.render('index', { 
                'msg' : massage
            });
        }
    });
});
//view my all notes
app.get('/view_notes', (req, res) => {
    let sql = "select *from notebook order by id desc";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});
//delete my notes using GET methods
app.get('/delete/:noteid', (req, res) => {
    const noteid = req.params.noteid;
    let sql = `DELETE from notebook where id = ${noteid}`;
    let query = conn.query(sql,(err, result) => {
        if(err) throw err;
        res.redirect('/');
    });
})


//update button go to this page to show a particular note
app.get('/update/:noteid', (req, res) => {
    const noteid = req.params.noteid;
    let sql = `SELECT *FROM notebook WHERE id = ${noteid}`;
    let query = conn.query(sql, (err, result) => {
        if(err) throw err;
        res.render('noteedit', {
            note : result[0]
        });
    });
});
//update my notes, this is link to the updatenote from noteedit.ejs
app.post('/updatenote', (req, res) => {
    const noteid = req.body.id;
    let sql = "update notebook SET myNote='"+req.body.myNote+"', myDate='"+req.body.myDate+"' where id ="+noteid;
    let query = conn.query(sql, (err, results) => {
        let massage;
        if(err) throw err;
        else{
            massage = "Updates your notes successfully";
            res.render('index', { 
                'msg' : massage
            });
        }
    });
})

//set server
app.listen(9001, () => {
    console.log("Server started at port number 9001");
});