<?php
	$inData = getRequestInfo();
	
	$id = $inData["ID"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Email = $inData["Email"];
	$PhoneNumber = $inData["PhoneNumber"];
	$UserId = $inData["UserId"];
	
	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "delete from ContactInfo (ID,FirstName,LastName,Email,PhoneNumber,UserId) VALUES (" . $id . ",'" . $FirstName . ",'" . $LastName . ",'" . $Email . ",'" . $PhoneNumber . ",'" . $UserId . "')";
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
