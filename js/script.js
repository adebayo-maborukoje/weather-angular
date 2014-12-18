var weatherApp = angular.module('weatherApp', []);

//weatherApp.controller('weatherController', function($scope, weatherAppFactory){
weatherApp.controller('weatherController', function($scope, weatherAppFactory, googleMapDisplay){  
    $scope.results= [];
    $scope.mapCanvas = [];
    //$scope.user.search = "";
    //$scope.mapCanvas = " "; check this out 
    $scope.displayResult = function(){
     // $scope.user.search = "";
      if($scope.user.search === ""){
        $scope.results= [];
        $scope.mapCanvas = [];
        $scope.statusDisplay = "PLEASE ENTER A NAME OF CITY OR STATE";
      } else {
        weatherAppFactory.getUrl($scope.user.search).
        success( function (data, status) {
          if (data.cod === 200){
            $scope.results = [];
            $scope.mapCanvas = [];
            $scope.statusDisplay = "Displaying Result for ";
            $scope.results.push(data);

            googleMapDisplay.getMap(data.coord.lat, data.coord.lon);
          }else{
            //this is the error report generated when the query returns no value
            console.log(status);
            $scope.mapCanvas = [];
            $scope.statusDisplay = "No Result Found";
            $scope.results= [];
          }
        }) //end of the success promise
        .error( function (data, status) {
            //console log the error for not internet connection here
          $scope.results = [];
          $scope.mapCanvas =[];
          $scope.statusDisplay = " Cannot Connect to the Server, Check your Internet Connection and try again " ;

        });//end of the error  promise
      } // end of else statement when query is not empty
      
    } // end of displayResult function
      
/*
 do the animation for the searching bar and css styling  learn about ngAnimate
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























// var weatherAPI = {
//   address: $('#search'),
//   init: function (){
//           $('form').submit(function (e) {
//             e.preventDefault();
//             if(weatherAPI.address.val() === "" ){
//                weatherAPI.errorMsg();
//             }
//             else { 
//             $('#submit').prop('disabled', true);
//             $('#submit').val(" ").css('background', 'url("./images/loading2.gif") no-repeat white center'); 
//              var url ="http://api.openweathermap.org/data/2.5/weather?";
//              var requestParameters = {
//                q : weatherAPI.address.val()
//              };
//                 $.ajax(url, {
//                     success: weatherAPI.response,
//                     type: "get",
//                     data: requestParameters,
//                     error: weatherAPI.errorfile 
//                    });  
//           } //end of else statement      
//         }); //end of the click function
//   }, // end of the init method 
//   response : function (user) {
//             // var list.main= ;
//             if(user.cod !== 200) {
//               $('#mapCanvas').html('');
//               weatherAPI.errorMsg();
//               weatherAPI.btnEffect();
//             } 
//             else {
//             var displayResult ='<table class="resultPane">';
//             var temp = parseInt(user.main.temp, 10);
//             temp = Math.round(temp-273.15);
//               if( temp <= 6) {
//                  displayResult += '<tr class="cloudy"><td colspan=2>' + user.name +'</td></tr>';
//               }
//               else if (temp >= 7 && temp <= 19){ 
//                   displayResult += '<tr class="sunny"><td colspan=2>' + user.name +'</td></tr>';
//               }
//               else if(temp >= 20) {
//                  displayResult += '<tr class="sun"><td colspan=2>' + user.name +'</td></tr>';
//               }  
//                 displayResult += '<tr><td> Country: </td><td>' + user.sys.country +'</td></tr>';
//                 displayResult += '<tr><td> Latitude: </td><td>' + user.coord.lon +'</td></tr>';
//                 displayResult += '<tr><td> longitude: </td><td>' + user.coord.lat +'</td></tr>';
//                 $.each (user.weather, function(i, list){
//                   displayResult += '<tr><td> Weather: </td><td>' + list.main+'</td></tr>';
//                     // return list.main;
//                 });
              
//                 var lngCoord = +user.coord.lon.toFixed(3);  
//                 var latCoord = +user.coord.lat.toFixed(3);
//                 console.log(temp);
//                 if(temp <=15){  
//                    displayResult += '<tr class="cold"><td> Current Temp: </td><td>' + temp +'&#x2103; </td></tr>';
//                 }else if(temp){
//                    displayResult += '<tr class="hot"><td> Current Temp: </td><td>' + temp +'&#x2103; </td></tr>';
//                 }
//                 displayResult += '</table>';
//                 weatherAPI.mapDisplay(latCoord, lngCoord);
//                 $('#resultDiv2').html(displayResult);
//                 weatherAPI.btnEffect();
//       };
//   }, // end of the response method
//   errorfile : function(){
//               var displayResult ='<div class="error"> Your Request Cannot Be Processed at The Moment </div>';
//                 $('#resultDiv2').html(displayResult); 
//                 weatherAPI.btnEffect();                   
//   },
//   errorMsg: function (){
//                 var displayResult ='<div class="error"> NO RESULT FOUND FOR THE SEARCHED PLACE PLEASE ENTER A VALID CITY, STATE OR COUNTRY </div>';
//                   $('#resultDiv2').html(displayResult);
//                   weatherAPI.btnEffect();
//   },
//   mapDisplay: function(latitude, longitude) {
//                 // console.log(longitude +" and "+ latitude);
//                 var mapOptions = {    
//                       center: {
//                         lat: latitude, 
//                         lng: longitude
//                         },
//                         zoom: 7
//                       };
//       var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
//   }, 
//   btnEffect : function() {
//                 $('#submit').prop('disabled', false);
//                 $('#submit').val("Forecast").css('background-image', 'none');
//   }    
// }; // end of the  weatherAPI object 
// weatherAPI.init();