'use strict';

appControllers.controller('appCtrl',['$scope', '$state','$ionicSideMenuDelegate','$ionicScrollDelegate','constantes', '$ionicModal','$http','localStorageService','$timeout','$ionicPopup', '$location', function($scope,$state,$ionicSideMenuDelegate,$ionicScrollDelegate,constantes, $ionicModal, $http, localStorageService,$timeout,$ionicPopup, $location){


	$scope.const={
		'host':constantes.HOST,
		'title':constantes.APP_NAME
	}


	function displayTrue(){
		$scope.nbLoad--;
		if($scope.nbLoad<=0){
			$scope.displayHome=true;
		}
	}



	$scope.toggleLeftSideMenu = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

	$scope.go = function(path,param) {
		$scope.displayHome=false;
		$scope.page=$location.path();
		var from = $scope.page.split('/');
		$scope.previous_page = from[1];
		$scope.categorie = from[2];
		$state.go(path, param);

	};	
 	

		
	

	$scope.scrollTop = function() {
		$ionicScrollDelegate.scrollTop();
	};




}]);

