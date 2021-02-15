<?php

	$inData = getRequestInfo();

	$searchResults = "";
	$searchCount = 0;
	$searchType = $inData['searchT'];

	$conn = new mysqli("localhost", "Admin", "admin123", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
			$sql = "SELECT * FROM ContactInfo WHERE $searchType like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
			$result = $conn->query($sql);
				if ($result->num_rows > 0)
				{
					while($row = $result->fetch_assoc())
					{
						if( $searchCount > 0 )
						{
							$searchResults .= ",";
						}
						$searchCount++;
						$searchResults .= '"' . $row["FirstName"] . '","' . $row["LastName"] . '","' . $row["Email"] . '","' . $row["Number"] . '","' . $row["DateCreated"] . '","' . $row["ID"] . '"';
					}
				}
				else
				{
					returnWithError();
				}
				$conn->close();
	}

	returnWithInfo( $searchResults );

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError()
	{
		$retValue == '{"results":["EMPTY|NULL"],"error":""}';;
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
