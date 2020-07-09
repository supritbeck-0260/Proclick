<?php  
 require "connection.php"; 
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$name = $_POST['name'];
$time = $_POST['time'];
 if(!empty($_FILES))  
 {  

     $filename = $_FILES['file']['name'];
     // extracting extension
     $ext = pathinfo($filename,PATHINFO_EXTENSION);
     // image Name
     $image= time().date('dmY').'.'.$ext;
     // image path
     $path = '../upload/' .$image;
      if(move_uploaded_file($_FILES['file']['tmp_name'], $path))  
      {  
           $insertQuery = "INSERT INTO test3 (name,img,time) VALUES ('$name','$image','$time')"; 
           $getLastData = "SELECT *FROM test3 order by id desc limit 1"; 
           $result = $conn->query($insertQuery);
           //Connection Error
           if($conn->error){
               echo "Error: " . $insertQuery. "<br>" . $conn->error;
           }
           $result = $conn->query($getLastData);
           //Connection Error
           if($conn->error){
               echo "Error: " . $getLastData. "<br>" . $conn->error;
           }
           $data = array();
 
          if($result){
               while($row = $result->fetch_assoc()){
               $data[] = $row;
               }
               echo json_encode($data);
          }
           
      }  
 }  
 else  
 {  
      echo 'Some Error';  
 }  
 ?>  