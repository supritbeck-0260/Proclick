<?php  
 require "connection.php"; 
$data = json_decode(file_get_contents("php://input"));
$row = $data->row;
$rowperpage = $data->rowperpage;

$getQuery = "select *from test3 order by id desc limit $row,$rowperpage";  
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