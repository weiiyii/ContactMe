<?php
	$inData = getRequestInfo();

	$ID = $inData["ID"];
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Email = $inData["Email"];
	$Number = $inData["Number"];
	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "UPDATE ContactInfo SET FirstName='" . $inData["FirstName"]. "', LastName='" . $inData["LastName"] . "', Email='" . $inData["Email"] . "', Number='" . $inData["Number"] . "' WHERE ID = $ID";
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
