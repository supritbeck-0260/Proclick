<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = (int) $request->id;
$fileinfo = $request->fileinfo;
    if($id){
        $update = "update photos set fileinfo='$fileinfo' where id=$id";
        $fetch = "select *from photos where id=$id";
        // update query
        $conn->query($update);
        if($conn->error){
            echo "Error: " . $update. "<br>" . $conn->error;
        }
        //fetch that id query
        $result= $conn->query($fetch);
        if($conn->error){
            echo "Error: " . $update. "<br>" . $conn->error;
        }
        
    if($result->num_rows){
        while($row = $result->fetch_assoc()){
            $data[] = $row;
        }
        echo json_encode($data);
    }
    
    }
?>
