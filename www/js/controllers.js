angular.module('starter.controllers', ['ionic','ngCordova'])

.controller('mapsCtrl', function($scope, $state, $cordovaGeolocation, Establecimientos) {

    
    var options = {timeout: 10000, enableHighAccuracy: true};
    
    // Inicializar mapa por defecto
  
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12,
      center: {lat: 4.710989, lng: -74.072092},
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
          position: google.maps.ControlPosition.RIGHT_CENTER
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
          position: google.maps.ControlPosition.LEFT_TOP
      }
    });

    // Obtener posicion
    $cordovaGeolocation.getCurrentPosition(options).then(function(position){
 
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
   
    var mapOptions = {
        center: latLng,
        zoom: 14,
        //mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: true,
        streetViewControl: true,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP
        }

    };

    
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
        var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            position: latLng
        });      
         
        var infoWindow = new google.maps.InfoWindow({
            content: "Esta aqui!"
        });
         
        google.maps.event.addListener(marker, 'click', function () {
              infoWindow.open($scope.map, marker);
        });
     
    }); 
   
    }, function(error){

      console.log("Could not get location");
    });


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







