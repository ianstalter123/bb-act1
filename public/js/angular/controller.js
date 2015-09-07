app.controller('ActivitiesController', function($scope, $http) {

    $scope.upVote = function(id) {
        console.log("trying to vote")

        $http.get('/votes/'+id)
            .success(function(data) {
                console.log(data);
                location.reload();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
  
})