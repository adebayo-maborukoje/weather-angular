var weatherApp = angular.module('weatherApp', []);

weatherApp.controller('weatherController', function($scope, weatherAppFactory,btnEffect, googleMapDisplay){  
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
               // method 1  //

            var temp = parseInt(data.main.temp, 10);
                temp = Math.round(temp-273.15);
               results.main.temp = temp; 
           // confirm if the  =  or the push works
                
            //    app.results.main.temp.push(temp);
         
              // End of method 1 //

              // Method 2  for changing the temperature value//
      /*      app.$watch('results.main.temp', function (newValue, oldValue){
              if(newValue){
                var temp = parseInt(newValue, 10);
                temp = Math.round(temp-273.15);
              results.main.temp = temp;
              }
            }); */
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
            //console log the error for non 200 reports internet connection here
          app.mapStatus = false;
          app.results = [];   
          app.statusDisplay = " Cannot Connect to the Server, Check your Internet Connection and try again " ;

        });
        btnEffect.getStatus(false);
      } 
    }; 
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
            center: { lat: latitude, 
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