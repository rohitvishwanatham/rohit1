var express=require("express");
var mongo=require("mongodb");

var MongoClient=mongo.MongoClient;
var app=express();
var bodyParser=require('body-parser');
let middleware=require('./middleware.js');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT=3030;
let db
//database connection
const url='mongodb://localhost:27017';
const dbname='hospitalmanagment';

MongoClient.connect(url,{useUnifiedTopology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`connected database: ${url}`);
    console.log(`databasename:${dbname}`);

})

app.get("/hospitaldetails",middleware.checkToken,(req,res)=>{
    console.log("hospital details");
    var data=db.collection('hospital').find().toArray().then(result=>res.json(result));
})
app.get("/ventilatordetails",middleware.checkToken,(req,res)=>{
    
    console.log("ventilator details");
    var data=db.collection('ventilator').find().toArray().then(result=>res.json(result));

})
app.post("/ventilatorbystatus",middleware.checkToken,(req,res)=>{
   
    var status=req.body.status;
   
    var data=db.collection("ventilator").find({"status":status}).toArray().then(result=>res.json(result));
})
app.post("/ventilatorbyhospname",middleware.checkToken,(req,res)=>{
    var hospital=req.body.name;
    console.log("ventilator by hospital");
    var data=db.collection("ventilator").find({"name":new RegExp(hospital,'i')}).toArray().then(result=>res.json(result));

})
app.post("/searchhosp",middleware.checkToken,(req,res)=>{
    var name=req.body.name;
    var data=db.collection("hospital").find({"name":new RegExp(name,'i')}).toArray().then(result=>res.json(result));
})
app.put("/updateventilator",middleware.checkToken,(req,res)=>{
    var ventid={hid:req.body.hid};
    console.log(ventid);
    var status ={ $set: {status:req.body.status} };
    db.collection("ventilator").updateOne(ventid,status,(err,result)=>{
        res.json("1 doc updated");
        if(err) throw err;
    })

})
app.post("/addventilator",middleware.checkToken,(req,res)=>{
    var vent={
        hid:req.body.hid,
        status:req.body.status,
        name:req.body.name,
    }
    
    console.log(vent);
    
    db.collection("ventilator").insertOne(vent)
   res.json("added");
})
app.delete("/deletevent",middleware.checkToken,(req,res)=>{
    var vent={hid:req.body.hid};
    
    db.collection("ventilator").deleteOne(vent);
    res.json("deleted");
})







app.listen(PORT,()=> console.log(`server running on port:${PORT}`));