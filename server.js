var ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var io = require('socket.io').listen(process.env.OPENSHIFT_NODEJS_PORT || 3001,ip_address);
var moment = require('moment');


//HeatMap data
var urlstates = 'mongodb://abhi:Techm123@ds147167.mlab.com:47167/heatmap';
var collectionNameAirports = "wizardspoc";
var collectionNamestates = "states";

io.set('origins', 'http://heatmap-trial-trial.44fs.preview.openshiftapps.com/');
io.sockets.on('connection', function (socket) {
    socket.on('message', function () {

		console.log("Incoming request");
		/*Get data from Mongo*/

      var getLatlonData = function(db){
        var trendDatas = [];
          //console.log(state);
          var cursor = db.collection(collectionNameAirports).find();
          cursor.each(function(err, doc) {
    				if (doc != null) {
              trendDatas.push(doc.loc)
    				}
          });
          console.log("Data is ready to be emitted");
          var delay=3000; //1 second
          setTimeout(function() {
              console.log(trendDatas.length);
              io.sockets.emit('graphview', { 'data': trendDatas });
          }, delay);

      }

		/*Starts Here*/
		var mongoClient = require('mongodb').MongoClient;

    mongoClient.connect(urlstates, function(err, db) {
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
      } else {
        console.log('Connection established to', urlstates);
        getLatlonData(db);
      }
    });
	});
});
