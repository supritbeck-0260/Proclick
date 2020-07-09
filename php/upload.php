<?php  
 require "connection.php"; 
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$fileinfo = $_POST['fileinfo'];
$uid = $_POST['uid'];
 if(!empty($_FILES))  
 {  

     $filename = $_FILES['file']['name'];
     // extracting extension
     $ext = pathinfo($filename,PATHINFO_EXTENSION);
     // image Name
     $image= time().date('dmY').'.'.$ext;
     // image path
     $path = '../upload/' .$image;
     $image = array("filename"=>$image);
      if(move_uploaded_file($_FILES['file']['tmp_name'], $path))  
      {  
          $fileinfo = json_encode(array_merge(json_decode($fileinfo,true),$image));
           $insertQuery = "INSERT INTO photos (uid,fileinfo) VALUES ('$uid','$fileinfo')"; 
           $getLastData = "SELECT *FROM photos order by id desc limit 1"; 
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