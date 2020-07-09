'use strict';

app.factory('dataExchange', function(){
    var temp = false;
	return{
		setData: function(val){
			return temp = val;
		},
		getData: function(val){
			return temp;
		}
	};
});