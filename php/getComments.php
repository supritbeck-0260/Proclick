<?php  
 require "connection.php"; 
$request = json_decode(file_get_contents("php://input"));

$imageid= $request->id;
$row = $request->row;
$rowperpage = $request->rowperpage;
if($imageid){
    $getsql = "SELECT *FROM comments where imageid='$imageid' order by id desc limit $row,$rowperpage";
    $result = $conn->query($getsql);
    if($conn->error){
        echo "Error: " . $getsql . "<br>" . $conn->error;
    }else{
        $data = array();
        while($row = $result->fetch_assoc()){
            $data[] = $row;
        }
        echo json_encode($data);
    }
}
 ?>