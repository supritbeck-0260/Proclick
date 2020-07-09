app.controller('productCtrl',function($scope,$http){
$scope.save = "Save";
$scope.lsave = "Save";
$scope.message = '';
$scope.saveProduct = function(){
    $scope.save = "Loading..";
    $scope.message = '';
    if($scope.link && $scope.name){
        $http.post("../php/saveProduct.php",{"name":$scope.name,"link":$scope.link}).success(function(response){
            $scope.message = response;
            $scope.name = '';
            $scope.link = '';
            $scope.save = "Save";
        });
    }else{
        $scope.message = "Please Enter valid Name and link.";
        $scope.save = "Save";
    }
    
}
$scope.saveLens = function(){
    $scope.lsave = "Loading..";
    $scope.lmessage = '';
    if($scope.lensName && $scope.lensLink){
        $http.post("../php/saveLens.php",{"name":$scope.lensName,"link":$scope.lensLink}).success(function(response){
            $scope.lmessage = response;
            $scope.lensName = '';
            $scope.lensLink = '';
            $scope.lsave = "Save";
        });
    }else{
        $scope.lmessage = "Please Enter valid Name and link.";
        $scope.lsave = "Save";
    }
    
}

});