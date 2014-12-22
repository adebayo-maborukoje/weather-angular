var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', function($scope, tempConverter, weatherAppFactory,btnEffect, googleMapDisplay){  
    var app = $scope;
    app.results= [];
    app.userSearch = "";

    app.displayResult = function(){
      if(app.userSearch === ""){
        btnEffect.getStatus(true);
        app.results= [];
        app.mapStatus = false;
        app.statusDisplay = "PLEASE ENTER A NAME OF CITY OR STATE";
        btnEffect.getStatus(false);
      } 
      else {
        btnEffect.getStatus(true);
        weatherAppFactory.getUrl(app.userSearch).
        success( function (data, status) {

          if (data.cod === 200){
            app.results = [];
            app.statusDisplay = "Displaying Result for ";
            app.mapStatus = true;
            app.results.push(data);
            var tempInCelcius = tempConverter.convertTemp(data.main.temp);
            console.log("my "+ tempInCelcius);
            data.main.temp = tempInCelcius;
            googleMapDisplay.getMap(data.coord.lat, data.coord.lon);
          }
          else{
            //this is the error report generated when the query returns no value
            console.log(data.cod);
            app.mapStatus = false;
            app.statusDisplay = data.message;

            app.results= [];
          }
          btnEffect.getStatus(false);
        }) //end of the success promise
        .error(function (data, status) {
            //console log the error for non 200 reports internet connection here
          app.mapStatus = false;
          app.results = [];   
          app.statusDisplay = " Cannot Connect to the Server, Check your Internet Connection and try again " ;
          btnEffect.getStatus(false);
        });
      } 
    }; 
}); 

weatherApp.factory( 'tempConverter', function(){
  var tempObj = {};
  tempObj.convertTemp = function (temp){
    var currentTemp = parseInt(temp, 10);
        currentTemp = Math.floor(currentTemp-273.15);
        console.log(currentTemp);
        return currentTemp;
       } 
return tempObj;
});

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

weatherApp.factory ('btnEffect', function () {
  return {
    getStatus : function (BtnStatus) { 
      if(BtnStatus){
        $('#submit').prop('disabled', true);
        $('#submit').val(" ").css('background', 'url("./images/loading2.gif") no-repeat white center');
      }
      else {
        $('#submit').prop('disabled', false);
        $('#submit').val("Forecast").css('background-image', 'none');
      }
      return;
    }
  };
});
//write a service for the images that are displayed in respect to the temp