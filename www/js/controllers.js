angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('mapsCtrl', function($scope, $state, $cordovaGeolocation,Establecimientos,$ionicPlatform,$ionicLoading) {
  

   function CenterControl(controlDiv, map) {
        var controlUI = document.createElement('div');

        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.style.margin = '10px';
        //controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '20px';
        controlText.style.padding = '5px';
        controlText.innerHTML = '<i class="icon ion-android-locate"></i>';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
         controlUI.addEventListener('click', function() {
            
            

               $ionicPlatform.ready(function() {

                  if (window.cordova) {

                     cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
                        // Localizacion habilitada
                        if (enabled) {

                          miPosicion();
                           
                        }else{
                          alert("Localozacion Inhabilitada, por favor activala");
                          cordova.plugins.diagnostic.switchToLocationSettings(); //Control de la localizacion
                          miPosicion();
                        } 

                     }, function(error) {
                        alert("The following error occurred: " + error);
                     });
                  } 
                  
               });
            


         });
   }  


   $scope.initialize = function() {
      miPosicion();
      marcadoresEstablecimientos();
      
      var options = {timeout: 10000, enableHighAccuracy: true};
      
      var latLngColombia = new google.maps.LatLng(4.710989,-74.072092);

   
      var mapOptions = {
         center: new google.maps.LatLng(localStorage.getItem("myLatitude"), localStorage.getItem("myLongitude")),
         zoom: 14,
         disableDefaultUI: true,
         scaleControl: true,
         streetViewControl: true,
         zoomControl: true,
         mapTypeId: google.maps.MapTypeId.ROADMAP
       };
 
      $scope.map = new google.maps.Map(document.getElementById("map-todos"), mapOptions);
      var centerControlDiv = document.createElement('div');
      var centerControl = new CenterControl(centerControlDiv, $scope.map);

      centerControlDiv.index = 1;
      $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv);
    
   }

   //Si no se ha guardado ninguna localizacion   
   $ionicPlatform.ready(function() {

      if (window.cordova) {

         cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
            // Localizacion habilitada
            if (enabled) { 
               miPosicion();
            }else{
              alert("Localozacion Inhabilitada, por favor activala");
              cordova.plugins.diagnostic.switchToLocationSettings(); //Control de la localizacion
              miPosicion();
            } 

         }, function(error) {
            alert("The following error occurred: " + error);
         });
      } 
      
   });
   
   function marcadoresEstablecimientos(){
      $scope.markers = [];

      var createMarker = function (info){
         
         var path="/www/img/";
         
         var marker = new google.maps.Marker({
             position: new google.maps.LatLng(info.latitude, info.longitude),
             map: $scope.map,
             //animation: google.maps.Animation.DROP,
             title: info.establecimiento
            // icon:"./img/marcadores/"+info.categoria.toLowerCase()+".png"
             //icon: path+info.categoria+".png"
         });
         
         marker.content = '<div class="infoWindowContent">' + info.nombre + '</div>';
         google.maps.event.addListener(marker, 'click', function(){
             window.location="#/detalle/"+info.id;
         });
         
         $scope.markers.push(marker);
      }  

      var ciudadUsuario = localStorage.getItem("ciudadUsuario");
      Establecimientos.getEstablecimientos().success(function(data){
         
         establecimientos = data ;

         
         for (i = 0; i < establecimientos.length; i++){
            createMarker(establecimientos[i]);
         }

      });

   }

   //Si ya estan guardadas las variables de sesión 


   function miPosicion(){

         navigator.geolocation.getCurrentPosition(function(pos) {
         
         myLatitude=pos.coords.latitude;
         myLongitude=pos.coords.longitude;

         localStorage.setItem('myLatitude',myLatitude);
         localStorage.setItem('myLongitude',myLongitude);


         $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

         var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: $scope.map,
                title: "My Location"
         });

         var geocoder = new google.maps.Geocoder();
         var latlng = new google.maps.LatLng(myLatitude, myLongitude);

         geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            var result = results[0];
            var state = '';

            for (var i = 0, len = result.address_components.length; i < len; i++) {
               var ac = result.address_components[i];
                  if (ac.types.indexOf('administrative_area_level_2') >= 0) {
                     state = ac.short_name;
                  }
            }

            localStorage.setItem("ciudadUsuario",state);
            console.log(state);
             //$('#yourInputBox').val(state);
         });

      });

   
   }
})


