var express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
var ObjectID = require('mongodb').ObjectID
var cors = require('cors')
var connectionString = "mongodb://localhost:27017/AwesomeStartup"
var app = express()
app.use(express.static('assets'))
app.use(cors())
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('studentsDB')
    const studentsCollection = db.collection('students')
   
    app.get('/', function (req, res) {
        
        db.collection('students').find().toArray()
        .then(results => {
            var students = results;
            res.render('index.ejs', { students: students})
        }).catch(console.error)      
    })
    app.get('/student', function (req, res) {
      db.collection('students').find().toArray()
        .then(results => {
            var students = results;
            res.send(students)
        }).catch(console.error)   
    })
    app.post('/student', function (req, res) {
      req.body.date_of_birth = new Date(req.body.date_of_birth);
     studentsCollection.insertOne(req.body)
        .then(result => {
          var result={};
          result.message = 'Succesfully Added Student'
          res.send(result)
        })
        .catch(error => console.error(error))
    })
    app.put('/student/:id', function (req, res) {  
      //console.log(req.params.id);
      //console.log(req.body);
      if(req.body.date_of_birth!=undefined){
        req.body.date_of_birth = new Date(req.body.date_of_birth);
      }
      var result = studentsCollection.updateOne(
            { "_id" :  ObjectID(req.params.id)},
            { $set: req.body }
         ) 
      .then(result => {
          var result={};
          result.message = 'Succesfully Updated Student'
          res.send(result)
        })
        .catch(error => console.error(error))    

    })

    app.delete('/student/:id', function (req, res) {  
      //console.log(req.params.id);
      //console.log(req.params.id);
      var result = studentsCollection.deleteOne(
            { "_id" :  ObjectID(req.params.id)}
            
         ) 
      .then(result => {
          var result={};
          result.message = 'Succesfully Deleted Student'
          res.send(result)
        })
        .catch(error => console.error(error))    

    })


  })
.catch(console.error)

let port = process.env.PORT || 3000;
app.listen(port, function () {
    return console.log("Started server on port " + port);
});