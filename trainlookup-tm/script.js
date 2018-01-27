var ALLSTATIONS = ["AIRPORT STATION", "ARTS CENTER STATION", "ASHBY STATION", "AVONDALE STATION", "BANKHEAD STATION", "BROOKHAVEN STATION", "BUCKHEAD STATION", "CHAMBLEE STATION", "CIVIC CENTER STATION", "COLLEGE PARK STATION", "DECATUR STATION", "DORAVILLE STATION", "DUNWOODY STATION", "EAST LAKE STATION", "EAST POINT STATION", "EDGEWOOD CANDLER PARK STATION", "FIVE POINTS STATION", "GARNETT STATION", "GEORGIA STATE STATION", "HAMILTON E HOLMES STATION", "INDIAN CREEK STATION", "INMAN PARK STATION", "KENSINGTON STATION", "KING MEMORIAL STATION", "LAKEWOOD STATION", "LENOX STATION", "LINDBERGH STATION", "MEDICAL CENTER STATION", "MIDTOWN STATION", "NORTH AVE STATION" ,"NORTH SPRINGS STATION" ,"OAKLAND CITY STATION" ,"OMNI DOME STATION" ,"PEACHTREE CENTER STATION" ,"SANDY SPRINGS STATION" ,"VINE CITY STATION" ,"WEST END STATION" ,"WEST LAKE STATION"];

var REDLINE = ["AIRPORT STATION", "ARTS CENTER STATION", "BUCKHEAD STATION", "CIVIC CENTER STATION", "COLLEGE PARK STATION", "DUNWOODY STATION", "EAST POINT STATION", "FIVE POINTS STATION", "GARNETT STATION", "LAKEWOOD STATION", "LINDBERGH STATION", "MEDICAL CENTER STATION", "MIDTOWN STATION", "NORTH AVE STATION" ,"NORTH SPRINGS STATION" ,"OAKLAND CITY STATION" , "PEACHTREE CENTER STATION" ,"SANDY SPRINGS STATION" ,"VINE CITY STATION" ,"WEST END STATION"];

var GOLDLINE = ["AIRPORT STATION", "ARTS CENTER STATION", "BROOKHAVEN STATION", "CHAMBLEE STATION", "CIVIC CENTER STATION", "COLLEGE PARK STATION", "DORAVILLE STATION", "EAST LAKE STATION", "EAST POINT STATION", "FIVE POINTS STATION", "GARNETT STATION", "LENOX STATION", "LINDBERGH STATION", "MIDTOWN STATION", "NORTH AVE STATION" ,"OAKLAND CITY STATION", "PEACHTREE CENTER STATION", "WEST END STATION"];

var BLUELINE = ["ASHBY STATION", "AVONDALE STATION", "DECATUR STATION", "EAST LAKE STATION", "EAST POINT STATION", "EDGEWOOD CANDLER PARK STATION", "FIVE POINTS STATION", "GEORGIA STATE STATION", "HAMILTON E HOLMES STATION", "INDIAN CREEK STATION", "INMAN PARK STATION", "KENSINGTON STATION", "KING MEMORIAL STATION", "OMNI DOME STATION", "VINE CITY STATION", "WEST LAKE STATION"];

var GREENLINE = ["ASHBY STATION", "BANKHEAD STATION", "EAST POINT STATION", "EDGEWOOD CANDLER PARK STATION", "FIVE POINTS STATION", "GEORGIA STATE STATION", "HAMILTON E HOLMES STATION", "INMAN PARK STATION", "KING MEMORIAL STATION", "OMNI DOME STATION", "VINE CITY STATION", "WEST LAKE STATION"];

var numResults = "";

// ******************** Beginning of Marta API Call (Testing) ********

// // Marta API key
// var martakey = "34127def-ccfe-4ed4-b0d4-2bfd7611807d";

// // Using Proxy because idk how CORS works
// var queryBase = "https://cors-anywhere.herokuapp.com/developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=" + martakey;

// // console log marta API address
// console.log("Marta API Address:");
// console.log(queryBase);

// // Call marta api for full data and pass marta data to marta query
// $.ajax({
//     url: queryBase,
//     method: "GET"
// }).done(function(martadata) {
// 	martaquery(martadata)
// });

// ********************* End of Marta API call ********************



// ********************* Firebase call ****************************
    var config = {
		apiKey: "AIzaSyChS-KWClciEknCOfjJKJ15ufrrZ847z9I",
		authDomain: "marta-hw.firebaseapp.com",
		databaseURL: "https://marta-hw.firebaseio.com",
		projectId: "marta-hw",
		storageBucket: "marta-hw.appspot.com",
		messagingSenderId: "235403493962"
    };
    firebase.initializeApp(config);
	var database = firebase.database();

