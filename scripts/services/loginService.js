'use strict';

app.factory('loginService', function($http, $location, sessionService){
	return{
		login: function(user, $scope){
			var validate = $http.post('../../php/signup_login/login.php', user);
			validate.then(function(response){
				var user = response.data;
				if(user.uid && user.name){
					sessionService.set('myuid',user.uid);
					sessionService.set('name',user.name);
					$location.path("/profile/"+user.uid+"");
					
				}
				
				else{
					$scope.signupErr= true;
					$scope.ErrorMsg = response.data;
				}
			});
		},
		logout: function(){
			sessionService.destroy('myuid');
			sessionService.destroy('name');
			$location.path('/');
		},
		islogged: function(){
			var checkSession = $http.post('../../php/signup_login/session.php');
			return checkSession;
		}
	}
});