function getResponse(station) {
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
    console.log(martadata.val().trains);
    console.clear();
    var martadata = martadata.val().trains;
    stationSearch(martadata, station);
    firebase.database().goOffline()// Kill this firebase app.
    firebase.app().delete().then(function() {
  });

// *********************** End of firebase call ********************

});
}

// stationSearch - identifies next inbound train to each station
function stationSearch(martadata, responseId) {


  $("#searchList").html("");
  $("#station-id").html("");

  var trainArray = [];
  var timeArray = [];
  var stationArray = [];
  var lineArray = [];
  var directionArray = [];
  var finalArray = [];

    for (var i = 0; i < martadata.length; i++) {

      if (martadata[i].STATION === responseId) {
        trainArray.push(martadata[i].TRAIN_ID);
        timeArray.push(martadata[i].NEXT_ARR);
        stationArray.push(martadata[i].STATION);
        lineArray.push(martadata[i].LINE);
        directionArray.push(martadata[i].DIRECTION);
        finalArray.push(martadata[i].DESTINATION);
      }

    }

  // Create object to hold next train detail  
  var nextArrivals = {
  train: trainArray,
  time: timeArray,
  station: stationArray,
  line: lineArray,
  direction: directionArray,
  final: finalArray
  }
  localStorage.setItem("arrivals", JSON.stringify(nextArrivals));
  drawTrainRoute(nextArrivals)
}

function drawTrainRoute(trains) {
  for (i = 0; i < trains.train.length; i++) {
    var direction = "";
    var destination = "";
    var line = "";
    var station = "";
    var nextArrival = "";
    var train = "";
    destination = trains.final[i];
    direction = trains.direction[i];
    line = trains.line[i];
    nextArrival = trains.time[i];
    station = trains.station[i];
    train = trains.train[i];
    if ((line == 'RED') && (direction == 'S')) {
      buildTrainUL('#redTrain li', '#DC143C', 'RED', 'redTrain', station, train)
    } else if ((line == 'RED') && (direction == 'N')) {
      buildTrainUL('#redTrainRev li', '#B0171F', 'RED', 'redTrainRev', station, train);
    } else if ((line == 'BLUE') && (direction == 'E')) {
      buildTrainUL('#blueTrain li', '#0000FF', 'BLUE', 'blueTrain', station, train)
    } else if ((line == 'BLUE') && (direction == 'W')) {
      buildTrainUL('#blueTrainRev li', '#4F94CD', 'BLUE', 'blueTrainRev', station, train);
    } else if ((line == 'GOLD') && (direction == 'S')) {
      buildTrainUL('#goldTrain li', '#CDAD00', 'GOLD', 'goldTrain', station, train)
    } else if ((line == 'GOLD') && (direction == 'N')) {
      buildTrainUL('#goldTrainRev li', '#B8860B', 'GOLD', 'goldTrainRev', station, train);
    } else if ((line == 'GREEN') && (direction == 'E')) {
      buildTrainUL('#greenTrain li', '#00CD00', 'GREEN', 'greenTrain', station, train)
    } else if ((line == 'GREEN') && (direction == 'W')) {
      buildTrainUL('#greenTrainRev li', '#008B00', 'GREEN', 'greenTrainRev', station, train);
    }
  }
  reDrawMaps();
}

function buildTrainUL(div, color, elClass, id, station, trainID) {
  var trainLine = $(div);
  var trainRoute = $('<ul data-trainID="'+trainID+'"data-color="'+color+'" id="'+id+'" class="'+elClass+'" data-label="Train#"></ul>').appendTo('#trainRoutes');
  for (x = 0; x < trainLine.length; x++) {
    if (trainLine[x].attributes.length > 2) {
      if (trainLine[x].attributes[2].nodeValue == station){
        trainLine.length=(x+1);
        trainLine.each(function(index, value){
          if(index + 1 === trainLine.length){ //last element
            $(value).attr('data-marker', '@interchange');
          }
          $(value).clone(true).appendTo(trainRoute);
        });
      }
    }  
  }  
}

function reDrawMaps() {
  $('#subwaymap .canvas').remove();
  $('#legend').empty();
  $('#subwaymapinvisible').subwayMap({ debug: false });
  $('.trainRoutes').subwayMap({ debug: false });
  $('.trainRoutes').css("display","block");
  var element = $('#subwaymap');
  moveToastLinks(element);
  //setCanvasEvent();
  captureEvents();
}

function getUserClick(e) {
  var x = e.clientX
    , y = e.clientY
  //...
  var stations = JSON.parse(localStorage.getItem("stations"));      

      for (z = 0; z < stations.length; z++) {
          var isClicked = isInCircle(stations[z][0], stations[z][1], stations[z][2], x, y);
          if (isClicked == true) {
              var station = stations[z][3];
              z=999;
              $('.trainRoutes').empty();
              getResponse(station);
              localStorage.clear();
          }
      }
}
function setCanvasEvent() {
  $('.canvas').off('click');
  $('.canvas').on('click', function(e) {
    getUserClick(e);                 
  });
}

function captureEvents() {
  $(".subwaymap").subwayMap({ debug: false });
  $('.canvas').off('click touchstart');
  $('.canvas').on('click touchstart', function(e) {
     $('#toast').css('left',e.pageX + 'px' );
     $('#toast').css('top',e.pageY + 'px' );
    var x = e.clientX
    , y = e.clientY
    //...
    var stations = JSON.parse(localStorage.getItem("stations"));
        for (z = 0; z < stations.length; z++) {
          if (e.type  == 'touchstart') {
            var isClicked = isInCircle(stations[z][0], stations[z][1], stations[z][2], (x+10), (y+10));
          } else {
            var isClicked = isInCircle(stations[z][0], stations[z][1], stations[z][2], x, y);
          }
          if (isClicked == true) {
            var tempString = stations[z][3].toProperCase();
            tempString = tempString.substring(0, tempString.lastIndexOf(" "));
            toast('#'+tempString.replace(/\s/g,''), e);
          }
        }                     
    });
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function moveToastLinks(element) {
  $('#toast').empty();
  $(element.selector + ' a').each(function(value, index) {
    $(this).removeAttr("style")
    console.log(this);
    $(this).appendTo('#toast');
  });   
}

function toast(test, e) {
    $('.text').css('opacity', 0);
    $('.text').css('display', 'none');
    $('#toast').css('visibility', 'visible');
    $(test).css('opacity', 1);
    $(test).css('display', 'block');
    $(test).css('z-index', 999999999);
    $(test).click( function(e) {
      $('#trainRoutes').empty();
      $(test).css('opacity', 0);
      $(test).css('display', 'none');
      $('#toast').css('visibility', 'hidden');
      e.preventDefault(); 
      e.stopImmediatePropagation();
      getResponse($(test).text().toUpperCase() + ' STATION');
      localStorage.clear();
      $('.canvas').off('click mousemove touchstart');
      return false; 
    } );        
    
    var x = document.getElementById('toast');
    x.className = "show";
    if (e.type  == 'touchstart') {
      setTimeout(function(){ 
      $('.text').css('opacity', 0);
      $('.text').css('display', 'none');
      x.className = x.className.replace("show", ""); 
    }, 5000);
    } else {
      setTimeout(function(){ 
        $('.text').css('opacity', 0);
        $('.text').css('display', 'none');
        x.className = x.className.replace("show", ""); 
      }, 10000);  
    } 
}