appServices.directive("scroll", function ($ionicGesture) {
   return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
    	var i=0;
      $ionicGesture.on('dragup', function(){
      	i+=2;
      	scope.drag(300*i);
      	i=0;
      }, elem);
      var j=0;
      $ionicGesture.on('dragdown', function(){
      	j+=2;
      	scope.drag(-300*j);
      	j=0;
      }, elem);
    }
  }
});