.controller('mapsCtrlDetalle', function($scope, $ionicLoading,$ionicPlatform,Establecimientos) {
   

   $scope.initialize = function(lat,long,categoria) {
    
    console.log(lat,long);

    if (!localStorage.getItem("myLatitude")) {

      $ionicPlatform.ready(function() {


         if (window.cordova) {

            cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
               // Localizacion habilitada
               if (enabled) {
                  miPosicion();
               }else{
                  alert("Localozacion Inhabilitada, por favor activala");
                  cordova.plugins.diagnostic.switchToLocationSettings(); //Control de la localizacion
                  miPosicion();
               } 

            }, function(error) {
               alert("The following error occurred: " + error);
            });
         } 
         
      });  

    }

    function miPosicion(){
        navigator.geolocation.getCurrentPosition(function(pos) {
      
        myLatitude=pos.coords.latitude;
        myLongitude=pos.coords.longitude;
        localStorage.setItem("myLatitude",myLatitude);
        localStorage.setItem("myLongitude",myLongitude);
        
        map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        
        var myLocation = new google.maps.Marker({
            position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
            map: map,
            title: "Tu estas aqui :)"
        });

      });
    }

     var directionsDisplay = new google.maps.DirectionsRenderer;
     var directionsService = new google.maps.DirectionsService;
   
     var myLatlng = new google.maps.LatLng(lat,long);  

     var map = new google.maps.Map(document.getElementById('map'), {
         center: myLatlng,
         zoom: 16,
         disableDefaultUI: true,
         scaleControl: true,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: true,
         zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_CENTER
          },
          scaleControl: true,
          streetViewControl: true,
          streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_CENTER
          }
     });
     
     directionsDisplay.setMap(map);
     directionsDisplay.setOptions( { suppressMarkers: true } );

     calculateAndDisplayRoute(directionsService, directionsDisplay);
     
     document.getElementById('mode').addEventListener('change', function() {
       calculateAndDisplayRoute(directionsService, directionsDisplay);
     });

        //Marcador de nuestra ubicacion 
        var myLocation = new google.maps.Marker({
             position: new google.maps.LatLng(localStorage.getItem("myLatitude"), localStorage.getItem("myLongitude")),
             map: map,
             title: "My Location"
        });

       //Marcador de destino  
       var marker = new google.maps.Marker({
         position: myLatlng,
         map: map,
         title: 'Uluru (Ayers Rock)'
         //icon:"./img/marcadores/"+categoria.toLowerCase()+".png"
       });

     google.maps.event.addListener(marker, 'click', function() {
       infowindow.open(map,marker);
     });

    var directionsDisplay = new google.maps.DirectionsRenderer;

    

   
    function calculateAndDisplayRoute(directionsService, directionsDisplay) {
      var selectedMode = document.getElementById('mode').value;
      directionsService.route({
        origin: new google.maps.LatLng(localStorage.getItem("myLatitude"), localStorage.getItem("myLongitude")),
        destination: myLatlng,
        travelMode: google.maps.TravelMode[selectedMode]
      }, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          //window.alert('Directions request failed due to ' + status);
          if (status=="ZERO_RESULTS") {
            alert("No hay rutas para este establecimiento")
          }
        }
      });
    }

    $scope.map = map;
  }
  //google.maps.event.addDomListener(window, 'load', initialize);

})


.controller('busquedaTodosCtrl',function($scope,Establecimientos){
    
    $scope.establecimientos = [];
    
    Establecimientos.getEstablecimientos().success(function(data){
      
      $scope.establecimientos=data;
      
      $scope.listaOrdenada = [];

      var lastChar = '';

      for(var i=0,len=$scope.establecimientos.length; i<len; i++) {
        var item = $scope.establecimientos[i];

        if(item.name.charAt(0) != lastChar) {
          $scope.listaOrdenada.push({name:item.name.charAt(0),letter:true});
          lastChar = item.name.charAt(0);
        }
        $scope.listaOrdenada.push(item);
        

      }  

    });

    document.getElementsByClassName("item-divider").style='color:red';



      

})

.controller('detalleCtrl', function($scope, $stateParams, Establecimientos,$http) {
  
  $scope.establecimiento = Establecimientos.get($stateParams.id);

  $scope.latitude = $scope.establecimiento.latitude;
  $scope.longitude = $scope.establecimiento.longitude;

})

.controller('detalleCategoriasCtrl', function($scope, $stateParams, Establecimientos) {
  
  $scope.establecimientos = Establecimientos.filtroCategoria($stateParams.categoria);

});







