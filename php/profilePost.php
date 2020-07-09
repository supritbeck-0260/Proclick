<?php  
 require "connection.php"; 
$uid = $_POST['uid'];

 if(!empty($_FILES))  
 {  

     $filename = $_FILES['file']['name'];
     // extracting extension
     $ext = pathinfo($filename,PATHINFO_EXTENSION);
     // image Name
     $image= time().date('dmY').'.'.$ext;
     // image path
     $path = '../img/' .$image;
      if(move_uploaded_file($_FILES['file']['tmp_name'], $path))  
      {  
           $insertQuery = "update users set profilepic='$image' where uid='$uid'"; 
           $result = $conn->query($insertQuery);
           //Connection Error
           if($conn->error){
               echo "Error: " . $insertQuery. "<br>" . $conn->error;
           }
           echo " No of rows affected= $result";
      }  
 }  
 else  
 {  
      echo 'Some Error';  
 }  
 ?>  