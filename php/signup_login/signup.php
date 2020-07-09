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

 //Token generator
//  $token = bin2hex(random_bytes(15));
$token = md5($email);

if($user){
    $check = "select *from users where email='$email'";
    $insert = "insert into users (name, email, gender, password, date , uid , status,profilepic) values ('$name','$email', '$gender', '$password','$date', '$token', 'Inactive','')";
    
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
            http://localhost/php/signup_login/token.php?token=$token";
            $headers = "From: supritbeck@gmail.com";

            if (mail($to_email, $subject, $body, $headers)) {
                echo "Email successfully sent to $to_email... Plsease verify Your email.";
            } else {
                echo "Email sending failed...";
            }
            
        }
    }
    }

    


?>