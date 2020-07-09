<?php
require 'connection.php';
$request = json_decode(file_get_contents("php://input"));
$myuid = $request->myuid;
if($myuid){
    $update = "UPDATE rating SET checked='Y'  WHERE woneruid='$myuid'";
    $result = $conn->query($update);
        if($conn->error){
            echo "Error: " . $update . "<br>" . $conn->error;
        }
}
?>