<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$id = (int) $postdata;
    if($id){
        $select = "select *from photos where id=$id";
        $reslut = $conn->query($select);
        if($conn->error){
            echo "Error: " . $select. "<br>" . $conn->error;
        }else{
            $data = array();
            while($row= $reslut->fetch_assoc()){
                $getRating = "SELECT rate FROM rating WHERE imageid='$id'";
                $rateResult = $conn->query($getRating);
                if($conn->error){
                    echo "Error: " . $rateResult . "<br>" . $conn->error;
                }
                else{
                    while($rate= $rateResult->fetch_assoc()){
                        $row = array_merge($row,$rate);
                        
                    }
                    $data[] = $row;
                } 
                
            }
            
        }
        
        echo json_encode($data);
    }
?>