<?php  
 require "connection.php"; 
// $postdata = file_get_contents("php://input");
// $request = json_decode($postdata);

// $name = $_POST['name'];
// $time = $_POST['time'];
echo $_FILES['file']['name'];
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
           $insertQuery = "INSERT INTO test3U (img) VALUES ('$image')"; 
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