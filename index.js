const express = require("express");
var exphbs = require('express-handlebars');
const SettingsBill = require('./settings-bill')
var bodyParser = require('body-parser');
//instatiating express
const app = express();
const settingsBill = SettingsBill();


app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// app.get("/", function (req, res) {
//     res.send("Bill Settings WebApp");
// });

// app.get('/settings/:costType', function(){
//     let costType = req.params.costType;

//     let cost = 0;
//     //lookup cost for costType
//     if (costType === 'sms'){
//         cost = settings.smsCost;
//     } else if (costType === 'call') {
//         cost = settings.callCost;
//     }

//     req.render('cost', {
//         costType,
//         cost
//     });
// });

app.get('/', function (req, res) {
    res.render('index', {/*settings: settingsBill.getSettings(),*/
    totals: settingsBill.totals()})
})

app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        smsCost: req.body.smsCost,
        callCost: req.body.callCost,
        warningLevel: req.body.warningLevel,
        criticalLevel: req.body.criticalLevel
    })
    console.log(settingsBill.getSettings());
    res.redirect('/');
    // let smsCost = req.body.smsCost;
    // let callCost = req.body.callCost;
    // let warningLevel = req.body.warningLevel;
    // let criticalLevel = req.body.criticalLevel;

    // var settings = {
    //   smsCost,
    //   callCost,
    //   warningLevel,
    //   criticalLevel
    // };

    // // process data
    // globalSetings = settings;

    // // note that data can be sent to the template
    // res.render('home', {settings})

});
app.post('/action', function (req, res) {
    //capture the call type to add
    console.log(req.body.actionType)
    settingsBill.recordAction(req.body.actionType)
    res.redirect('/');
});

app.get('/actions', function (req, res) {

res.render('actions', {actions: settingsBill.actions()});

});

app.get('/actions/:type', function (req, res) {
    //for the actiontype  
    const type= req.params.type;

    res.render('actions', {actions: settingsBill.actionsFor(type)});

});

let PORT = process.env.PORT || 3009;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});