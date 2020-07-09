<?php
session_start();
require '../connection.php';
$postdata = file_get_contents("php://input");
$user = json_decode($postdata);
if($user){
    $email = $user->email;
    $password = $user->password;
    // select query
    $email_search = "select *from users where email='$email' AND status = 'Active'";
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
            $data = array();
            if(password_verify($password,$passwd)){
                $_SESSION['uid'] = $userdata['uid'];
                $name = $userdata['name'];
                $uid = $userdata['uid'];
                echo json_encode(array_merge(array("name"=>$name,"uid"=>$uid)));;

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