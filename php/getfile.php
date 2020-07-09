<?php  
 require "connection.php"; 
$data = json_decode(file_get_contents("php://input"));
$row = $data->row;
$myuid = $data->myuid;
$rowperpage = $data->rowperpage;
$getQuery = "select *from photos order by id desc limit $row,$rowperpage";  
 $result = $conn->query($getQuery); 
    if($conn->error){
        echo "Error: " . $getQeury . "<br>" . $conn->error;
    }
 
 $data = array();
 
 
 if($result){
     while($row = $result->fetch_assoc()){
         $imageid= $row["id"];
        $getRating = "SELECT rate FROM rating WHERE rateruid='$myuid' AND imageid='$imageid'";
        $rateResult = $conn->query($getRating);
            if($conn->error){
                echo "Error: " . $rateResult . "<br>" . $conn->error;
            }
            else{
                while($rate= $rateResult->fetch_assoc()){
                    $row = array_merge($row,$rate);
                }
            }
            $data[] = $row; 

     }
     echo json_encode($data);
 }
 ?>  