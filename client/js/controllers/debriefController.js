
twssApp.directive('spaceHitCounterTitle', function(){
  return function(scope, element, attrs){
    element.bind("keypress", function(event){
      if (event.which === 32){
        scope.$apply(function(){
          scope.$eval(attrs.spaceHitCounterTitle);
        });
      }
    });
  };
});

twssApp.directive('spaceHitCounterWhat', function(){
  return function(scope, element, attrs){
    element.bind("keypress", function(event){
      if (event.which === 32){
        scope.whatSpaceCounter++;
        if (scope.whatSpaceCounter%7===0){
          scope.$apply(function(){
            scope.$eval(attrs.spaceHitCounterWhat);
          });
        }
      }
    });
  };
});

twssApp.controller('debriefController', ['$scope', '$http', '$cookies', '$window', '$location', function($scope, $http, $cookies, $window, $location){

  function writeJSONCookie(cookieName, data, options) {
    options = options || {};
    $cookies.put(cookieName, JSON.stringify(data), options);
  }

  function readJSONCookie(cookieName) {
    if (!$cookies.get(cookieName)) return 0;
    return JSON.parse($cookies.get(cookieName));
  }

  $scope.whatSpaceCounter = 0;
  $scope.titleContext = {
    title: "",
    tags: [],
    recommendations: []
  };
  $scope.whatContext = {
    what: "",
    tags: [],
    recommendations: []
  };
  if (readJSONCookie('titleContext')){
    $scope.titleContext = readJSONCookie('titleContext');
  }
  if (readJSONCookie('whatContext')){
    $scope.whatContext = readJSONCookie('whatContext');
  }

  $scope.sendTitle = function(){
    // console.log('sendTitle func triggered!');
    var titleToRecommend = $scope.titleContext.title;

    var reqData = {
      text : titleToRecommend,
      tags : $scope.titleContext.tags
    };

    if (titleToRecommend){
      // console.log('sending data to server...: ' + reqData.text + ',' + reqData.tags);
      $http({
        method:'POST',
        url: '/api/recommend/title',
        data: reqData
      })
      .success(function(recommendation){
        $scope.titleContext.recommendations = recommendation.debriefs;
        $scope.titleContext.tags = recommendation.tags;
        writeJSONCookie('titleContext', $scope.titleContext);
      })
      .error(function(err, status){
        // console.log('ERRROR');
        console.log(err.status);
      });
    }
  };

  $scope.sendWhat = function(){
    // console.log('sendWhat func triggered!');
    var whatToRecommend = $scope.whatContext.what;

    var reqData = {
      text : whatToRecommend,
      tags : $scope.whatContext.tags
    };

    if (whatToRecommend){
      // console.log('sending data to server...: ' + reqData.text + ',' + reqData.tags);
      $http({
        method:'POST',
        url: '/api/recommend/what',
        data: reqData
      })
      .success(function(recommendation){
        $scope.whatContext.recommendations = recommendation.debriefs;
        $scope.whatContext.tags = recommendation.tags; //TODO: concat the tags from the title but keep them unique
        writeJSONCookie('whatContext', $scope.whatContext);
      })
      .error(function(err, status){
        // console.log('ERRROR');
        console.log(err.status);
      });
    }
  };

  $scope.addDebrief = function(){
    // console.log('publishing');
    var reqData = {
      title : $scope.titleContext.title,
      what : $scope.whatContext.what,
      groups: $scope.groups.split(',')
    };

    $http({
        method:'POST',
        url: '/api/add_debrief',
        data: reqData
      })
      .success(function(newDebrief){
        // console.log(newDebrief);
        var newDebId = newDebrief._id;
        $cookies.remove('titleContext');
        $cookies.remove('whatContext');
        $location.path('/debrief/group_phase/' + newDebId);
        // var landingUrl = "http://" + $window.location.host + "/debrief/group_phase/" + newDebId;
        // $window.open(landingUrl);
      })
      .error(function(err, status){
        // console.log('ERRROR');
        console.log(err.status);
      });
    };

    $scope.redirectToDebrief = function(debId){
      var landingUrl = "http://" + $window.location.host + "/debrief/view/" + debId;
      $window.open(landingUrl, '_blank');
    };
}]);

twssApp.run( function($rootScope, $location, $cookies) {
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
    // $cookies.remove('recommendedDebriefsByTitle');
    if (next.templateUrl){
      // console.log('changed the partial to: ' + next.templateUrl);
      if (next.templateUrl.indexOf('db-') === -1){
        // console.log('not in title or what');
        $cookies.remove('titleContext');
        $cookies.remove('whatContext');
      }
    }
  });
});