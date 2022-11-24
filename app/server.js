var express = require('express') //llamamos a Express
var bodyParser = require('body-parser')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();


var app = express()               

var jsonParser = bodyParser.json()

var steps = [
    "BOU-001",
    "BOU-002",
    "BOU-003",
    "BOU-004",
    "BOU-005",
    "BOU-007",
    "BOU-008",
    "BOU-009",
    "BOU-010",
    "BOU-011",
    "BOU-012",
   //"BOU-013",
   //"BOU-014",
   //"BOU-015"
];

var port = process.env.PORT || 8080  // establecemos nuestro puerto
var base = "onboard-engine";
app.get('/'+base, function(req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })   
})
app.get('/'+base+"/steps", function(req, res) {
    res.json({ steps: steps })   
  })
  
app.post('/'+base+"/next-step",jsonParser, function(req, res) {
  current_step = req.body.current_step;
  current_index = steps.indexOf(current_step);
  let step;

  let data = myCache.get( req.body.data.rut );
    if ( data == undefined ){
            data = {}
    }
    data = {...data, ...req.body.data};
    data.current_step = current_step;
    myCache.set( req.body.data.rut,data);

    

  if (current_index == -1){
      step = "wrong step";
  }
  else if (current_index + 1 >= steps.length)
    step = "no more steps";
  else
    step = steps[current_index + 1];
    res.json({ next_step: step, data: data })   
})

app.post('/'+base+"/current-step",jsonParser, function(req, res) {
    current_step = req.body.current_step;
    
    let data = myCache.get( req.body.data.rut );
    if ( data == undefined ){
        data = {}
    } 
    filtered_data ={nombre: data.nombre, current_step: data.current_step}
    res.json({data: filtered_data })   
})



// iniciamos nuestro servidor
app.listen(port)
console.log('API escuchando en el puerto ' + port)