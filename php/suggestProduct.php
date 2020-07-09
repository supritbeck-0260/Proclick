<?php  
 require "connection.php"; 
 $request = file_get_contents("php://input");
if($request){
    $getQuery = "select *from product where productName like '%$request%' limit 5";  
    $result = $conn->query($getQuery);
    if($conn->error){
        echo "Error: " . $getQeury . "<br>" . $conn->error;
    }else{
        $data = array();
        if($result->num_rows > 0){
            while($row = $result->fetch_assoc()){
                $data[] = $row;
            }
            echo json_encode($data);
        }
    }
}
 ?>