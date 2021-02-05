<?php
	$inData = getRequestInfo();
	
	$ID = $inData["ID"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Email = $inData["Email"];
	$PhoneNumber = $inData["PhoneNumber"];
	$UserID = $inData["UserID"];
	
	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "DELETE FROM ContactInfo (ID, FirstName, LastName, Email, PhoneNumber, UserID) VALUES (" . $ID . ",'" . $FirstName . ",'" . $LastName . ",'" . $Email . ",'" . $PhoneNumber . ",'" . $UserID . "')";
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}
		$conn->close();
	}
	
	returnWithError("");
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
