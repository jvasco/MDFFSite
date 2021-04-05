const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
const {Client, Team} = require('espn-fantasy-football-api/node');


const myClient = new Client({leagueId: 984042});
myClient.setCookies({ "espnS2": "AEAr8LJAmpeZ2QVPMtAXrQgINyUkotS%2FdgfYMGBnKNRCkQRMlvBBcohv2ML%2FGSPiI21oMyAh6Ksswb5fhTO8qn%2B2T5oIQ3hTbeUlM%2BJSX%2FvAbrwI6wmvu5FP5z1QNelEi3XK0z8NDnvXqriwZttLOA5yhXwvUZauv1mDvTgr5pkDtJZN7TooFCuCC02HLaJrw%2BGWwEfUBgZp6wGJnKgzSq5yLY80XrzGDz%2Bifjg%2FfJSuoHwiKsfJNjr2dthDBe1qnBelGshjqALgdXO42WUVJl1G", "SWID": "{844F52D1-D6BA-453B-8F52-D1D6BA053B6E}"});
const temp = myClient.getTeamsAtWeek({seasonId: 2020, scoringPeriodId: 0}).then(team => {
    // if(team.id !== 1)
    // console.log(team.i.id);
    // const temp = new Team(team);
    // console.log(team[5].id);
    // console.log("BLAH");
    team.forEach(element => { 
        if(element.id==2)
        console.log(element.name)
    });
}
);

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
        console.log('Connection Establsssssished Successfully');
    }
    else{
        console.log('Connection Failed!' + JSON.stringify(err,undefined,2));
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));

app.get('/accounts', (req, res) => {
    console.log("Blah");
  //  mysqlConnection.connect();
    mysqlConnection.query('SELECT * FROM accounts', (err, rows, fields) => {
        if (!err){
            //  res.send({express: rows});
           res.send({express: 'Hello from express'});
        }
        else{
            console.log(err);
        }
    })

})

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

app.get('/accounts/:username&:password', (req, res) => {
    mysqlConnection.query('SELECT * from accounts WHERE username = ? AND password = ?', [req.params.username, req.params.password], (err, rows, fields) => {
        if(!err && rows.length >= 1){
            console.log("Rows: " + rows  + "username: " + req.params.username + " password: " + req.params.password);
            res.send(rows);
        }
        else{
            res.status(404).send('Sorry, incorrect username o r password');
            console.log(err);
        }
    })
});

app.get('/rosters/:username', (req, res) => {
    const userID = mysqlConnection.query('SELECT id FROM fantasyfootball.accounts where username = ?', [req.params.username], (err, rows, fields) => {
        if(!err){
            console.log('User ID: ' + userID);
            const temp2 = rows[0].id;
            console.log('temp2 is: ' + temp2);
            const temp = myClient.getTeamsAtWeek({seasonId:2020, scoringPeriodId: 17}).then(teams=>{
                res.send(teams[temp2-1])
            })
            
        }
        else{
            res.status(404).send('Sorry, incorrect username o r password');
            console.log(err);
        }
    }
    );
})

app.get('/roster/:username&:week', (req, res) => {
    console.log('how about here');
    const userID = mysqlConnection.query('SELECT id FROM fantasyfootball.accounts where username = ?', [req.params.username], (err, rows, fields) => {
        if(!err){
            console.log('User ID: ' + userID);
            console.log('week: ' + req.params.week);
            const temp2 = rows[0].id;
            console.log('temp2 is: ' + temp2);
            const temp = myClient.getTeamsAtWeek({seasonId: 2020, scoringPeriodId: req.params.week}).then(teams => {
                const teams2 = teams;
                console.log("does this work: " + teams[temp2-1].id);
                teams[temp2-1].roster.forEach(player => {
                    
                    console.log("Player name: " + player.fullName);
                })
                res.send(teams[temp2-1]);
                // teams.forEach(element => {
                //     console.log('elemnt id is: ' + element.id + 'and temp is: ' + temp2);
                //     if(element.id==temp2){
                //         console.log(element.roster[0].fullName + "huh?");
                //     }
                // })
            })
            
        }
        else{
            res.status(404).send('Sorry, incorrect username o r password');
            console.log(err);
        }
    }
    );
})

// app.post('/learners', (req, res) => {
//     let learner = req.body;
//     var sql = 'SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_Id = ?;SET @learnerscol = ?; CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_id,@learnerscol);';
//     mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id, learner.learnerscol], (err, rows, fields) => {
//         if (!err)
//         rows.forEach(element => {
//         if(element.constructor == Array)
//         res.send('New Learner ID : '+ element[0].learner_id);
//         });
//         else
//         console.log(err);
//         })
// });
app.post('/learners', (req, res) => {
    let learner = req.body;
    var sql = 'SET @learner_id = ?; CALL learnerAddId(@learner_id);';
    mysqlConnection.query(sql, [learner.learner_id], (err, rows, fields) => {
        if (!err)
        rows.forEach(element => {
        if(element.constructor == Array)
        res.send('New Learner ID : '+ element[0].learner_id);
        });
        else
        console.log(err);
        })
});