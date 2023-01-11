var express = require('express') //llamamos a Express
var bodyParser = require('body-parser')
const NodeCache = require("node-cache");
const myCache = new NodeCache();

// interface ResponseStep {
//   current_step: Step;
//   next_step: Step;
//   last_step: Step;
// }

var app = express()

var jsonParser = bodyParser.json()

let steps = [
  { code: "ABC-001", url: "url_1", name: "home_page" },
  { code: "B-002", url: "url_2", name: "form_page" },
  { code: "AB-003", url: "url_3", name: "auth_page" },
  { code: "BC-004", url: "url_4", name: "valid_page" },
  { code: "AC-005", url: "url_5", name: "5_page" },
  { code: "C-006", url: "url_6", name: "6_page" },
  { code: "ABC-007", url: "url_7", name: "7_page" },
  {code: "BOU-008", url: "url_1", name: "home_page1"},
  { code: "A-008", url: "url_8", name: "8_page" },
  { code: "B-009", url: "url_9", name: "9_page" },
  { code: "AB-010", url: "url_10", name: "10_page" },
  { code: "AC-011", url: "url_11", name: "11_page" },
  { code: "ABC-012", url: "url_12", name: "12_page" }
];

var port = process.env.PORT || 8080  // establecemos nuestro puerto
var base = "onboard-engine";
app.get('/' + base, function (req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })
})
app.get('/' + base + "/steps", function (req, res) {
  res.json({ steps: steps })
})

app.post('/' + base + "/next-step", jsonParser, function (req, res) {
  try{
    current_step = req.body.current_step;
    current_index = steps.findIndex((x) => x.code === current_step.code);
    let step;
    let last_astep;
    if (current_index == -1) {
      step = "wrong step";
    }
    else if (current_index + 1 >= steps.length)
      step = "no more steps";
    else
      step = steps[current_index + 1];
      last_astep = steps[current_index - 1];
      
      //Get first caracter of current step in value of code
      let firstCharacter = current_step.code.charAt(0);
      let filteredSteps = steps.filter(step => step.code.includes(firstCharacter));
      //Filter steps by caracter
      let filteredStepsIndex = filteredSteps.findIndex((x) => x.code === current_step.code);
      let currentStepCode = parseInt(current_step.code.split("-")[1]);
      let higher=null, lower=null;
      let right = filteredSteps[filteredStepsIndex + 1] || null;
      let left = filteredSteps[filteredStepsIndex - 1] || null;
      //Get the next and previous step
      for (const element of filteredSteps) {
        
        // if(right){
        //   let nextNumber = parseInt(right.code.split("-")[1]) || null;
        //   if(nextNumber > currentStepCode)
        //     higher = element;
        // }
        // if(left){
        //   let previousNumber = parseInt(left.code.split("-")[1]) || null;
        //   if(previousNumber < currentStepCode)
        //     lower = element;
        // }
      }
    res.json({ next_step: right, current_step: current_step, last_astep: left })
  } catch (error){
      res.json({error: error});
  }
});

// iniciamos nuestro servidor
app.listen(port);
console.log('API escuchando en el puerto ' + port);