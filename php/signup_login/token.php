<?php
   require '../connection.php';

   if(isset($_GET['token'])){
       $token = $_GET['token'];

       $update = "update users set status = 'Active' where uid = '$token'";
       $result = $conn->query($update);
       if($conn->error){
        echo "Error: " . $check . "<br>" . $conn->error;
      }
       if($result){
           header("location:http://localhost/#/login");
       }

   }
?>