$(document).ready(function(){
 $.ajax({
  url: "https://herbs-and-spices.herokuapp.com/getactiveuser",
  dataType: "jsonp",
  jsonpCallback: 'populate',
  type:'GET',
  complete: function(data){console.log("success");}
});
})

function populate(data)
{
    var tot=0;var str="";
for (var i = 0; i < data.order.length; i=i+1) {
  tot+=parseInt(data.order[i].total);
  str+='<tr><td class="col-md-9"><em>'+data.order[i].name+'</em></h4></td><td class="col-md-1" style="text-align: center">'+data.order[i].nos+'</td>'+
  '<td class="col-md-1 text-center">'+data.order[i].price+'</td>'+
'<td class="col-md-1 text-center">'+data.order[i].total+'</td>      </tr>'
}
$('tbody').html(str+$('tbody').html());
$('#name').html(data.name);
$('#add').html(data.add);
$('#PN').html(data.phone);
$('#subt').html("Rs."+tot);
$('#tax').html("Rs."+(0.05*tot));
$('#tot').html("Rs." +(tot+(0.05*tot)));

 $.ajax({
  url: "https://herbs-and-spices.herokuapp.com/logout",
  dataType: "jsonp",
  jsonpCallback: 'd',
  type:'GET',
  complete: function(data){console.log("order stored!");}
});
}