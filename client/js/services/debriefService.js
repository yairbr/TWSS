twssApp.factory('debriefService', ['$http','$cookies','$location', function($http, $cookies,$location){
    return {
        publish: function(debrief){
            var groupsArr = debrief.groups.split(',');
            var reqData = {
                title : debrief.title,
                groups: groupsArr,
                what : debrief.what
            };

            $http({
                method:'POST',
                url: '/api/add_debrief',
                data: reqData
            })
                .success(function(newDebrief){
                    var newDebId = newDebrief._id;
                    $cookies.remove('titleContext');
                    $cookies.remove('whatContext');
                    $location.path('/debrief/group_phase/' + newDebId);
                })
                .error(function(err, status){
                    console.log(err.status);
                });
        }
    };
}]);