database.ref().on("value", function(martadata) {
	$("#targetbody").html("");
	console.clear();
	console.log("Testing firebase call");

	var martadata = martadata.val().trains;

	martaquery(martadata);


// *********************** End of firebase call ********************



// ********************** Begin function martaquery **************************
function martaquery(martadata) {

	var martadata = martadata;
	console.log("Full Data (trains):");
	console.log(martadata);


	// Variable creation
	var trainNumber = [];
	var nextDestination = [];
	var finalDestination = [];
	var trainDirection =[];
	var arrivalTime = [];

	// locate all current train numbers
	for (var i = 0; i < martadata.length; i++) {
		trainNumber.push(martadata[i].TRAIN_ID);
		trainDirection.push(martadata[i].DIRECTION);
		finalDestination.push(martadata[i].DESTINATION);
	}
	
	// remove duplicate train numbers
	function onlyUnique(value, index, self) { 
   		return self.indexOf(value) === index;
	}
	
	var uniqueTrains = trainNumber.filter(onlyUnique);

	// associate a direction with all trains
	var uniqueDirection =[];
	for (var i = 0; i < uniqueTrains.length; i++) {

		function findDirection(martadata) { 
			return martadata.TRAIN_ID === uniqueTrains[i];
		}
		
		uniqueDirection.push((martadata.find(findDirection).DIRECTION));
	}

	// Associate a final destination with all trains
	var uniqueDestination =[];
	for (var i = 0; i < uniqueTrains.length; i++) {

		function findDestination(martadata) { 
			return martadata.TRAIN_ID === uniqueTrains[i];
		}
		
		uniqueDestination.push((martadata.find(findDestination).DESTINATION));
	}
	
	// locate the next station/time (API lists in chronological order so take first)
	for (var i = 0; i < uniqueTrains.length; i++) {
		if (uniqueTrains[i] === martadata[i].TRAIN_ID) {

			nextDestination.push(martadata[i].STATION);
			arrivalTime.push(martadata[i].NEXT_ARR);
		}
	
	}

	// log all unique values
	console.log("Unique Trains:");
	console.log(uniqueTrains);
	console.log("Corresponding Direction:");	
	console.log(uniqueDirection);
	console.log("Corresponding End Location:");
	console.log(uniqueDestination);
	// Create object child for each train
	var allTrains = {};
	allTrains["trainId"] = [];
	allTrains["trainDirection"] = [];
	allTrains["finalDestination"] = [];
	allTrains["nextDestination"] = [];
	allTrains["arrivalTime"] = [];
	for (var i = 0; i < uniqueTrains.length; i++) {
		
		allTrains.trainDirection.push(uniqueDirection[i]);
		allTrains.trainId.push(uniqueTrains[i]);
		allTrains.finalDestination.push(uniqueDestination[i]);
		allTrains.nextDestination.push(nextDestination[i]);
		allTrains.arrivalTime.push(arrivalTime[i]);
	}

	console.log(allTrains);
	
	for (var i = 0; i < uniqueTrains.length; i++) {
		
		$('#targetbody').append($('<tr>')	
    		.append($('<td>').append(i))
    		.append($('<td>').append(allTrains.trainId[i]))
    		.append($('<td>').append(allTrains.trainDirection[i]))
    		.append($('<td>').append(allTrains.nextDestination[i]))
    		.append($('<td>').append(allTrains.arrivalTime[i]))
    		.append($('<td>').append(allTrains.finalDestination[i]))
   		)
	}
}
// ********************** End function martaquery ***************************


// ********************** Begin station detail function *********************

// Click handeling - pulls selected station
$("#run-search").on("click", function(event) {
	event.preventDefault();
	var responseId = $("#num-records-select").children("option:selected").val();

	stationSearch(martadata, responseId)

});

// Clears recent search list
$("#clear-all").on("click", function(event) {
	event.preventDefault();
	$("#searchList").html("");
	$("#station-id").html("");
});


// stationSearch - identifies next inbound train to each station
function stationSearch(martadata, responseId) {

	$("#searchList").html("");
	$("#station-id").html("");

	var trainArray = [];
	var timeArray = [];
	var lineArray = [];
	var directionArray = [];
	var finalArray = [];

    for (var i = 0; i < martadata.length; i++) {

    	if (martadata[i].STATION === responseId) {
    		trainArray.push(martadata[i].TRAIN_ID);
    		timeArray.push(martadata[i].NEXT_ARR);
    		lineArray.push(martadata[i].LINE);
    		directionArray.push(martadata[i].DIRECTION);
    		finalArray.push(martadata[i].DESTINATION);
    	}
    }

    console.log("Next arrivals for " + responseId);
	
	// Create object to hold next train detail  
    var nextArrivals = {
	train: trainArray,
	time: timeArray,
	line: lineArray,
	direction: directionArray,
	final: finalArray
	}

	console.log(nextArrivals);

	$("#station-id").append("Upcoming trains for " + responseId);

	for (var i = 0; i < trainArray.length; i++) {
	
		$('#searchList').append($('<tr>')	
			.append($('<td>').append(nextArrivals.train[i]))
			.append($('<td>').append(nextArrivals.line[i]))
			.append($('<td>').append(nextArrivals.direction[i]))
			.append($('<td>').append(nextArrivals.time[i]))
			.append($('<td>').append(nextArrivals.final[i]))

			)
		}
	}

// ********************** END OF SEARCH FUNCTION ********************

}); //End of firebase call


