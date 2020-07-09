<?php  
 require "connection.php"; 
$data = json_decode(file_get_contents("php://input"));
if($data->search){
    $getQuery = "select name, uid from users where name like '%$data->search%' limit 5";  
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