
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

twssApp.controller('debriefController', ['$scope', '$http', '$cookies', '$window','debriefService',
    function($scope, $http, $cookies, $window, debriefService){

        function writeJSONCookie(cookieName, data, options) {
            options = options || {};
            $cookies.put(cookieName, JSON.stringify(data), options);
        }

        function readJSONCookie(cookieName) {
            if (!$cookies.get(cookieName)) return 0;
            return JSON.parse($cookies.get(cookieName));
        }

        $scope.selectedGroups = [];
        $scope.groups = [];

        $http({
            method:'GET',
            url: '/api/debrief/groups/init'
        })
            .success(function(data){
                $scope.groups = data.groups;
            })
            .error(function(err, status){
                console.log(err.status);
            });

        $scope.whatSpaceCounter = 0;
        $scope.titleContext = {
            title: "",
            generatedUsers:[],
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

            var reqData = {
                text : $scope.titleContext.title,
                tags : $scope.titleContext.tags
            };

            if (reqData.text){
                console.log('sending data to server...: ' + reqData.text + ',' + reqData.tags);
                $http({
                    method:'POST',
                    url: '/api/recommend/title',
                    data: reqData
                })
                    .success(function(recommendation){
                        $scope.titleContext.recommendations = recommendation.debriefs;
                        $scope.titleContext.tags = recommendation.tags;
                        // writeJSONCookie('titleContext', $scope.titleContext);
                    })
                    .error(function(err, status){
                        // console.log('ERRROR');
                        console.log(err.status);
                    });
            }
        };

        $scope.sendWhat = function(){
            // console.log('sendWhat func triggered!');

            var reqData = {
                text : $scope.whatContext.what,
                tags : $scope.whatContext.tags
            };

            if (reqData.text){
                console.log('sending data to server...: ' + reqData.text + ',' + reqData.tags);
                $http({
                    method:'POST',
                    url: '/api/recommend/what',
                    data: reqData
                })
                    .success(function(recommendation){
                        // console.log('DEBUG:');
                        // console.log(recommendation.debriefs);
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
        
        $scope.whatHappened = function () {
            writeJSONCookie('titleContext', $scope.titleContext);
            var landingUrl = "http://" + $window.location.host + "/debrief/what";
            $window.open(landingUrl, '_self');
        };

        $scope.addDebrief = function() {
            console.log('publishing');
            var debrief = {
                title:readJSONCookie('titleContext').title,
                what: $scope.whatContext.what,
                users: $scope.titleContext.generatedUsers,
                groups: $scope.selectedGroups
            };
            debriefService.publish(debrief);
        };

        $scope.redirectToDebrief = function(debId){
            var landingUrl = "http://" + $window.location.host + "/debrief/view/" + debId;
            $window.open(landingUrl, '_blank');
        };

        $scope.generateUsers = function(){
            $scope.titleContext.generatedUsers = [];
            $http({
                method:'POST',
                url: '/api/debrief/groups/users',
                data: {groups: $scope.selectedGroups}
            })
                .success(function(data){
                    
                    data.users.forEach(function(user){
                        var generatedUser = {
                            user: user,
                            rank: 1
                        };
                        $scope.titleContext.generatedUsers.push(generatedUser)
                    });
                })
                .error(function(err){
                    console.log(err.status);
                });

        }
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