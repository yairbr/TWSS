twssApp.factory('debriefService', ['$http','$cookies','$location', function($http, $cookies,$location){
    return {
        publish: function(debrief){
            $http({
                method:'POST',
                url: '/api/add_debrief',
                data: debrief
            })
                .success(function(respData){
                    var newDebId = respData.deb_id;
                    var users = respData.users;
                    $cookies.remove('titleContext');
                    $cookies.remove('whatContext');
                    $cookies.put('users', JSON.stringify(users));
                    $location.path('/debrief/group_phase/' + newDebId);
                })
                .error(function(err, status){
                    console.log(err.status);
                });
        }
    };
}]);