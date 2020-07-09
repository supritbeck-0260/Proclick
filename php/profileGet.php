<?php  
 require "connection.php"; 
 $request = file_get_contents("php://input");
 $uid = $request;
$getQuery = "select *from users where uid='$uid'";  
 $result = $conn->query($getQuery); 
 if($conn->error){
     echo "Error: " . $getQeury . "<br>" . $conn->error;
 }
 
 $data = array();
 
 if($result){
     while($row = $result->fetch_assoc()){
         $data[] = $row;
     }
     echo json_encode($data);
 }
 ?>  