<?php

//---------------------
// Connection parameters

$hname = "localhost"; //"192.168.10.5";
$dname = 'cogscinl_czielinski';

$usern =  'cogscinl_czielin';  //"root";
$pword =  'w@4hBL]+Iq7U'; //"Y4sur";

$dsn = 'mysql:host=' . $hname . ';dbname=' . $dname . ';charset=utf8';


//---------------------
// Database connection

try {
    $dba = new PDO($dsn, $usern, $pword);
    echo "Connected to database"; // check for connection
    }
catch(PDOException $e)
    {
    echo $dba . "<br>" . $e->getMessage();  
    }
	
?>