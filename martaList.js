// These variables will hold the results we get from the user's inputs via HTML
var searchTerm = "";
var numResults = "";
var startYear = 0;
var endYear = 0;

const proxyurl = "https://cors-anywhere.herokuapp.com/";

var queryURLBase = "http://developer.itsmarta.com/RealtimeTrain/RestServiceNextTrain/GetRealtimeArrivals?apikey=dbfb261c-c806-45fb-88b1-25755e6de05e";


var weatherDesc = "";
var picImg = "";
var picImgUrl = "";
var atlTemp = "";
var atlHumidity = "";

//Weather section:
$.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?q=Atlanta&appid=142f7568e1fde63858ead859d2bd2260&units=imperial",
    method: "GET"
}).done(function(weatherData) {
    weatherDesc = weatherData.weather[0].description;
    picImg = weatherData.weather[0].icon;
    picImgUrl = "https://openweathermap.org/img/w/" + picImg + ".png";
    //picImgUrl = "https://openweathermap.org/img/w/11d.png"; 
    atlTemp = weatherData.main.temp;
    atlHumidity = weatherData.main.humidity;

    //console.log(weatherDesc);
    console.log(weatherDesc + " " + picImg + " " + atlTemp);
    console.log(picImgUrl);

    $("#atlimg").attr("src", picImgUrl);

    $("#atlweather").append("<br><br> The weather today in Atlanta is :  " + weatherDesc);
    $("#atlweather").append("<br> Temperature is :  " + atlTemp + " deg F");
    $("#atlweather").append("<br> Humidity is :  " + atlHumidity + "%");
    //$("#atlweather").append("<br><br> Picture Image:  " + picImg);
    $("#atlweather").append("<br><br> Picture Image URL :  " + picImgUrl);


});


function runQuery(chosenStation, queryURLBase) {

    // The AJAX function uses the queryURL and GETS the JSON data associated with it.
    // The data then gets stored in the variable called martadata

    $.ajax({
            url: proxyurl + queryURLBase,
            method: "GET"
        })

        .done(function(response) {
            //form input variables 
            var martadata = response;


            // Logging the URL so we have access to it for troubleshooting
            console.log("------------------------------------");
            console.log("Full Data:");
            console.log(martadata);
            console.log("------------------------------------");


            var trainNumber = [];
            var trainDirection = [];
            var currentStation = [];
            var nextArrival = [];
            var trainLine = [];

            // parse JSON and Display in TABLE
            for (var i = 0; i < martadata.length; i++) {


                //console.log(numResults + "==" + martadata[i].STATION);

                if (martadata[i].STATION == numResults || numResults == "ALL") {

                    /*
                                        //trainNumber.push(martadata[i].TRAIN_ID);
                                        console.log(martadata[i].TRAIN_ID);
                                        //trainDirection.push(martadata[i].DIRECTION);
                                        console.log(martadata[i].DIRECTION);
                                        //finalDestination.push(martadata[i].DESTINATION);
                                        console.log(martadata[i].DESTINATION);
                                        //nextArrival.push(martadata[i].NEXT_ARR);
                                        console.log(martadata[i].NEXT_ARR);
                                        //trainLine.push(martadata[i].LINE);
                                        console.log(martadata[i].LINE);
                    */


                    $('#targetbody').append($('<tr>')
                        .append($('<td>').append(i))
                        .append($('<td>').append(martadata[i].TRAIN_ID))
                        .append($('<td>').append(martadata[i].DIRECTION))
                        .append($('<td>').append(martadata[i].STATION))
                        .append($('<td>').append(martadata[i].NEXT_ARR))
                        .append($('<td>').append(martadata[i].LINE))

                    ) // <tr>


                } // IF Station === 

            }

            //console.log(allTrains);

            //  .fail(function() {
            //  alert( "Error with MARTA Ajax Call, please check your URL string" );

        }); // ; for .done & .fail




}



// METHODS
// ==========================================================

// on.("click") function associated with the Search Button
$("#run-search").on("click", function(event) {

    event.preventDefault();

    var searchURL = queryURLBase;

    // this is the Name
    searchTerm = document.getElementById("search-term").value.trim();
    //searchTerm = $("#search-term").val().trim();
    console.log(searchTerm);

    // this is the Station
    numResults = $("#num-records-select").val();


    //$('#targetname' ).append(",   " + searchTerm) ; 
    $("#targetname").append(", " + searchTerm);
    //$("h5").append(",   " + searchTerm) ; 
    $("#targetname").append("<br><br> Please press Clear Results to refresh your Search.");

    // Display Modal + regex validation
    allLetter(searchTerm);

    // Populate Station Table
    //runQuery(numResults, queryURLBase);

});

// This button clears the Table
$("#clear-all").on("click", function() {

    $("#well-section").empty();
    location.reload();
});

function allLetter(inputTxt) {


    // regex validation
    if (inputTxt.search(/[^a-zA-Z]+/) === -1) {
        runQuery(numResults, queryURLBase);
        return true;

    } else {
        // Display Modal
        document.getElementById("myDialog").showModal();
        return false;
    }


}