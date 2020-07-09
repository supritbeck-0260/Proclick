<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = (int) $postdata;
    if($id){
        $delete = "delete from test3 where id=$id";
        $reslut = $conn->query($delete);
        if($conn->error){
            echo "Error: " . $insertQuery. "<br>" . $conn->error;
        }
    }
?>
