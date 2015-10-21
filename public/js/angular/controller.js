app.controller('ActivitiesController', function($scope, $http) {

    $http.get('/data')
        .success(function(data) {
            $scope.test = data;
            console.log(data)
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    $scope.upVote = function(item) {
            console.log("trying to vote")

            $http.get('/votes/' + item._id)
            item.votes += 1
        },

        $scope.getAct = function() {
            console.log("tryin");

            $http.get('/data')
                .success(function(data) {
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });


        }

})