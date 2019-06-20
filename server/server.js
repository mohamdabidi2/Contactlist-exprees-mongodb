const express = require("express");
const assert = require("assert");
const cors=require('cors')
const { MongoClient, ObjectID } = require("mongodb");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const MongoURL = "mongodb://localhost:27017";
const dbName='todo'
MongoClient.connect(MongoURL,{ useNewUrlParser: true }, (err, client) => {
  assert.equal(err, null, "connection failed");
  console.log("success of connection between db and server");
  var db = client.db(dbName);


app.get("/",(req,res)=>{
res.send("welcome to todo API")
})



// ADD todo
app.post("/todo",(req,res)=>{
  const body=req.body
  db.collection('todo').insertOne(body,(err,data)=>{
    if(err){
      res.status(400).send('failed to insert')
    }
    else{
      res.send(body)
    }
  })
})


// GET ALL todoS
app.get("/todo",(req,res)=>{
  db.collection('todo').find().toArray((err,data)=>{
    if(err){
      res.status(404).send('could not fetch data')

    }
    else{res.send(data)}
  })
})
// GET ONE SPECIFIC todo
app.get("/todo/:id",(req,res)=>{
 const id= req.params.id;
 db.collection('todo').findOne({_id: ObjectID(id)}, (err,data)=>{
   if(err){
     res.status(404).send('todo not exist')

   }
   else{
     res.send(data)
   }
 })
 
})
// MODIFY todo
app.put('/modify_todo/:id',(req,res)=>{
  const id= req.params.id;
  const body= req.body
  db.collection('todo').findOneAndUpdate({_id:ObjectID(id)},{$set: {...body}},(err,data)=>{
if (err){
  res.status(400).send('failed to modify')
}
else{
  res.send(body)
}
  })

})
// DELETE todo
app.delete('/delete_todo/:id',(req,res)=>{
  const id=req.params.id;
  db.collection('todo').findOneAndDelete({_id:ObjectID(id)},(err,data)=>{
    if (err){
      res.status(400).send('failed to delete')
    }
    else{
      res.send("todo was deleted")
    }
  })
})

});


app.listen(4000, () => {
  console.log("server is listen on port 4000");
});
