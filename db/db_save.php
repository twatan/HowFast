<?php

// Saving the data to mySQL database - using PDO 
//
// jsPsych data are submitted as a unique string (json-encoded object)
//
// In the main script (where experiment is defined) :
//
/*  function save_data(data){   
    // adapted from J. de Leeuw (jsPsych tutorial)

        $.ajax({
          type:'post',
          cache: false,
          url: 'dbsav/db_save.php', // THIS SCRIPT 
          data: {
             subjid: subjectID,         // (based on the starting date)
             json: JSON.stringify(data) // json-encoded object
            },
       });

    }

    // ...

    jsPsych.init({
        experiment_structure: experiment,
        on_finish: function(){    
            var alldata = jsPsych.data.getData();           
            save_data(alldata); 
        }   
    });
*/
// The database must contain the data table "hf_data" with 3 column (ID, subjID, jsonData)

include("db_connect.php")

// return dba object


//---------------------
// Get the data submitted in the main experiment script 
// by POST method (using jQuery.ajax)

// subject ID 
$id = $_POST['subjid'];

// json jsPsych data
$uinfo = $_POST['subjinfo'];

// json jsPsych data
$jsdata = $_POST['json'];


//---------------------
// Insert it into the data table (hf_data)

try {
	// $req is for requete
    $req = $dba->prepare('INSERT INTO :dbn(subjID, subjinfo, jsonData) 
                            VALUES(:subjID, :subjinfo, :jsonData)'); 

    $req->execute(array(
		'dbn' => $dname,
        'subjID' => $id,
        'subjinfo' => $uinfo,
        'jsonData' => $jsdata
    ));

    echo 'Insertion OK !';

    }
catch(PDOException $e)
    {
    echo $req . "<br>" . $e->getMessage();
    }


//---------------------
// Disable the connection

$dba = null;

?>