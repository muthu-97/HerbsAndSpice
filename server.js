var express = require('express');
var app = express();
var assert = require('assert');
app.set('port', (process.env.PORT || 5000));
var path = require('path');
app.use(express.static(__dirname + "/public"));

// Retrieve
var MongoClient = require('mongodb').MongoClient;
var collection ;
var strJson='{"array":[';
var jsom;

MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return console.dir(err); }
  console.log("We are connected");
  collection = db.collection('dishes');
  console.log("We are connected");
  collection.find().toArray(function(err, docs) {
            if (!err) {
              db.close();
              var intCount = docs.length;
              if (intCount > 0) {
                for (var i = 0; i < intCount;) {
                  strJson +=  JSON.stringify(docs[i]);

                  i = i + 1;
                  if (i < intCount) {
                    strJson += ',';
                  }
                }
              }
            } else {
              onErr(err, callback);
            }
            strJson+=']}';
            jsom=JSON.parse(strJson);

        });
  });
    app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/pages/index.html'));
});
app.get('/Style/:in', function(req, res) {
    res.sendFile(path.join(__dirname + '/Style/'+req.params.in));
});
app.get('/Images/:in/:out', function(req, res) {
    res.sendFile(path.join(__dirname + '/Images/'+req.params.in+'/'+req.params.out));
});
app.get('/Images/:in', function(req, res) {
    res.sendFile(path.join(__dirname + '/Images/'+req.params.in));
});
app.get('/JS/:in', function(req, res) {
    res.sendFile(path.join(__dirname + '/JS/'+req.params.in));
});
app.get('/pages/:in', function(req, res) {
    res.sendFile(path.join(__dirname + '/Pages/'+req.params.in));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


  app.get('/api' , function(req,res){
    res.jsonp(jsom);
  });



  app.get('/addcart/:id/:name/:price/:nos' , function(req,res){
  var  price=parseInt(req.params.price);
  var x;var nos=parseInt(req.params.nos);
  MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { console.log('error');return false; }
   var query={};
   query.active=1;
    db.collection('users').find(query).toArray(function(err, sd) {
        if(sd[0]){
          if(!sd[0].order) sd[0].order=[];
          var ind =getIndexx(req.params.id , sd[0]);

          if(ind!=-1){
            nos+=sd[0].order[ind].nos;
            sd[0].order[ind].nos=nos;
            total=nos*req.params.price;
            sd[0].order[ind].total =total;
             db.collection('users').update(query,sd[0]);
          }
          else{
              y={"id" : req.params.id,"name" : req.params.name,"price" : req.params.price,"nos" : nos,"total" :req.params.price*nos};
           sd[0].order.push(y);
            console.log("Inserted a document into the restaurants collection.");
          db.collection('users').update(query,sd[0]);
        }
                res.jsonp( {
                "id" : req.params.id,
                "name" : req.params.name,
                "price" : price*nos,
                 "nos" : nos
                 });
    }
    });

});
});

  function getIndexx(a , s){
    for(var i=0;i<s.order.length;i++){
        if(s.order[i].id==a) return i;
    }
    return -1;
  }


  app.get('/getactiveuser' , function(req,res){
    var strJson1='{"array":[';
    MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return console.dir(err); }
  collection = db.collection('users');
  console.log("updating cart");
  var query={};
  query.active=1
  collection.find(query).toArray(function(err, docs) {
            if (!err) {
              db.close();

              var intCount = docs.length;
              if (intCount > 0) {
                for (var i = 0; i < intCount;) {
                  strJson1 +=  JSON.stringify(docs[i]);

                  i = i + 1;
                  if (i < intCount) {
                    strJson1 += ',';
                  }
                }
              }
            } else {
              onErr(err, callback);
            }
            strJson1+=']}';
            strJson1=JSON.parse(strJson1);
            console.log(strJson1);
            res.jsonp(strJson1);
        });
  });
  });

//signup
app.get('/signup/:name/:mail/:pass/:phone/:add' , function(req,res){
  var x={};
  console.log("signup");
  x.name=req.params.name;
  x.mail=req.params.mail;
  x.pass=req.params.pass;
  x.add=req.params.add;
  x.phone=req.params.phone;
  x.active=0;
  var retObj={};
  MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return false; }
   var query={};
   query.mail=req.params.mail;
    db.collection('users').find(query).toArray(function(err, sd) {
        if(!sd[0]){
            db.collection('users').insertOne(x);
            retObj.ans=true;
        }
        else
        {
            retObj.ans=false;
        }
        res.jsonp(retObj);
        console.log(retObj);
    });
});
});

//login
app.get('/login/:phone/:pass' , function(req,res){
  var retObj={};
   var query={};
   query.phone=req.params.phone;
   MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return false; }

    db.collection('users').find(query).toArray(function(err, sdd) {
        if(!sdd[0]){
            console.log('obj not found');
            retObj.ans=-1;
        }
        else
        {
            if(sdd[0].pass==req.params.pass){
            retObj.ans=1;
            sdd[0].active=1;
            db.collection('users').remove(query);
            db.collection('users').insertOne(sdd[0]);
            }
            else
            retObj.ans=0;

        }
        res.jsonp(retObj);
        console.log(retObj);
    });
});
});


//logout
    app.get('/logout' , function(req,res){
        MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return false; }

     var query1={};query1.active=1;
    db.collection('users').find(query1).toArray(function(err, sd) {
    if(sd[0]){
    query1.id=sd[0].id;
    sd[0].active=0;
    sd[0].order=[];
    console.log(sd[0]);
    console.log(query1);
    db.collection('users').update(query1,sd[0]);}
   });
  });
      });


//pushorder
    app.get('/pushorder' , function(req,res){
        MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return false; }

     var query1={};query1.active=1;
    db.collection('users').find(query1).toArray(function(err, sd) {
    if(sd[0]){
res.jsonp({"ans":true});}
   });
  });
      });