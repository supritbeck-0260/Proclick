<?php
require 'connection.php';
$request = json_decode(file_get_contents("php://input"));
if($request->name){
    $check = "SELECT *FROM lens WHERE productName='$request->name'";
    $cresult = $conn->query($check);
    if($conn->error){
        echo "Error: " . $check. "<br>" . $conn->error;
    }else{
       if($cresult->num_rows > 0){
            $update = "UPDATE lens SET link='$request->link' WHERE productName='$request->name'";
            $uresult = $conn->query($update);
            if($conn->error){
                echo "Error: " . $update. "<br>" . $conn->error;
            }else{
                echo "$request->name Link Updated.";
            }

       }else{
            $sql = "INSERT INTO lens (productName,link) VALUES('$request->name','$request->link')";
            $result = $conn->query($sql);
            if($conn->error){
                echo "Error: " . $sql. "<br>" . $conn->error;
            }else{
                echo "Saved to Database";
            }
       } 
    }

    
}
?>