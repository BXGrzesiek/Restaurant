var express = require('express')
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const adapter = new FileSync('db.json');
const db = low(adapter);

db.defaults({ stoliki: [], guests: []})
  .write()

  function showTables(){
      try{
          return db.get('stoliki').value();
      } catch(e){
          return "ERROR!"
      }
  }
  app.get('/showTables', function(req,res)
  {
      let odp = showTables();
      if(odp != "ERROR!"){
          res.status(200);
          res.send(odp);
      } else {
          res.status(404);
          res.send(odp);
      }
  })

  function createGuestAccount(questName, questType, questMail, questPassword){
      try{
          if(questName){
              if(db.get('quests').find({questName: questName}).value()){
                  return "This guest is our customer already!"
              }else {
                  db.get('guests')
                      .push({guestID: db.get('guests').size().value()+1, guestName: guestName, guestType: guestType, guestMail: guestMail, questPassword: questPassword})
                      .write();
                  return "OK"
              }
          } else {
              return "Nothing to create!"
          }
      }
      catch (e){
          return "ERROR!"
      }
  }
  app.post('/createGuestAccount', function(req,res){
      let odp = createGuestAccount(req.body.query["guests"], req.body.query["guestName"], req.body.guestType["guestType"], req.body.guestMail["guestMail"], req.body.questPassword["guestPassword"]);
      if(odp == "OK"){
          res.status(201);
          res.send(odp);
      } else if(odp == "ERROR!"){
          res.status(404);
          res.send(odp);
      } else {
          res.status(210);
          res.send(odp);
      }
})

  function showGuests(){
    try{
      //res.sendFile(path.join(__dirname+'/index.html'));
              return db.get('guests').value();
    } catch(e){
        return "ERROR!"
    }
}
  app.get('/showGuests', function(req,res)
{
    let odp = showGuests();
    if(odp != "ERROR!"){
        res.status(200);
        res.send(odp);
    } else {
        res.status(404);
        res.send(odp);
    }
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
  })

  app.listen(3000)
