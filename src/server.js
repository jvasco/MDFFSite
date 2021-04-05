const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
// Load Node modules
// var express = require('express');
// // Initialise Express
// var app = express();
// // Render static files
// app.use(express.static('public'));
// // Port website will run on
// app.listen(8080);
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));


var mysqlConnection = mysql.createConnection({
host: 'localhost',
user: 'root',
password: 'Cr3ntist',
database: 'fantasyfootball',
multipleStatements: true


});

mysqlConnection.connect((err)=> {
    if(!err){
        //no errpr
        console.log('Connection Estjrablished Successfully');
    }
    else{
        console.log('Connection Failed!' + JSON.stringify(err,undefined,2));
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get('/accounts', (req, res) => {
   mysqlConnection.connect();
    mysqlConnection.query('SELECT * FROM accounts;', (err, rows, fields) => {
        if (!err){
           res.send(rows);
        //    res.send({express: 'Hello from express'});
        }
        else{
            console.log(err);
        }
    })
    console.log("maybe?");
    res.send({express: 'Hello from express'});

});

app.get('/learners/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM learners WHERE learner_id = ?',[req.params.id], (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }
        else{
            res.status(404).send('Sorry, cant learner with ID: ' + [req.params.id]);
            console.log('Did not find learner with ID: ' + [req.params.id]);
            console.log(err);
        }
    })
});

app.post('/learners', (req, res) => {
    let learner = req.body;
    var sql = 'SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_Id = ?;SET @learnerscol = ?; CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_id,@learnerscol);';
    mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id, learner.learnerscol], (err, rows, fields) => {
        if (!err)
        rows.forEach(element => {
        if(element.constructor == Array)
        res.send('New Learner ID : '+ element[0].learner_id);
        });
        else
        console.log(err);
        })
});