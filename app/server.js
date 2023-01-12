var express = require('express') //llamamos a Express
var bodyParser = require('body-parser')
const NodeCache = require("node-cache");
const myCache = new NodeCache();

var app = express()

var jsonParser = bodyParser.json();
// nomenclatura del codigo <iniciales del flujo>-numero de paso
let steps = [
  { id: 1, code: "GO_BICE-001", url: "url_1", name: "init_page", state: 1 },
  { id: 1, code: "GO_UC-001", url: "url_1", name: "init_page", state: 1 },
  { id: 1, code: "OUF-001", url: "url_1", name: "init_page", state: 1 },
  { id: 2, code: "GO_BICE-002", url: "url_2", name: "form_page", state: 1 },
  { id: 2, code: "GO_UC-002", url: "url_2", name: "form_page", state: 1 },
  { id: 2, code: "OUF-002", url: "url_2", name: "form_page", state: 1 },
  { id: 3, code: "GO_BICE-003", url: "url_3", name: "sms_page", state: 1 },
  { id: 3, code: "GO_UC-003", url: "url_3", name: "sms_page", state: 1 },
  { id: 3, code: "OUF-003", url: "url_3", name: "sms_page", state: 1 },
  { id: 4, code: "GO_BICE-004", url: "url_4", name: "bank_page", state: 1 },
  { id: 4, code: "GO_UC-004", url: "url_4", name: "bank_page", state: 1 },
  { id: 4, code: "OUF-004", url: "url_4", name: "bank_page", state: 1 },
  { id: 5, code: "GO_BICE-005", url: "url_5", name: "address_page", state: 1 },
  { id: 5, code: "GO_UC-005", url: "url_5", name: "address_page", state: 1 },
  { id: 5, code: "OUF-005", url: "url_5", name: "address_page", state: 1 },
  { id: 6, code: "GO_BICE-006", url: "url_6", name: "weolcome_page", state: 1 },
  { id: 6, code: "GO_UC-006", url: "url_6", name: "welcome_page", state: 1 },
  { id: 6, code: "OUF-006", url: "url_6", name: "welcome_page", state: 1 },
];

let stepsError = [
  { id: 1, code: "EGB01-001", url: "urlE_1_A", name: "error_validation", state: 1 },
  { id: 1, code: "EGB02-001", url: "urlE_1_B", name: "error_mora", state: 1 },
  { id: 1, code: "EGB03-001", url: "urlE_1_C", name: "error_segmento", state: 1 },
  { id: 2, code: "EGB04-002", url: "urlE_2_A", name: "error_pep", state: 1 },
  { id: 2, code: "EGB05-002", url: "urlE_2_B", name: "error_products", state: 1 },
  { id: 2, code: "EGB06-002", url: "urlE_2_C", name: "error_account", state: 1 },
  { id: 3, code: "EGB07-003", url: "urlE_3_A", name: "error_general", state: 1 },
  { id: 3, code: "EGB08-003", url: "urlE_3_B", name: "error_cellphone", state: 1 },
  { id: 3, code: "EGB09-003", url: "urlE_3_C", name: "error_msm", state: 1 },
];

//Pensar los errores
var port = process.env.PORT || 8080  // establecemos nuestro puerto
var base = "onboard-engine";

app.get('/' + base, function (req, res) {
  res.json({ mensaje: '¡Hola Mundo!' })
});

app.get('/' + base + "/steps", function (req, res) {
  res.json({ steps: steps })
});

app.get('/' + base + "/error-steps", function (req, res) {
  res.json({ errorSteps: stepsError })
});

app.post('/' + base + "/steps-by-glow", jsonParser, function (req, res) {
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
      //Get first caracter of current step in value of code
      let firstCharacter = current_step.flow.charAt(0);
      let filteredSteps = steps.filter(step => step.code.includes(firstCharacter));
      filteredSteps = filteredSteps.sort(((a, b) => a.id - b.id));
      res.json({ steps: filteredSteps })
  } catch (error){
      res.json({error: error});
  }
});

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
      let firstCharacter = current_step.flow;
      let filteredSteps = steps.filter(step => step.code.includes(firstCharacter));
      filteredSteps = filteredSteps.sort(((a, b) => a.id - b.id));
      //Filter steps by caracter
      let filteredStepsIndex = filteredSteps.findIndex((x) => x.code === current_step.code);
      let right = filteredSteps[filteredStepsIndex + 1] || null;
      let left = filteredSteps[filteredStepsIndex - 1] || null;
      res.json({ next_step: right, current_step: current_step, last_step: left })
  } catch (error){
      res.json({error: error});
  }
});

//The bff it's Who know the code to ask the next step error
app.post('/' + base + "/error-by-code", jsonParser, function (req, res) {
  try{
    code = req.body.code;
    let current_index = stepsError.filter(step => step.code.includes(code));
    if (!current_index == -1) {
      current_index = "wrong step";
    }
    else
      res.json({ next_step: current_index})
  } catch (error){
      res.json({error: error});
  }
});

// iniciamos nuestro servidor
app.listen(port);
console.log('API escuchando en el puerto ' + port);