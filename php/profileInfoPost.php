<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$profileinfo =mysqli_real_escape_string($conn, $request->profileinfo);
$uid= $request->uid;
echo $profileinfo;
// echo $postdata;
    $insert = "update users set profileinfo='$profileinfo' where uid='$uid'";
    $result = $conn->query($insert);
    if($conn->error){
        echo "Error: " . $insert. "<br>" . $conn->error;
    }
    else{
        echo "inserted successfully";
    }
?>