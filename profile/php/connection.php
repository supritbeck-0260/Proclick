<?php
$servername = "localhost";
$username = "root";
$dbname = "users";
$password = "";
// Create connection
$conn = mysqli_connect($servername, $username,$password,$dbname );
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
    }
?>