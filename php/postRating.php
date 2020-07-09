<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$imageid = (int) $request->id;
$woneruid = $request->wonerUid;
$rate = (int) $request->rate;
$rateruid = $request->raterUid;
$time = $request->time;

if($imageid && $woneruid && $rate && $rateruid){
    $checksql = "SELECT *FROM rating where imageid='$imageid' and rateruid='$rateruid'";
    $cresult = $conn->query($checksql);
        if($conn->error){
            echo "Error: " . $cresult. "<br>" . $conn->error;
        }
    if($cresult->num_rows > 0){
        $updateSql = "UPDATE rating SET rate='$rate',time='$time' WHERE imageid='$imageid' and rateruid='$rateruid'";
        $uresult = $conn->query($updateSql);
            if($conn->error){
                echo "Error: " . $cresult. "<br>" . $conn->error;
            }
      
    }
    else{
        $insertSql = "INSERT INTO rating (imageid, woneruid,rate,rateruid,time) values('$imageid','$woneruid','$rate','$rateruid','$time')";
        $result = $conn->query($insertSql);
            if($conn->error){
                echo "Error: " . $insertSql. "<br>" . $conn->error;
            }

          
    }

    // Average Calculation
    $avgsql = "SELECT AVG(rate) AS avgrating FROM rating WHERE imageid='$imageid'";
    $aresult = $conn->query($avgsql);
            if($conn->error){
                echo "Error: " . $aresult. "<br>" . $conn->error;
            }
    $getData = array();
    if($aresult->num_rows >0){
        while($row = $aresult->fetch_assoc()){
                    $getData[] = $row;

        }

        $countSql = "SELECT rate FROM rating WHERE imageid='$imageid'";
        $countResult = $conn->query($countSql);
            if($conn->error){
                echo "Error: " . $aresult. "<br>" . $conn->error;
            }
            else{
                $totalRate = $countResult->num_rows;
                
            }
        $avgValue = $getData[0]['avgrating'];
        $insertPhoto = "UPDATE photos SET avgrating='$avgValue' , totalrate ='$totalRate' WHERE id='$imageid'";
        $presult = $conn->query($insertPhoto);
            if($conn->error){
                echo "Error: " . $presult. "<br>" . $conn->error;
            }
            
           
    }


    // Get Average Data 
    $avarageData = array();
    $getAvg = "SELECT avgrating, totalrate FROM photos WHERE id='$imageid'";
    $avgResult = $conn->query($getAvg);
        if($conn->error){
            echo "Error: " . $avgResult. "<br>" . $conn->error;
        }else{
            while($row = $avgResult->fetch_assoc()){
                $avarageData[] = $row;
            }
            echo json_encode($avarageData);
        }
         
  
            
}
?>