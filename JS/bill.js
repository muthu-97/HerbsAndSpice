$(document).ready(function(){
 $.ajax({
  url: "http://localhost:5000/getactiveuser",
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
  str+='<tr><td class="col-md-9"><em>'+data.order[i].name+'</em></h4></td><td class="col-md-1" style="text-align: center">'+data.array[0].order[i].nos+'</td>'+
  '<td class="col-md-1 text-center">'+data.order[i].price+'</td>'+
'<td class="col-md-1 text-center">'+data.order[i].total+'</td>      </tr>'
}
$('tbody').html(str+$('tbody').html());
$('#name').html(data.array[0].name);
$('#add').html(data.array[0].add);
$('#PN').html(data.array[0].phone);
$('#subt').html("Rs."+tot);
$('#tax').html("Rs."+(0.05*tot));
$('#tot').html("Rs." +(tot+(0.05*tot)));

 $.ajax({
  url: "http://localhost:5000/logout",
  dataType: "jsonp",
  jsonpCallback: 'd',
  type:'GET',
  complete: function(data){console.log("order stored!");}
});
}