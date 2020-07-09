<?php  
 require "connection.php"; 
$request = json_decode(file_get_contents("php://input"));
$myuid = $request->myuid;
$getQuery = "select name,date,profileinfo from users where uid='$myuid'";  

 $result = $conn->query($getQuery); 
    if($conn->error){
        echo "Error: " . $getQeury . "<br>" . $conn->error;
    }else{
        if($result){
            $data = array();
            while($row = $result->fetch_assoc()){
                $getRating = "SELECT AVG(rate) AS avgProfileRating FROM rating WHERE woneruid='$myuid'";
                $rateResult = $conn->query($getRating);
                if($conn->error){
                echo "Error: " . $getRating . "<br>" . $conn->error;
                }else{
                        if($rateResult){
                            $rateData = array();
                            while($rateRow = $rateResult->fetch_assoc()){ 
                                $data= array_merge($row,$rateRow);
                            }
                    }
                    }
            }
                
    
    }

 
     echo json_encode($data);
 }
 ?>  