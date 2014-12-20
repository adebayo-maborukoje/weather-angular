var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', function($scope, weatherAppFactory, googleMapDisplay){  
    var app = $scope;
    app.results= [];
    app.userSearch = "";

    app.displayResult = function(){
      if(app.userSearch === ""){
         app.results= [];
        app.mapStatus = false;
        app.statusDisplay = "PLEASE ENTER A NAME OF CITY OR STATE";
      } 
      else {
        weatherAppFactory.getUrl(app.userSearch).
        success( function (data, status) {
          if (data.cod === 200){
            app.results = [];
            app.statusDisplay = "Displaying Result for ";
            app.mapStatus = true;
            
               // method 1  //

            var temp = parseInt(data.main.temp, 10);
                temp = Math.round(temp-273.15);
           //     results.main.temp = temp;
                app.results.push(data);
                app.results.main.temp.push(temp);
         
              // End of method 1 //

              // Method 2  for changing the temperature value//
            app.$watch('results.main.temp', function (newValue, oldValue){
              if(newValue){
                var temp = parseInt(newValue, 10);
                temp = Math.round(temp-273.15);
              results.main.temp = temp;
              }
            });
                //End of Method 2 //

            googleMapDisplay.getMap(data.coord.lat, data.coord.lon);
          }else{
            //this is the error report generated when the query returns no value
            console.log(data.cod);
            app.mapStatus = false;
            app.statusDisplay = data.message;

            app.results= [];
          }
        }) //end of the success promise
        .error( function (data, status) {
            //console log the error for not internet connection here
          app.mapStatus = false;
          app.results = [];   
          app.statusDisplay = " Cannot Connect to the Server, Check your Internet Connection and try again " ;

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

/* Method 3 for changing the temperature  */
weatherApp.factory('tempCvtFactory', function(){
    var tempConverter = {};
    tempConverter.convert = function(tempInKelvin){
        console.log(tempInKelvin);

        var temp = parseInt(tempInKelvin, 10);
        temp = Math.round(tempInKelvin - 273.15);
        console.log(temp);
        return temp;
    };
    return tempConverter;
});
 /* End of  Method 3*/

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