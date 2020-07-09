<?php
require 'connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$myuid = $request->myuid;
if($myuid ){
    $select = "SELECT *FROM rating WHERE (woneruid='$myuid' AND checked IS NULL) order by time desc";
    $result = $conn->query($select);
        if($conn->error){
            echo "Error: " . $select. "<br>" . $conn->error;
        }else{
            $data = array();
            // print_r($result->num_rows);
            if($result->num_rows>0){
                        while($row=$result->fetch_assoc()){
                            $rateruid = $row['rateruid'];
                            $selectRater = "SELECT name AS rater FROM users WHERE uid='$rateruid'";
                            $rateResult = $conn->query($selectRater);
                                if($conn->error){
                                    echo "Error: " . $select. "<br>" . $conn->error;
                                }else{
                                    while($rater=$rateResult->fetch_assoc()){
                                        $row = array_merge($row,$rater);
                                    }
                                }
                                $data[] = $row; 
                        }
            }else{
                $selectold = "SELECT *FROM rating WHERE woneruid='$myuid' order by time desc limit 5";
                $resultold = $conn->query($selectold);
                    if($conn->error){
                        echo "Error: " . $selectold. "<br>" . $conn->error;
                    }else{
                        while($row=$resultold->fetch_assoc()){
                            $rateruid = $row['rateruid'];
                            // print_r($resultold);
                            $selectRater = "SELECT name AS rater FROM users WHERE uid='$rateruid'";
                            $rateResult = $conn->query($selectRater);
                                if($conn->error){
                                    echo "Error: " . $selectRater. "<br>" . $conn->error;
                                }else{
                                    while($rater=$rateResult->fetch_assoc()){
                                        $row = array_merge($row,$rater);
                                    }
                                }
                                $data[] = $row; 
                        }
                        
                    }

            }
        }
 
    echo json_encode($data);
}

?>