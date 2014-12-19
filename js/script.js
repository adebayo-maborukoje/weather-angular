var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', function($scope, weatherAppFactory, googleMapDisplay){  
    var user = $scope;
    user.results= [];
    user.userSearch = "";

    user.displayResult = function(){
      if(user.userSearch === ""){
        // console.log('got here');
        user.results= [];
        user.mapStatus = false;
        user.statusDisplay = "PLEASE ENTER A NAME OF CITY OR STATE";
      } 
      else {
        weatherAppFactory.getUrl(user.userSearch).
        success( function (data, status) {
          if (data.cod === 200){
            user.results = [];
            user.statusDisplay = "Displaying Result for ";
            user.mapStatus = true;
            user.results.push(data);

            googleMapDisplay.getMap(data.coord.lat, data.coord.lon);
          }else{
            //this is the error report generated when the query returns no value
            console.log(data.cod);
            user.mapStatus = false;
            user.statusDisplay = data.message;

            user.results= [];
          }
        }) //end of the success promise
        .error( function (data, status) {
            //console log the error for not internet connection here
          user.mapStatus = false;
          user.results = [];   
          user.statusDisplay = " Cannot Connect to the Server, Check your Internet Connection and try again " ;

        });//end of the error  promise
      } // end of else statement when query is not empty
      
    } // end of displayResult function
      
/*
 do the animation for the searching bar and css styling  learn about ngAnimate
 btnEffect : function() {
//                 $('#submit').prop('disabled', false);
//                 $('#submit').val("Forecast").css('background-image', 'none');
*/
}); // end of controller

weatherApp.factory('weatherAppFactory', ['$http',  function($http) {
     var requestParameters = {};
    var url ="http://api.openweathermap.org/data/2.5/weather?";
   
    requestParameters.getUrl = function(query) {
      
      return $http.get(url, { params: { q : query } } );
    };
  return requestParameters;
}]); //end of weatherAppFactory 

weatherApp.factory ('googleMapDisplay', function () {
  var mapObj ={};

  mapObj.getMap = function(latitude, longitude) {
                // console.log(longitude +" and "+ latitude);
                var mapOptions = {    
                      center: {
                        lat: latitude, 
                        lng: longitude
                        },
                        zoom: 7
                      };
      var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
      };
     return mapObj;
}); //end of googleMapDisplay factory

//



