<?php
require '../connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$uid = $request->uid;
$password = mysqli_real_escape_string($conn,$request->password);
$password =password_hash($password, PASSWORD_BCRYPT);

if($uid){
    $update = "UPDATE users SET password='$password' WHERE uid='$uid'";
    $result = $conn->query($update);
        if($conn->error){
            echo "Error: " . $check . "<br>" . $conn->error;
        }

    echo "password updated successfully. Please login.";
}

?>