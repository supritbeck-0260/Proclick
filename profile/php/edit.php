<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = (int) $request->id;
$name = $request->name;
    if($id && $name){
        $update = "update test3 set name='$name' where id=$id";
        $fetch = "select *from test3 where id=$id";
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
