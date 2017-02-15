$(document).ready(function(){
  $.ajax({
        url: "https://herbs-and-spices.herokuapp.com/logout",
        dataType: "jsonp",
        jsonpCallback: "logout",
        type:'GET',
        jsonp: 'callback',
         complete: function(data){console.log("success");}
        });
});

function checklogin()
{
    var user = $('#LUsername').val().trim().toUpperCase();
    if(!(user))
    {
         alert('Number Format wrong');
        return false;
    }
     var pass = $('#LPassword').val();
     if(pass.length<8){
        alert('Password length smaller than 8');
        return false;
     }

     console.log('check login sending ajax');
     $.ajax({
        url: "https://herbs-and-spices.herokuapp.com/login/" +user+'/'+pass,
        dataType: "jsonp",
        jsonpCallback: "logdone",
        type:'GET',
        jsonp: 'callback',
         complete: function(data){console.log("success" +data);}
        });
}

  function logdone(data){
    console.log(data);
    if(data.ans==-1)
        alert("UserName Not Found");
    if(data.ans==0)
        alert("password Incorrect");
    if(data.ans==1)
        window.location.href="menu.html";
}



window.checkregister=function ()
{
    var name = $('#Name').val();
    var email = $('#Email').val();
    var pass = $('#Password').val();
    var rpass = $('#RPassword').val();
    var pn = $('#PN').val();
    var ad= $('#Add').val();


    var p = new RegExp( /^[A-Z]{1}(([a-z])+)?(\u0020{1}[A-Z]{1}[a-z]{0,})?$/);
    if(!p.test(name))
    {
        alert('Name Format wrong');
        return false;
    }

   if(email=="")
    {
        alert('vit email Format wrong');
        return false;
    }

    if(pass.length<8){
        alert('Password length smaller than 8');
        return false;
    }

    if(!(pass.length==rpass.length)){
        alert('Passwords do not match!');
        return false;
    }
    if(pn==null && ad==null)
    {
        alert('Enter value for all Fields');
        return false;
    }
$.ajax({
  url: "https://herbs-and-spices.herokuapp.com/signup/"+name+'/'+email+'/'+pass+'/'+pn+'/'+ad,
  dataType: "jsonp",
  jsonpCallback: 'backcall',
  type:'GET'
});

}

function backcall(data){
    if(data.ans){
    alert("Registed Succesfully! Login to continue");
    window.location.href="login.html"
    return true;}
    else{
        alert("User already registered");
    }
}

