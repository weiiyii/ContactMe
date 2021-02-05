<?php
	/* Register JSON payload format:
	{
		"fname" : "",
		"lname" : "",
		"phone" : "",
		"login" : "",
		"password" : ""
	}*/

	/* data creation */
	// assign json payload to variable "inData" as an associative array (key,value)
	$inData = getRequestInfo();

	// instantiate some variables to be returned in the output json payload
	$fname = $inData["fname"];
	$lname = $inData["lname"];
	$phone = $inData["phone"];
	$login = $inData["login"];
	$pass = $inData["password"];

	// initialize a variable to connect this script to the mySQL database
	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");

	/* modelled off AddColor, create a new user in the Users table */
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		// mySQL statement to create a new user in the Users table with values from the input json payload
		$sql = "insert into Users (FirstName,LastName,PhoneNum,Login,Password) VALUES
			('" . $fname . "','" . $lname . "','" . $phone . "','" . $login . "','" . $pass . "')";
		// if not able to create a new user
		if( $result = $conn->query($sql) != TRUE )
		{
			returnWithError( $conn->error );
		}

		// closes database connection, no matter if an error occured or not, at the end of querying to free resources
		$conn->close();
	}

	// a json package with just ""error" : """ indicates the user was successfully added
	returnWithError("");


	/* helper functions */
	function getRequestInfo()
	{
		// function file_get_contents turns the input json payload into a string
		// function json_decode turns the string into an associative array
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $firstName, $lastName, $id )
	{
		// construct the output json payload
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
