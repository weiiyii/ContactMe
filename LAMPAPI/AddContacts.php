<?php
	$inData = getRequestInfo();

	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$sql = "insert into ContactInfo (FirstName, LastName, Email, Number, UserID) VALUES ('" . $inData["FirstName"]. "', '" . $inData["LastName"] . "', '" . $inData["Email"] . "', '" . $inData["Number"] . "', '" . $inData["UserID"] . "')";
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
