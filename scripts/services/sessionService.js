'use strict';

app.factory('sessionService', ['$http', function($http){
	return{
		set: function(key, value){
			return sessionStorage.setItem(key, value);
		},
		get: function(key){
			return sessionStorage.getItem(key);
		},
		destroy: function(key){
			$http.post('../../php/signup_login/logout.php');
			return sessionStorage.removeItem(key);
		}
	};
}]);