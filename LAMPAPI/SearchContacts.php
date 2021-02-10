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
		switch($searchType){
			case "firstName":
				$sql = "SELECT FirstName FROM ContactInfo WHERE FirstName like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
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
						$searchResults .= '"' . $row . '"';
					}
				}
				else
				{
					returnWithError( "No Records Found" );
				}
				$conn->close();
				break;
			case "lastname":
				$sql = "SELECT LastName FROM ContactInfo WHERE LastName like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
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
						$searchResults .= '"' . $row . '"';
					}
				}
				else
				{
					returnWithError( "No Records Found" );
				}
				$conn->close();
				break;
				case "email":
					$sql = "SELECT Email FROM ContactInfo WHERE Email like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
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
							$searchResults .= '"' . $row . '"';
						}
					}
					else
					{
						returnWithError( "No Records Found" );
					}
					$conn->close();
					break;
					case "phoneNumber":
						$sql = "SELECT Number FROM ContactInfo WHERE Number like '%" . $inData["search"] . "%' and UserID=" . $inData["userId"];
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
								$searchResults .= '"' . $row . '"';
							}
						}
						else
						{
							returnWithError( "No Records Found" );
						}
						$conn->close();
						break;
					default:
						echo "Testing"
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

	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}

?>
