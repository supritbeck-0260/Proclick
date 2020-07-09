<?php
require 'connection.php';
$select = "select *from list";
$result = $conn->query($select);
if($conn->error){
    echo "Error: " . $check . "<br>" . $conn->error;
}

$data = array();

if($result->num_rows > 0){
    while($row = $result->fetch_assoc()){
        $data[] = $row;
    }
    echo json_encode($data);
}


?>