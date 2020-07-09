<?php  
 require "connection.php"; 
$data = json_decode(file_get_contents("php://input"));
if($data->id){
    $postQuery = "INSERT INTO comments (imageid,uid,name,comment,time) VALUES('$data->id','$data->uid','$data->name','$data->comment','$data->time')";
    $getQuery = "SELECT *FROM comments WHERE imageid='$data->id' order by id desc limit 1";
    $presult = $conn->query($postQuery);
    if($conn->error){
        echo "Error: " . $postQuery . "<br>" . $conn->error;
    }else{
        $gresult = $conn->query($getQuery);
        if($conn->error){
            echo "Error: " . $getQuery . "<br>" . $conn->error;
        }else{
            $cData = array();
            while($row= $gresult->fetch_assoc()){
                $cData[] = $row;
            }
        }
        echo json_encode($cData);
    }
}

?>