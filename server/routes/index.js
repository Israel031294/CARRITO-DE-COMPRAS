const express = require("express");
const router = express.Router();

const JSON = require('circular-json');
var bodyParser = require('body-parser');
var fs = require('fs');

// configure the app to use bodyParser()
router.use(bodyParser.urlencoded({
  extended: true
}));
router.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({extended: false});

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get("/", (req, res,next) => {
  var data = require('./products.json');

  res.send(data).status(200);
  //console.log(data);

});

router.post("/",urlencodedParser, (req, res,next) => {
  //var data = require('./products.json');
  var total = 0;

  var ticket = "<html><head></head><body>";
  ticket += "<div style='text-align:center;width:100%;'><h1>Ticket de compra</h1>";
  ticket += "<table style='text-align:center;width:100%;'><thead style='text-align:center;'> ";
  ticket += "<tr><th>Producto</th><th>Cantidad</th><th>Precio</th><th>Total</th></tr>";
  ticket += "</thead><tbody style='text-align:center;'>";


  var searchById=function(x, id){
    for(var i = 0; i < x.length; i++) {
        if (x[i]['id']==id){
            return i;
        }
    }
    return -1; //This means no match found
  }

  req.body.prod.forEach(product => {
    total += product.price * product.order;
    var fileName = './products.json';
    var file = require(fileName);

    var index = searchById(file.products, product.id);
    file.products[index].status -= product.order

    fs.writeFile(fileName, JSON.stringify(file), function (err) {
      if (err) return console.log(err);
      //console.log(JSON.stringify(file));
      console.log('Guardando venta en ' + fileName + "...");
    });

    ticket += "<tr><td>"+product.name+"</td><td>"+product.order+"</td><td>"+product.price+"</td><td>"+(product.price*product.order)+"</td></tr>";
  });
  
  ticket += "</tbody><tfooter style='text-align:center;'><tr><td></td><td></td><td></td><td>Total: "+total+"</td></tr></tfooter>";
  ticket += "</table></div>";
  ticket += "</body></html>"; 

  console.log(ticket);

  //res.send(JSON.stringify(req.body)).status(200);
  res.send(JSON.stringify({ticketr:ticket})).status(200);
  console.log("Venta realizada")
  console.log(req.body);
  console.log("\n\t Enviando ticket....")

});

module.exports = router;
