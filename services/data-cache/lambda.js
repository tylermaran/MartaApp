var http = require("http");
var admin = require("firebase-admin");
var serviceAccount = require("marta-hw-firebase-adminsdk-r2a7l-1fb6684580.json");
var request = require("request");

exports.handler = (event, context, callback) => {

    if (admin.apps.length == 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://marta-hw.firebaseio.com"
        });
    }
    
    var database = admin.database();

    // Marta API key
    var martaKey = "2a3502f1-d73a-4fd9-bafe-dc2c5d5c1b1e";
    // Marta API connection settings
    const MARTA_BASE_URL = "http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals";

    var options = {
        method: 'GET',
        url: `${MARTA_BASE_URL}`,
        qs: { apikey: `${martaKey}` },
        headers:
        {
            'Cache-Control': 'no-cache'
        }
    };

    request(options, function (error, response, body) {
        body = JSON.parse(body);
        console.log('body', body);
        console.log('database', database);
        var dataset = [];
        for (var obj of body) {
            console.log('looping obj', obj);
            dataset.push(obj);
        }
        database.ref('trains/').set(dataset);
        if (error != null) {
            process.stdout.write(error);
            console.log(error.toString());
        };
        return;
    });
    
    callback(null, "done");
    
}

