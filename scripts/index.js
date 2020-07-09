var app = angular.module('myApp',['infinite-scroll','ngRoute']);

app.config(function($routeProvider) {
     $routeProvider
     .when("/", {
          templateUrl : "templates/home.html",
          controller:"indexCtrl"
        })
     .when("/profile/:uid", {
          templateUrl : "templates/profile.html",
          controller:"indexCtrl"
        })
        .when("/image/:id&:index", {
          templateUrl : "templates/image.html",
          controller:"imgCtrl"
        })
     .when("/signup", {
       templateUrl : "templates/signup.html",
       controller:"signupCtrl"
     })
     .when("/login", {
       templateUrl : "templates/login.html",
       controller:"loginCtrl"
     })
     .when("/recover/:uid", {
          templateUrl : "templates/recover.html",
          controller:"loginCtrl"
        })
     .when("/forgot", {
          templateUrl : "templates/forgot.html",
          controller:"loginCtrl"
        })
     .when("/add", {
          templateUrl : "templates/addProduct.html",
          controller:"productCtrl"
        })
     .otherwise({
		redirectTo: '/'
	});;
   });

   app.run(function($rootScope, $location, loginService,sessionService){
	//prevent going to profile if not loggedin
	var routePermit = ['/add'];
	$rootScope.$on('$routeChangeStart', function(){
		if(routePermit.indexOf($location.path()) !=-1){
			// var connected = loginService.islogged();
			// connected.then(function(response){
			// 	if(!response.data){
			// 		$location.path('/');
               // 	}
          // });
               let myuid = sessionService.get("myuid");
                    if(myuid != '3caadb24cc3a7b5664677d62ccb5789f' && myuid != '9f4edea8e2ce842fa02b05de66e02f7a'){
                         $location.path('/');
                    }
		
			
		}
	});
	//prevent going back to login page if sessino is set
	var sessionStarted = ['/login'];
	$rootScope.$on('$routeChangeStart', function(){
		if(sessionStarted.indexOf($location.path()) !=-1){
			var cantgoback = loginService.islogged();
			cantgoback.then(function(response){
				if(response.data){
					$location.path('/profile');
				}
			});
		}
	});
});
 app.directive("fileInput", function($parse){  
      return{  
           link: function($scope, element, attrs){  
                element.on("change", function(event){  
                     var files = event.target.files;  
                     $parse(attrs.fileInput).assign($scope, element[0].files);  
                     $scope.$apply(); 
                });  
           }  
      }  
 });  

 app.directive('googleplace', function() {
     return {
         require: 'ngModel',
         link: function(scope, element, attrs, model) {
             var options = {
                 types: [],
                 componentRestrictions: {}
             };
             scope.gPlace = new google.maps.places.Autocomplete(element[0], options);
             google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                 scope.$apply(function() {
                     model.$setViewValue(element.val()); 
                     var place = scope.gPlace.getPlace();
                    var lat = place.geometry.location.lat();
                    var lng = place.geometry.location.lng();
                    var formatted_address = place.formatted_address;
                    document.getElementById("output").innerHTML = "Lat: "+lat+"<br />Lng: "+lng+"<br/>Address: " + formatted_address;
                    // generateGEO(lat, lng, formatted_address);               
                 });
             });
         }
     };
 });

 app.controller('indexCtrl', function($scope,$rootScope, $http,$timeout,$routeParams,loginService,sessionService){  
     //  initialization
     $scope.images = new Array;
     $scope.gallery = new Array;
      $scope.profPic="img/male.png";
      var tempProfPic = '';
      $scope.flag= false;
      $scope.upload="upload";
      $scope.isDisable = false;

      $scope.row = 0;
      $scope.rowperpage = 4;
      $scope.busy = false;
      $scope.loading = false;
      $scope.toggleProfileEdit = true;
      $scope.photoUpload = new Object;
      $scope.photoUpload.about = '';
      $scope.photoUpload.camera = '';
      $scope.photoUpload.photography = '';
      $scope.photoUpload.lens = '';
      $scope.photoUpload.editing = '';
      $scope.photoUpload.setting = '';
      $scope.photoUpload.location = '';
      $scope.isEditing = true;
      $scope.saveEdit = "save";
      $rootScope.uid= new Object;
      $rootScope.uid.myuid = sessionService.get('myuid');
      $rootScope.uid.routeuid = $routeParams.uid;
      $scope.Edited= new Object;

      $scope.gPlace;
      $(document.body).removeClass("modal-open");
     $(".modal-backdrop").remove();
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
          $scope.profile = new Array;
          $scope.profile.push(e.target.files[0]);
          reader.readAsDataURL(e.target.files[0]);
      };//image preview

      //  image preview 
      $scope.uploadPreview = function (e) {
          var reader = new FileReader();
          reader.onload = function (e) {
              $scope.uploadPreviewImg = e.target.result;
              $scope.$apply();
          };

          reader.readAsDataURL(e.target.files[0]);
      };//image preview
  
     // Profile pic post
      $scope.profilePicPost = function(){ 
          $scope.save="Loading..";
          $scope.isDisable = true;
         var form_data = new FormData();  
         angular.forEach($scope.profile, function(file){  
              form_data.append('file', file);  
         }); 
         const myuid = sessionService.get('myuid');
         form_data.append('uid',myuid );
         $http.post('php/profilePost.php',form_data,  
         {  
              transformRequest: angular.identity,  
              headers: {'Content-Type': undefined,'Process-Data': false} , 
        
         }).success(function(response){  
              $scope.profileGet();
              $scope.flag= false;
              $scope.save="save";
              $scope.isDisable = false;
         });  
       }//prifile pic post

       //Cancle upload
       $scope.Cancel = function(){
          $scope.profPic = tempProfPic;
          $scope.flag = false;
       }//Cancle upload

// Profile pic get 
       $scope.profileGet= function(){
          const routeUid = $routeParams.uid;
          $http.post('php/profileGet.php',routeUid).success(function(response){
               if(response.length > 0){
                    if(response[0].profilepic != ''){
                    $scope.profPic ="img/"+ response[0].profilepic;
                    }
                   
                    tempProfPic = $scope.profPic;
               }
               else{
                    console.log('Profile pic not found');
               }
               
          });
     }
// Profile pic get 

//  Photo upload 
      $scope.uploadFile = function(){  
          $scope.upload="Loading...";
          $scope.isDisable = true;
           var form_data = new FormData();  
           angular.forEach($scope.files, function(file){  
                form_data.append('file', file);  
           }); 

           $scope.photoUpload.time = new Date();
           $scope.photoUpload.user = sessionService.get('name');
           var photoUpload = angular.toJson($scope.photoUpload);
           form_data.append('fileinfo',photoUpload); 
           form_data.append('uid',sessionService.get('myuid')); 
           $http.post('php/upload.php',form_data,  
           {  
                transformRequest: angular.identity,  
                headers: {'Content-Type': undefined,'Process-Data': false} , 
          
           }).success(function(response){  
               if(response[0].id){
                    const addObject = angular.fromJson(response[0].fileinfo);
                    addObject.id = response[0].id;
                    addObject.uid = response[0].uid; 
                    // $scope.images.unshift(addObject); 
                    $scope.gallery.unshift(addObject); 
               }
                
                $scope.upload="upload";
                $scope.isDisable = false;
               //  Clear input 
                angular.forEach(
                    angular.element("input[type='file']"),
                    function(inputElem) {
                      angular.element(inputElem).val(null);
                    });
               $scope.photoUpload = '';
               $scope.uploadPreviewImg = '';
               //Clear input
               //  $scope.select();  
           });  

      }  //UploadFile() function ends here
      //suggest camera starts
     $scope.suggestProduct = function(camera){
          $scope.photoUpload.link = '';
          $scope.Edited.link = '';
          $scope.userInfoCameraLink='';
          if(camera){
               $http.post("../php/suggestProduct.php",camera).success(function(response){
                    console.log(response);
                    $scope.products = response;
               });
          }
          
     }
     $scope.setData = function(data){
          $scope.photoUpload.camera = data.productName;
          $scope.photoUpload.link = data.link;
     }
     //Product Edit 
     $scope.setEditData = function(data){
          $scope.Edited.camera = data.productName;
          $scope.Edited.link = data.link;
     }
     //Product edit
     //suggest camera ends
//suggest Lens starts
           $scope.suggestLens = function(camera){
               $scope.photoUpload.link = '';
               $scope.Edited.link = '';
               $scope.userInfoLensLink = '';
               if(camera){
                    $http.post("../php/suggestlens.php",camera).success(function(response){
                         console.log(response);
                         $scope.lens = response;
                    });
               }
               
          }
          $scope.setDataLens = function(data){
               $scope.photoUpload.lens = data.productName;
               $scope.photoUpload.lensLink = data.link;
          }
          //Product Edit 
          $scope.setEditDataLens = function(data){
               $scope.Edited.lens = data.productName;
               $scope.Edited.lensLink = data.link;
          }
          //Product edit
//suggest lens ends
$scope.setProfilelens = function(data){
     $scope.userInfoLens = data.productName;
     $scope.userInfoLensLink = data.link; 
}
$scope.setProfileCamera = function(data){
     $scope.userInfoCamera = data.productName;
     $scope.userInfoCameraLink = data.link; 
}
      //get image gallery
      $scope.select = function(){
          if ($scope.busy) return;
          $scope.busy = true;  

           $http.post("php/getfile.php",{'myuid':$rootScope.uid.myuid,'row':$scope.row,'rowperpage':$scope.rowperpage})  
           .success(function(data){  
                if(data !=''){
               $scope.row+=$scope.rowperpage;
               $scope.loading = true;
               setTimeout(function() {
                    $scope.$apply(function(){
        
                      // Assign response to posts Array 
                      angular.forEach(data,function(item) {
                         var addObject = angular.fromJson(item.fileinfo);
                         addObject.id = item.id;
                         addObject.uid = item.uid;
                         addObject.avgRating = Math.round(item.avgrating);
                         addObject.myRating = item.rate;
                         if(item.totalrate){
                              addObject.totalRating = item.totalrate;
                         }
                         else{
                              addObject.totalRating = 0;
                         }
                         // Camera 
                         if(!addObject.link){
                              addObject.link = "https://www.google.com/search?q="+addObject.camera;  
                         }
                         if(!addObject.lensLink){
                              addObject.lensLink = "https://www.google.com/search?q="+addObject.lens;  
                         }
                         // Lens 
                         
                         
                         $scope.images.push(addObject);
                      });
                      $scope.busy = false;
                      $scope.loading = false;
                    });
        
                 },100);
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
                         });

                      $scope.intervalFunction();
                    }, 100)
                  };
                  $scope.intervalFunction();
                 

               }
               else{
                    console.log("Erron Fetching Home Data");
               }
           });    
  
      } //select() function Ends here  
     
      //get my files only
      $scope.getmyFiles = function(){
          if ($scope.busy) return;
          $scope.busy = true;  
          const routeUid = $routeParams.uid;
           $http.post("php/getmyfile.php",{'row':$scope.row,'rowperpage':$scope.rowperpage,'uid':routeUid})  
           .success(function(data){  
                if(data !=''){
               $scope.row+=$scope.rowperpage;
               $scope.loading = true;
               setTimeout(function() {
                    $scope.$apply(function(){
        
                      // Assign response to posts Array 
                      angular.forEach(data,function(item) {
                         var addObject = angular.fromJson(item.fileinfo);
                         addObject.id = item.id;
                         addObject.uid = item.uid;
                         addObject.avgRating = Math.round(item.avgrating);
                         if(item.totalrate){
                              addObject.totalRating = item.totalrate;
                         }
                         else{
                              addObject.totalRating = 0;
                         }
                         $scope.gallery.push(addObject);
                      });
                      $scope.busy = false;
                      $scope.loading = false;
                    });
        
                 },700);
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
                         angular.forEach($scope.gallery,function(value){
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
                         });

                      $scope.intervalFunction();
                    }, 100)
                  };
                  $scope.intervalFunction();

               }
               else{
                    console.log("Erron Fetching gallery Data");
               }
           });    
  
      }  
      //get my files only

