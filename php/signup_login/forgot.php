<?php
require '../connection.php';
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$email = $request->email;
if($email){
    $check = "select *from users where email='$email'";
    $cresult = $conn->query($check);
        if($conn->error){
            echo "Error: " . $check . "<br>" . $conn->error;
        }
    if($cresult->num_rows >0){
            $getUid = "SELECT uid FROM users WHERE email='$email'";
            $gresult = $conn->query($getUid);
            if($conn->error){
                echo "Error: " . $getUid . "<br>" . $conn->error;
            }else{
                $data = array();
                while($row= $gresult->fetch_assoc()){
                    $data[] = $row;
                }

                $uid= $data[0]['uid'];
                //Reset Password Mail
                $to_email = $email;
                $subject = "Reset Password";
                $body = "Please click on the link to reset your password. 
                http://localhost/#/recover/$uid";
                $headers = "From: supritbeck@gmail.com";

                if (mail($to_email, $subject, $body, $headers)) {
                    echo "Email successfully sent to $to_email...";
                } else {
                    echo "Email sending failed...";
                }
            }

    }else{
            echo "Email Does not Exists.";
        }
    
}
?>