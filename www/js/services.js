// Servicios
angular.module('starter.services', [])

.factory('Establecimientos', function($http) { 

    var establecimientos = [];

    return{
      
    getEstablecimientos : function() {  
    
      $http.get("wwww.cofinauto.com/Accessapp/Backend/src/WebServices/getAllEstablishment.php").then(function(response){
        establecimientos = response.data;
      });

      
    },

    get: function(id) {
      for (var i = 0; i < establecimientos.length; i++) {
        if (establecimientos[i].id === id) {
          return establecimientos[i];
        }
      }
      return null;
    },

    filtroCategoria: function(_categoria) {
      
      establecimientoscategoria = [];
      
      console.log(establecimientos.length);

       for (var i = 0; i < establecimientos.length; i++) {
        if (establecimientos[i].idCategory == _categoria) {
          //establecimientoscategoria.push(establecimientos[i]);
          establecimientoscategoria.push(establecimientos[i]);
        }
      }
      console.log(establecimientoscategoria);
      //establecimientoscategoria.push(establecimientos);
      return establecimientoscategoria; 
    },
    

    getEstablecimientos : function(nombreCiudad) {
        establecimientos = $http({
            method : 'POST',
            url : 'http://cofinauto.com/Accessapp/Backend/src/WebServices/getAllEstablishment.php'
        });
         

        $http.post('http://cofinauto.com/Accessapp/Backend/src/WebServices/getAllEstablishment.php').then(function (response) {
          establecimientos = response.data;
          console.log(response.data);
        }, function () {
           // body...
        });


        return establecimientos;        
    }

  } 
});

