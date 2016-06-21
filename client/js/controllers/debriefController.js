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

twssApp.controller('debriefController', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location){
  $scope.titleToRecommend = "";

  if ($location.path().indexOf('/debrief') === -1){
    console.log('changed!!');
  }

  function writeJSONCookie(cookieName, data, options) {
    options = options || {};
    $cookies.put(cookieName, JSON.stringify(data), options);
  }

  function readJSONCookie(cookieName) {
    if (!$cookies.get(cookieName)) return 0;
    return JSON.parse($cookies.get(cookieName));
  }

  // $scope.recommendedDebriefs = [];
  if (!readJSONCookie('recommendedDebriefs')) $scope.recommendedDebriefs = [];
  else $scope.recommendedDebriefs = readJSONCookie('recommendedDebriefs');

  // $scope.tags = [];
  if (!readJSONCookie('tags')) $scope.tags = [];
  else $scope.tags = readJSONCookie('tags');

  if (!readJSONCookie('title')) $scope.title = [];
  else $scope.title = readJSONCookie('title');

  $scope.sendTitle = function(){
    // console.log('sendTitle func triggered!');
    $scope.titleToRecommend = $scope.title;
    writeJSONCookie('title', $scope.titleToRecommend);

    var reqData = {
      text : $scope.titleToRecommend,
      tags : $scope.tags
    };

    if ($scope.titleToRecommend){
      // console.log('sending data to server...: ' + reqData.text + ',' + reqData.tags);
      $http({
        method:'POST',
        url: '/api/recommend/title',
        data: reqData
      })
      .success(function(recommendation){
        // console.log('got response from server! : ' + JSON.stringify(recommendation));
        // recommendation.debriefs.foreach(function(item){
        //   $scope.recommendedDebriefs.push(item.title);
        // });
        $scope.recommendedDebriefs = recommendation.debriefs;
        writeJSONCookie('recommendedDebriefs', $scope.recommendedDebriefs);
        $scope.tags = recommendation.tags;
        writeJSONCookie('tags', $scope.tags);
      })
      .error(function(err, status){
        console.log(err.status);
      });
    }
  };
}]);

twssApp.run( function($rootScope, $location, $cookies) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    if (next.templateUrl){
      if (next.templateUrl.indexOf('db-') === -1){
        $cookies.remove('recommendedDebriefs');
        $cookies.remove('tags');
        $cookies.remove('title');
      }
    }
  });
});