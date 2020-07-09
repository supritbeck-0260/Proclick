<?php  
 require "connection.php"; 

$getQuery = "select *from test3U ORDER BY id DESC";  
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