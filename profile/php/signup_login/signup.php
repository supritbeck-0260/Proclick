<?php
require '../connection.php';
$postdata = file_get_contents("php://input");
$user = json_decode($postdata);

$name =mysqli_real_escape_string($conn, $user->name);
$email =mysqli_real_escape_string($conn, $user->email);
$gender =mysqli_real_escape_string($conn,$user->gender);
$password = mysqli_real_escape_string($conn,$user->password);
$password =password_hash($password, PASSWORD_BCRYPT);
$date = mysqli_real_escape_string($conn,$user->date);
// echo $date;
// echo $user->name;
// echo $user->email;
// echo $user->password;
// echo $user->gender;

 //Token generator
 $token = bin2hex(random_bytes(15));

if($user){
    $check = "select *from alluser where email='$email'";
    $insert = "insert into alluser (name, email, gender, password, date , token , status) values ('$name','$email', '$gender', '$password','$date', '$token', 'Inactive')";
    
    // Check If email is available
    $cresult = $conn->query($check);
    if($conn->error){
        echo "Error: " . $check . "<br>" . $conn->error;
    }
    
    if($cresult->num_rows >0){
        echo "Email already Exits ";
    }else{
        $iresult = $conn->query($insert);
        if($conn->error){
            echo "Error: " . $check . "<br>" . $conn->error;
        }
        else{  
                   
           // Send Activation Email
            $to_email = $email;
            $subject = "Activate Email";
            $body = "Hi $name. , Please click on the link to activate your Account. 
            http://localhost/profile/php/signup_login/token.php?token=$token";
            $headers = "From: supritbeck@gmail.com";

            if (mail($to_email, $subject, $body, $headers)) {
                echo "Email successfully sent to $to_email...";
            } else {
                echo "Email sending failed...";
            }
            
        }
    }
//Insert Form into Database
    }
    // Check If email is available
    


?>