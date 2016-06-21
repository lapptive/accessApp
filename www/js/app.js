// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
   $ionicConfigProvider.tabs.position('bottom'); 

   $ionicConfigProvider.platform.android.tabs.style('standard'); 

   $ionicConfigProvider.platform.android.tabs.style('standard'); 

   

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.encuentra', {
    url: '/encuentra',
    views: {
      'tab-encuentra': {
        templateUrl: 'templates/tab-encuentra.html',
        controller: 'busquedaTodosCtrl'
      }
    }
  })

  .state('tab.explora', {
      url: '/explora',
      views: {
        'tab-explora': {
          templateUrl: 'templates/tab-explora.html',
          controller: 'mapsCtrl'
        }
      }
    })

  .state('tab.acerca', {
    url: '/acerca',
    views: {
      'tab-acerca': {
        templateUrl: 'templates/tab-acerca.html',
        controller: ''
      }
    }
  })


  .state('tab.colabora', {
    url: '/colabora',
    views: {
      'tab-colabora': {
        templateUrl: 'templates/tab-colabora.html',
        controller: ''
      }
    }
  })


  //--------- Fin tabs --------

  .state('tab.busqueda', {
    url: '/busqueda',
    views: {
      'tab-encuentra': {
        templateUrl: 'templates/busqueda.html',
        controller: 'busquedaTodosCtrl'
      }
    }
  })

   .state('tab.perfil', {
    url: '/perfil',
    views: {
      'tab-encuentra': {
        templateUrl: 'templates/perfil.html',
        controller: 'limitacionesCtrl'
      }
    }
  })

  .state('tab.categoria-detalle', {
    url: '/categoria-detalle/:categoria',
    views: {
      'tab-encuentra': {
        templateUrl: 'templates/categoria-detalle.html',
        controller: 'detalleCategoriasCtrl'
      }
    }
  })

    .state('detalle', {
      url: '/detalle/:id',
      templateUrl: 'templates/detalle.html',
      controller: 'detalleCtrl',
      cache:false
      
    })

  ;
 

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/encuentra');

});