var app = angular.module('myApp',['infinite-scroll']);

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
      $scope.profPic="img/male.png";
      var tempProfPic = '';
      $scope.flag= false;
     //  image preview 
      $scope.SelectFile = function (e) {
          var reader = new FileReader();
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
         var form_data = new FormData();  
         angular.forEach($scope.files, function(file){  
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
         });  
       }//prifile pic post

       //Cancle upload
       $scope.cancle = function(){
          $scope.profPic = tempProfPic;
          $scope.flag = false;
       }//Cancle upload

// Profile pic get 
       $scope.profileGet= function(){
          $http.get('php/ProfileGet.php').success(function(response){
               console.log("Profile Get Response");
               console.log(response);
               $scope.profPic ="img/"+ response[0].img;
               tempProfPic = $scope.profPic;
          });
           }
// Profile pic get 

      $scope.uploadFile = function(){  
           var form_data = new FormData();  
           angular.forEach($scope.files, function(file){  
                form_data.append('file', file);  
           }); 
        console.log("form_data check:");
          form_data.append('time', new Date()); 
          form_data.append('name', $scope.name); 
          console.log(form_data);
           $http.post('php/upload.php',form_data,  
           {  
                transformRequest: angular.identity,  
                headers: {'Content-Type': undefined,'Process-Data': false} , 
          
           }).success(function(response){  
                console.log("Response File data:");
                console.log(response);  
                $scope.select();  
           });  

      }  //UploadFile() function ends here
     
      //get image gallery
      $scope.row = 0;
      $scope.rowperpage = 3;
      $scope.posts = [];
      $scope.busy = false;
      $scope.loading = false;
      
      $scope.select = function(){  
           $http.get("php/getfile.php")  
           .success(function(data){  
                $scope.images = data;
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
                    }, 500)
                  };
                  $scope.intervalFunction();


               
                console.log("Get My images");
                console.log($scope.images);
                
           });    
           $scope.profileGet();   
      } //select() function Ends here  
      
      $scope.delete= function(id){
          $http.post('php/delete.php',id).success(function(response){
               console.log("Delete response");
               console.log(response);
               $scope.select();  
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