<?php
require '../connection.php';
$postdata = file_get_contents("php://input");
$user = json_decode($postdata);

if($user){
    $email = $user->email;
    $password = $user->password;
    // select query
    $email_search = "select *from alluser where email='$email' AND status = 'Active'";
    // check if email exits
    $result = $conn->query($email_search);
    if($conn->error){
        echo "Error: " . $check . "<br>" . $conn->error;
    }
    //when Email found
    if($result->num_rows)
        {
            $userdata = $result->fetch_assoc();
            $passwd = $userdata['password'];
            // Password verification
            if(password_verify($password,$passwd)){
                echo "success"; 
                // $_SESSION['name'] = $userdata['name'];
                // header("Location:http://localhost/profile");
            }
            else{
                echo "Wrong Password";
            }
            
        }
    else{
        echo "Email Does not exist";
    }
}
?>