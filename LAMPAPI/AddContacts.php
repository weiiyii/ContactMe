<?php
	$inData = getRequestInfo();
	
	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "INSERT into ContactInfo (ID, FirstName, LastName, Email, PhoneNumber, UserID) VALUES (" . $inData["ID"] . ",'" . $inData["FirstName"]. "', '" . $inData["LastName"] . "', '" . $inData["Email"] . "', '" . $inData["PhoneNumber"] . "', '" . $inData["UserID"] . "')";
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