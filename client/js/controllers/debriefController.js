twssApp.directive('spaceHitCounter', function(){
  return function(scope, element, attrs){
    element.bind("keypress", function(event){
      if (event.which === 32){
        scope.$apply(function(){
          scope.$eval(attrs.spaceHitCounter);
        });
      }
    });
  };
});

twssApp.controller('debriefController', ['$scope', '$http', function($scope, $http){
  $scope.titleToRecommend = "";
  $scope.recommendedDebriefs = [];
  $scope.tags = [];

  $scope.sendTitle = function(){
    console.log('sendTitle func triggered!');
    $scope.titleToRecommend = $scope.title;

    var reqData = {
      text : $scope.titleToRecommend,
      tags : $scope.tags
    };

    if ($scope.titleToRecommend){
      console.log('sending data to server...: ' + reqData.text + ',' + reqData.tags);
      $http({
        method:'POST',
        url: '/api/recommend/title',
        data: reqData
      })
      .success(function(recommendation){
        console.log('got response from server! : ' + JSON.stringify(recommendation));
        // recommendation.debriefs.foreach(function(item){
        //   $scope.recommendedDebriefs.push(item.title);
        // });
        $scope.recommendedDebriefs = recommendation.debriefs;
        $scope.tags = recommendation.tags;
      })
      .error(function(err, status){
        console.log(err.status);
      });
    }
  };
}]);