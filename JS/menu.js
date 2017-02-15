var all,bigData,bigCart;

$(document).ready(function(){

    doi();
    updateIt();
$('.btn-cart').click(function(){viewCart()});
$('.cat').each(function(i, obj) {
    $(this).width(($(window).width()-150));
});
        $('#men').hide();
        $('#bar').click(function(){$('#men').slideDown();});
$('.cat').css({'width':($(window).width()-150)+'px'});


    $(document).on("scroll", onScroll);

    //smoothscroll
    $('a[href^="#"]').on('click', function (e) {
        e.preventDefault();
        $(document).off("scroll");

        $('a').each(function () {
            $(this).removeClass('active');
        })
        $(this).addClass('active');

        var target = this.hash,
            menu = target;
        ttarget = $(target);
        $('html, body').stop().animate({
            'scrollTop': ttarget.offset().top-48
        }, 500, 'swing', function () {
            window.location.hash = target;
            $(document).on("scroll", onScroll);
        });
    });
});

function onScroll(event){
    var scrollPos = $(document).scrollTop();
    $('#men li a').each(function () {
        var currLink = $(this);
        var refElement = $(currLink.attr("href"));
        if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('#men li a').removeClass("active");
            currLink.addClass("active");
            console.log("activated");
        }
        else{
            currLink.removeClass("active");
        }
    });
}


function jsonCallback(data){bigData=data;
    var elem,eles,item ;
all=[data.array[0].id,data.array[1].id,data.array[2].id,data.array[3].id,data.array[4].id,data.array[5].id,data.array[6].id,data.array[7].id,data.array[8].id];
        for(var j=0;j<9;j++){
            var idc =data.array[j].id;
            $('#content').append("<a name='"+idc+"'></a><div id='"+idc+"' class='cat' style=\"background:url('../Images/menu/"+idc+".jpg') no-repeat #E7E7E7;background-size: contain;\"></div>");
            elem = $('#'+idc);
        elem.append("<div class ='container'></div>");
        eles=elem.children().first();
       for(var i=0;i<data.array[j].total;i++){
        item = data.array[j].items[i];
       var dname = item.Dname;
       var id =item.id ;
       var des = item.des;
       var cost = item.cost;
       var str="<div class='product' id='"+id+"'>"+
       "<div> <img class='pimg' src='../Images/menu/"+id+".jpg'></img></div>"+
       "<div class='pdet'>"+
       "<h2 class='pname'>" + dname +"</h2>"+
       "<h4 class='pprice'>Rs."+cost+"</h4></div>"+
       "<select class='quantity'><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option></select>"+
       "<div class='actions'><a href='javascript:addtocart(\""+id+"\" , \""+dname+"\" , \""+cost+"\")' class='addtocart'><span>add to order</span><img class='cart-icon' src='../Images/menu/cart.svg'></img></a></div><div style='clear: both'></div>";

        eles.append(str);
        if((i+1)%4==0){
            elem.append("<div class ='container'></div>");
            eles=eles.next();
        }
    }

}
    var cw = $('.pimg').width();
    $('.pimg').css({'height':cw+'px'});
}


function doi()
{
$.ajax({
  url: "http://localhost:5000/api",
  dataType: "jsonp",
  jsonpCallback: 'jsonCallback',
  type:'GET',
    data: {
    id: "123"
  },
  complete: function(data){console.log(data);}
});
}


function addtocart(id, name, price){
  var nos=$(('#'+id+' > select')).val();
  console.log(nos);
  $.ajax({
  url: "http://localhost:5000/addcart/"+id+'/'+name+'/'+price+'/'+nos,
  dataType: "jsonp",
  jsonpCallback: 'popup',
  type:'GET',
    data: {
    id: "123"
  },
  complete: function(data){console.log("success");}
});
}

function popup(data)
{
  if(data.login==-1){alert("Login to add items to cart!");return;}
    var id=data.id;
    var nos = data.nos;
    var price = data.price;
    var name = data.name;
    var item=$('#addpopup');
    $('#addpopup img').attr('src','../Images/menu/'+id+'.jpg');
    $('#addpopup h5').text(' ' +nos + '    ' + name);
    $('#addpopup h3').text('Rs.' + price);
        item.show();
    setTimeout(function() {
        $("#addpopup").hide();
    }, 5000);
    updateIt();
  }

  function updateIt(){
  $.ajax({
  url: "http://localhost:5000/getactiveuser",
  dataType: "jsonp",
  jsonpCallback: 'updatecart',
  type:'GET',
  complete: function(data){console.log("success");}
});
}

function updatecart(data){
bigCart=data;
if(bigCart.valid==-1){alert("Login to order");return;}
$('.greeting').html(bigCart.name);
var tot=0;
if(bigCart.order){
$('.cart-indicator span').text(bigCart.order.length);

for (var i = 0; i < bigCart.order.length; i=i+1) {
  tot+=parseInt(bigCart.order[i].total);
}
if(tot!=0)
$('#js-total-price').text('Rs. '+tot);}

}

function viewCart(){
  $('#popcart-data').empty();
  if(bigCart.valid==-1){alert("Login to view cart");return;}
  if(bigCart.order){
  for(var i=0;i<bigCart.order.length;i++)
  {
  var str= '<div class="popcart-indata">'+
    '<img width ="50px"; height="50px" src="../Images/menu/'+bigCart.order[i].id+'.jpg" >'+
    '<h5>'+bigCart.order[i].nos+'     '+bigCart.order[i].name+' </h5>'+
    '<h3>Rs.'+bigCart.order[i].total+'</h3></div>';
  $('#popcart-data').append(str);
  }
}
   $('#popcart').show();
   $("#addpopup").hide();
    setTimeout(function() {
        $("#popcart").hide();
    }, 10000);
}


function finishJob(){
  $.ajax({
  url: "http://localhost:5000/pushorder",
  dataType: "jsonp",
  jsonpCallback: 'pushorder',
  type:'GET',
  complete: function(data){console.log("success");}
});
}

function pushorder(data)
{
  window.location.href="bill.html"
}