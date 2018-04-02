var express = require('express');
var app = express();
var assert = require('assert');
app.set('port', (process.env.PORT || 5000));
var path = require('path');
app.use(express.static('public'));
var session = require('client-sessions');
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

  var MongoClient = require('mongodb').MongoClient;
  app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return console.dir(err); }
    db.collection("users").findOne({ phone: req.session.user.phone }, function(err, user) {
      if (user) {
        req.user = user;
        console.log(user);
        delete req.user.pass; // delete the password from the session
        req.session.user = user;  //refresh the session value
        res.locals.user = user;
      }
      else{req.user= {};
    req.user.id=-1;}
      // finishing processing the middleware and run the route
      next();
    });
});
  } else {
    req.user= {};
    req.user.id=-1;
    next();
  }
});
// Retrieve

var collection ;
var strJson='{"array":[';
var jsom;

MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return console.dir(err); }

  console.log("We are connected");
  collection = db.collection('dishes');
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
    res.sendFile(path.join(__dirname + '/Pages/index.html'));
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
app.get('/Pages/:in', function(req, res) {
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
    db.collection('users').find(req.user).toArray(function(err, sd) {
        if(sd[0]){
          if(!sd[0].order) sd[0].order=[];
          var ind =getIndexx(req.params.id , sd[0]);

          if(ind!=-1){
            nos+=sd[0].order[ind].nos;
            sd[0].order[ind].nos=nos;
            total=nos*req.params.price;
            sd[0].order[ind].total =total;
             db.collection('users').update(req.user,sd[0]);
          }
          else{
              y={"id" : req.params.id,"name" : req.params.name,"price" : req.params.price,"nos" : nos,"total" :req.params.price*nos};
           sd[0].order.push(y);
            console.log("Inserted a document into the restaurants collection.");
          db.collection('users').update(req.user,sd[0]);
        }
                res.jsonp( {
                "id" : req.params.id,
                "name" : req.params.name,
                "price" : price*nos,
                 "nos" : nos,
                 "login":1
                 });
    }
    else{
        res.jsonp({"login":-1});
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
    var strJson1={};
    MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return console.dir(err); }
  collection = db.collection('users');
  console.log("updating cart");
  collection.find(req.user).toArray(function(err, docs) {
            if (!err) {
              db.close();
              if(docs.length>0)
                {strJson1=docs[0];strJson1.valid=1;}
            else strJson1.valid=-1;
            } else {
              onErr(err, callback);
            }
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
            req.session.user = sdd[0];
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
    var co={};
    db.collection('users').find(req.user).toArray(function(err, sd) {
    if(sd[0]){
    query1=req.user;
    req.session.reset();
    co.order=sd[0].order;
    co.phone=sd[0].phone;
    co.name=sd[0].name;
    co.add=sd[0].add;
    co.mail=sd[0].mail;
    co.time = new Date().getTime();
    sd[0].order=[];
    console.log(sd[0]);
    console.log(query1);
    db.collection('users').update(query1,sd[0]);
    db.collection('orders').insertOne(co);}
   });
  });
      });


//pushorder
    app.get('/pushorder' , function(req,res){
        MongoClient.connect("mongodb://muthu-97:Iamadev97@ds023902.mlab.com:23902/hotel", function(err, db) {
  if(err) { return false; }
    db.collection('users').find(req.user).toArray(function(err, sd) {
    if(sd[0]){
res.jsonp({"ans":true});}
   });
  });
      });