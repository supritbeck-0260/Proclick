var app = angular.module('myApp',['infinite-scroll','ngRoute']);

app.config(function($routeProvider) {
     $routeProvider
     .when("/", {
          templateUrl : "templates/home.html",
          
        })
     .when("/profile", {
          templateUrl : "templates/mainBody.html",
          controller:"indexCtrl"
        })
     .when("/signup", {
       templateUrl : "templates/signup.html",
       controller:"signupCtrl"
     })
     .when("/login", {
       templateUrl : "templates/login.html",
       controller:"loginCtrl"
     })
     .otherwise({
		redirectTo: '/'
	});;
   });

 app.directive("fileInput", function($parse){  
      return{  
           link: function($scope, element, attrs){  
                element.on("change", function(event){  
                     var files = event.target.files;  
                     $parse(attrs.fileInput).assign($scope, element[0].files);  
                     console.log(element);
                     $scope.$apply(); 
                     console.log("File Name:");
                     console.log($scope.files[0].name);
                });  
           }  
      }  
 });  


 app.controller('indexCtrl', function($scope, $http,$timeout){  
     //  initialization
     $scope.images = [];
      $scope.profPic="img/male.png";
      var tempProfPic = '';
      $scope.flag= false;
      $scope.upload="upload";
      $scope.isDisable = false;

      $scope.row = 0;
      $scope.rowperpage = 4;
      $scope.busy = false;
      $scope.loading = false;
      //initialization
     //  image preview 
      $scope.SelectFile = function (e) {
          var reader = new FileReader();
          $scope.save="save";
          reader.onload = function (e) {
               $scope.flag= true;
              $scope.profPic = e.target.result;
              $scope.$apply();
          };

          reader.readAsDataURL(e.target.files[0]);
      };//image preview
  
     // Profile pic post
      $scope.profilePic = function(){  
          console.log("profile pic funciton");
          $scope.save="Loading..";
          $scope.isDisable = true;
         var form_data = new FormData();  
         angular.forEach($scope.profile, function(file){  
              form_data.append('file', file);  
         }); 
        console.log(form_data);
         $http.post('php/profilePost.php',form_data,  
         {  
              transformRequest: angular.identity,  
              headers: {'Content-Type': undefined,'Process-Data': false} , 
        
         }).success(function(response){  
              console.log("Response File data:");
              console.log(response);  
              $scope.profileGet();
              $scope.flag= false;
              $scope.save="save";
              $scope.isDisable = false;
         });  
       }//prifile pic post

       //Cancle upload
       $scope.cancle = function(){
          $scope.profPic = tempProfPic;
          $scope.flag = false;
       }//Cancle upload

// Profile pic get 
       $scope.profileGet= function(){
          $http.get('php/profileGet.php').success(function(response){
               console.log("Profile Get Response");
               console.log(response);
               $scope.profPic ="img/"+ response[0].img;
               tempProfPic = $scope.profPic;
          });
           }

// Profile pic get 

      $scope.uploadFile = function(){  
          $scope.upload="Loading...";
          $scope.isDisable = true;
           var form_data = new FormData();  
           angular.forEach($scope.files, function(file){  
                form_data.append('file', file);  
           }); 
        console.log("form_data check:");
          form_data.append('time', new Date()); 
          form_data.append('name', $scope.name); 
          console.log("Form Length");
         
           $http.post('php/upload.php',form_data,  
           {  
                transformRequest: angular.identity,  
                headers: {'Content-Type': undefined,'Process-Data': false} , 
          
           }).success(function(response){  
                console.log("Response File data:");
                console.log(response[0].id);  
               //  $scope.row = 0;
               if(response[0].id){
                    $scope.images.unshift(response[0]); 
               }
                
                $scope.upload="upload";
                $scope.isDisable = false;
               //  $scope.select();  
           });  

      }  //UploadFile() function ends here
     
      //get image gallery
      $scope.select = function(){
          if ($scope.busy) return;
          $scope.busy = true;  

           $http.post("php/getfile.php",{'row':$scope.row,'rowperpage':$scope.rowperpage})  
           .success(function(data){  
                if(data !=''){
               $scope.row+=$scope.rowperpage;
               console.log($scope.row);
               $scope.loading = true;
               setTimeout(function() {
                    $scope.$apply(function(){
        
                      // Assign response to posts Array 
                      angular.forEach(data,function(item) {
                         $scope.images.push(item);
                      });
                      $scope.busy = false;
                      $scope.loading = false;
                    });
        
                 },700);

                console.log("Response Data:");
                console.log(data);
                var day="";
                var hour = "";
                var min = "";
                var sec = "";
                var currentTime= "";
                var diff="";
                
               // Display time Ago
                $scope.intervalFunction = function(){
                    $timeout(function() {
                      
                         currentTime = new Date();
                         currentTime= currentTime.getTime();
                         angular.forEach($scope.images,function(value){
                              value.time= new Date(value.time);
                              value.time= value.time.getTime();
                              diff = Math.floor((currentTime - value.time)/1000);
         
                              day = Math.floor(diff/86400);
                              hour = Math.floor((diff % 86400) / 3600);
                              min = Math.floor(((diff % 86400) % 3600) / 60);
                              sec = Math.floor((diff % 86400) % 3600) % 60;
                             
                             if(diff < 60){
                                       value.msg=sec + " seconds ago";
                                  }
                             else if (diff >= 60 && diff <120){
                                       value.msg= min + " minute ago";
                             }
                             else if (diff >= 120 && diff < 3600){
                                       value.msg= min + " minutes ago";
                             }
                             else if( diff >= 3600 && diff < 3600*2){
                                  value.msg= hour + " hour ago";
                             }
                             else if( diff > 3600*2 && diff < 3600*24 ){
                                  value.msg= hour + " hours ago";
                             }
                             else if( diff > 3600*24 && diff <= 3600*24*2 ){
                                  value.msg= " Yesterday";
                             }
                             else{ 
                                  value.msg= new Date(value.time);
                             }
                         //     console.log(diff);
                         //      console.log(day);
                         //      console.log(':');
                         //      console.log(hour);
                         //      console.log(':');
                         //      console.log(min);
                         //      console.log(':');
                         //      console.log(sec);
                         });

                      $scope.intervalFunction();
                    }, 1000)
                  };
                  $scope.intervalFunction();


               
                console.log("Get My images");
                console.log($scope.images);
               }
           });    
  
      } //select() function Ends here  
      
      $scope.delete= function(id,index){
          $http.post('php/delete.php',id).success(function(response){
               console.log("Delete response");
               console.log(response);
               $scope.images.splice(index, 1); 
               // $scope.images = [];
               // $scope.select();  
          });
           }
           var tempId = '';
           var tempIndex = '';
     $scope.edit = function(id,name,index){
          tempId = id;
          tempIndex= index;
          $scope.EditedName = name;
     }
     $scope.save= function(name){
          $http.post('php/edit.php',{'id':tempId,'name':name}).success(function(response){
               console.log("Edit response");
               console.log(response);
               console.log('Inside Save:');
               console.log(response[0].name);
               console.log(tempIndex);
               $scope.images[tempIndex].name= response[0].name;
               $scope.EditedName='';
               // $scope.select();  
           });
          }
          
 });  

 
 app.controller('signupCtrl',function($scope,$http){
     $scope.signupErr = false;
     $scope.passError = false;
     $scope.createBtn = "Create Account";
      $scope.submit= function(){
          if($scope.user.password === $scope.user.cpassword){
               $scope.passError = false;
               $scope.signupErr= false;
               $scope.createBtn = "Loading...";
               $scope.user.date = new Date();
               console.log($scope.user.date);
               var user = angular.toJson($scope.user);
               console.log(user);
               $http.post('php/signup_login/signup.php', user).success(function(response){
                    console.log("Profile Get Response");
                    console.log(response);
                    $scope.signupErr= true;
                    $scope.dynclass = "alert-success";
                    $scope.ErrorMsg = response;
                    $scope.user= '';
                    $scope.createBtn = "Create Account";
               });
          }else{
               $scope.signupErr= true;
               $scope.dynclass = "alert-danger";
               $scope.ErrorMsg = "Passwords do not match ";
          }
          
      }

      $scope.passErr= function(){
          $scope.passError = true;
      }
 });

 app.controller('loginCtrl',function($scope,$http,$location){
     $scope.signupErr= false;
     $scope.submit = function(){
          var user = angular.toJson($scope.user);
          $http.post('php/signup_login/login.php',user).success(function(response){
               console.log(response);
               if(response =='success'){
                    $scope.signupErr= false;
                    $location.path( "/profile" );
               }else{
                    $scope.signupErr= true;
                    $scope.ErrorMsg = response;
               }
          });
     }
 });


 