// Edit Delete and Save section 
      $scope.delete= function(id,index){
          $http.post('php/delete.php',id).success(function(response){
               $scope.gallery.splice(index, 1);   
          });
           }
     $scope.imagePreview = function(image,index){
          $scope.Edited=image;
          $scope.Edited.index = index;
     }
     $scope.wannaEdit = function() {
          $scope.isEditing = ! $scope.isEditing;
     }
     $scope.save= function(edited){
          $scope.saveEdit = "saving...";
          var editedjson = angular.toJson(edited);
          $http.post('php/edit.php',{'id':edited.id,'fileinfo':editedjson}).success(function(response){
               $scope.gallery[$scope.Edited.index]= angular.fromJson(response[0].fileinfo);
               $scope.Edited=angular.fromJson(response[0].fileinfo);
               $scope.wannaEdit();
               $scope.saveEdit = "save";
               // $scope.select();  
           });
          }
     
     $scope.editProfile = function(){
          $scope.toggleProfileEdit = !$scope.toggleProfileEdit;
     }
     $scope.saveProfileInfo = function(camera,lens,editing,about){
          var userInfo = angular.toJson({"camera":camera,"lens":lens,"editing":editing,"about":about,"lensLink":$scope.userInfoLensLink,"cameraLink":$scope.userInfoCameraLink});
          $http.post("php/profileInfoPost.php",{'uid':sessionService.get('myuid'),'profileinfo':userInfo}).success(function(response){
               $scope.getProfileInfo();
               $scope.editProfile();
                    
          });
     }
     $scope.getProfileInfo = function(){
          $scope.profileInfoLoaded = false;
          const routeUid = $routeParams.uid;
          $http.post("php/profileInfoGet.php",{'myuid':routeUid}).success(function(response){
               if(response.name){
               $scope.profileInfoLoaded = true;
               $scope.userName = response.name; 
               $scope.startedOn = new Date(response.date);
               
               $scope.avgProfileRating = Math.round(response.avgProfileRating);
               if(response.profileinfo != ""){
                    var data = angular.fromJson(response.profileinfo);
                    $scope.userInfoCamera = data.camera;
                    $scope.userInfoLens = data.lens;
                    $scope.userInfoEditingTool = data.editing;
                    $scope.userInfoAboutMe = data.about;
                    if(data.lensLink){
                         $scope.userInfoLenslink = data.lensLink;
                    }else{
                         $scope.userInfoLenslink = "https://www.google.com/search?q="+data.lens;  
                    }
                    if(data.cameraLink){
                         $scope.userInfoCameralink = data.cameraLink;
                    }else{
                         $scope.userInfoCameralink = "https://www.google.com/search?q="+data.camera;  
                    }
                    
               }
               $scope.toggleProfileEdit= true;
               }
               else{
                    console.log("User Data Not found");
               }
          });
     }
     $rootScope.postRating = function (rate,id,uid,index){
          const myuid = sessionService.get("myuid");
          let time = new Date();
          time = time.getTime();
          $http.post("../php/postRating.php",{"id":id,"rate":rate,"wonerUid":uid,"raterUid":myuid,"time":time}).success(function(response){
               $scope.images[index].avgRating = response[0].avgrating;
               $scope.images[index].totalRating = response[0].totalrate;
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
               var user = angular.toJson($scope.user);
               $http.post('php/signup_login/signup.php', user).success(function(response){
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

 app.controller('loginCtrl',function($scope,$http,loginService){
     $scope.forgotErr= false;
     $scope.submitBtn = "Submit";
     $scope.submit = function(){
          var user = angular.toJson($scope.user);
          loginService.login(user,$scope);

     }

     $scope.forgot= function(){
          $scope.submitBtn = "Loading...";
          $http.post("php/signup_login/forgot.php",{"email":$scope.email}).success(function(response){
               $scope.forgotErr= true;
               $scope.submitBtn = "Submit";
               $scope.ErrorMsg = response;
          });
     }
 });

 app.controller('forgotCtrl',function($scope,$http,$routeParams){
     $scope.createBtn = "Submit";
     $scope.signupErr = false;
     $scope.passError = false;
     const uid= $routeParams.uid;
     $scope.submit= function(){
          if($scope.user.password === $scope.user.cpassword){
               $scope.passError = false;
               $scope.signupErr= false;
               $scope.createBtn = "Loading...";
               $scope.user.date = new Date();

               $http.post("../php/signup_login/updatePassword.php",{"uid":uid,"password":$scope.user.password}).success(function(response){
                    $scope.signupErr= true;
                    $scope.dynclass = "alert-success";
                    $scope.ErrorMsg = response;
                    $scope.user= '';
                    $scope.createBtn = "Reset";
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

 app.controller('navCtrl',function($scope,$rootScope,$http,loginService,$location,sessionService,$interval){
      $scope.isLogin = false;
      $scope.uploadDisplay = false;
      $scope.myuid = sessionService.get('myuid');
      $scope.routeCheck = function(){
          $scope.myuid = sessionService.get('myuid');
          var profile = ["/profile/"+$scope.myuid+""];
          if(profile.indexOf($location.path()) == 0){
               $scope.uploadDisplay= true;
          }
          else{
               $scope.uploadDisplay= false;
          }
     }
      $scope.routeCheck();
      $scope.change = function(){
          var connected = loginService.islogged();
          connected.then(function(response){
               if(!response.data){
                    $scope.isLogin = false;
               }
               else{
                    $scope.isLogin = true;
               }
          });
      }
      $scope.change();

      $rootScope.$on('$routeChangeStart', function(){
          $scope.change();
          $scope.routeCheck();
      });

     
     $scope.logout = function(){
                   $rootScope.uid.myuid = null;
                   $scope.isLogin = false;
                    loginService.logout();
                    goto("#/");
                    
               }

     //Notification
     $scope.notificationChecked = function(){
          const myuid= sessionService.get("myuid");
          $http.post("../php/notificationChecked.php",{"myuid":myuid}).success(function(response){
          });
     }
     
      $interval(function () {
          const myuid = sessionService.get("myuid");
          if(myuid){
               $http.post("../php/notification.php",{"myuid":myuid}).success(function(response){
                    if(response){
                         $scope.notify= response;
                    }
               });
          }
     }, 1000);
   $scope.searchUsers = function(search){
        if(search){
          $http.post("../php/searchUsers.php",{'search':search}).success(function(response){
               $scope.searchResult = response;
             });
        }else{
          $scope.searchResult = null;
        }
        
     }  
     
 });

app.controller('imgCtrl',function($scope,$http,$routeParams,sessionService,$interval,$rootScope,$location){
     $scope.weburl = $location.absUrl();
     $scope.myuid = sessionService.get("myuid");
     $scope.allComments = new Array;
     $scope.row = 0;
     $scope.rowperpage = 4;
     $(document.body).removeClass("modal-open");
     $(".modal-backdrop").remove();
     let imgId = $routeParams.id;
     $scope.index= $routeParams.index;
     $scope.seeMore = false;
     $scope.fetchImage = function(){
          $http.post("../php/imageGet.php",imgId).success(function(response){
               let addObject = angular.fromJson(response[0].fileinfo);
               addObject.id = response[0].id;
               addObject.uid = response[0].uid;
               addObject.avgRating = Math.round(response[0].avgrating);
               addObject.myRating = response[0].rate;
               if(response[0].totalrate){
                   addObject.totalRating = response[0].totalrate;
               }else{
                    addObject.totalRating = 0;
                      }
           if(!addObject.link){
                addObject.link = "https://www.google.com/search?q="+addObject.camera;  
               }
          if(!addObject.lensLink){
                    addObject.lensLink = "https://www.google.com/search?q="+addObject.lens;  
               }
            $scope.image = addObject;
            $interval(function(){
               $scope.itime = $scope.intervalFunction($scope.image.time);
            },500);
          });
     }
     $interval(function(){
          angular.forEach($scope.allComments,function(value){
                    if(value.time){
                         value.ctime = $scope.intervalFunction(value.time);
                    }
               });
          },200);

     $scope.fetchComments = function(){
          $http.post("../php/getComments.php",{'id':imgId,'row':$scope.row,'rowperpage':$scope.rowperpage}).success(function(response){
               $scope.row+=$scope.rowperpage;
               if(response.length > 0){
                    if(response.length == 4){
                         $scope.seeMore = true;
                    }
                    angular.forEach(response,function(value){
                         $scope.allComments.push(value); 
                    });     
               }else{
                    $scope.seeMore = false;
               }
               
          });
     }
     
     $scope.postComment = function(id){
          let user = new Object;
          user.id=id;
          user.name = sessionService.get("name");
          user.uid = sessionService.get("myuid");
          user.comment = $scope.comment.trim();
          user.time = new Date;
          if(user.comment.length>0){
          user = angular.toJson(user);
          $http.post("../php/postComment.php",user).success(function(response){
               $scope.allComments.unshift(response[0]);
               $scope.comment = '';
          });
          }
     }
     $rootScope.postImageRating = function (rate,id,uid){
          const myuid = sessionService.get("myuid");
          let time = new Date();
          time = time.getTime();
          $http.post("../php/postRating.php",{"id":id,"rate":rate,"wonerUid":uid,"raterUid":myuid,"time":time}).success(function(response){
               $scope.image.avgRating = response[0].avgrating;
               $scope.image.totalRating = response[0].totalrate;
          });
     } 
     // Display time Ago
                $scope.intervalFunction = function(value){
                    var day="";
                    var hour = "";
                    var min = "";
                    var sec = "";
                    var currentTime= "";
                    var diff="";
                         currentTime = new Date();
                         currentTime= currentTime.getTime();
                              value= new Date(value);
                              value= value.getTime();
                              diff = Math.floor((currentTime - value)/1000);
         
                              day = Math.floor(diff/86400);
                              hour = Math.floor((diff % 86400) / 3600);
                              min = Math.floor(((diff % 86400) % 3600) / 60);
                              sec = Math.floor((diff % 86400) % 3600) % 60;
                             
                             if(diff < 60){
                                       return (sec + " seconds ago");
                                  }
                             else if (diff >= 60 && diff <120){
                                       return (min + " minute ago");
                             }
                             else if (diff >= 120 && diff < 3600){
                                       return (min + " minutes ago");
                             }
                             else if( diff >= 3600 && diff < 3600*2){
                                  return (hour + " hour ago");
                             }
                             else if( diff > 3600*2 && diff < 3600*24 ){
                                  return (hour + " hours ago");
                             }
                             else if( diff > 3600*24 && diff <= 3600*24*2 ){
                                  return (" Yesterday");
                             }
                             else{ 
                                  return (new Date(value));
                             }
                  };
                  
});

 //Star rating
 app.directive('rating', function($rootScope) {
     return {
       scope: {
         rate: '=',
         id: '=',
         uid: '=',
         index: '='
       },
       templateUrl: '../templates/rating.html',
       link: function(scope, element, attrs) {
         scope.range = [1,2,3,4,5];
   
         scope.update = function(value) {
           scope.rate = value;
           if(scope.index != null){
              $rootScope.postRating(value,scope.id,scope.uid,scope.index);
           }
          
           $rootScope.postImageRating(value,scope.id,scope.uid);
         };
       }
     };
   });
 
// Average Rating 
app.directive('avgRating', function() {
     return {
       scope: {
         rate: '=',
       },
       templateUrl: '../templates/avgRating.html',
       link: function(scope, element, attrs) {
         scope.range = [1,2,3,4,5];
   
       }
     };
   });
 