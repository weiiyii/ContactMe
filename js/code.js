var urlBase = 'http://138.197.107.203/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;
	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	// var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}'; plaintext Payload
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse( xhr.responseText );

		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;

		saveCookie();

		// NOT DIRECTING TO landing.html ??
		window.location.href = "landing.html";
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	var fname = document.getElementById("fname").value;
	var lname = document.getElementById("lname").value;
	var phone = document.getElementById("phone").value;
	var login = document.getElementById("registerLogin").value;
	var password = document.getElementById("registerPassword").value;
	var hash = md5( password );

	var jsonPayload = '{"fname" : "' + fname + '", "lname" : "' + lname + '", "phone" : "' + phone + '", "login" : "' + login + '", "password" : "' + hash + '"}';

	var url = urlBase + '/Register.' + extension;

	var xhr = new XMLHttpRequest();

	// false: check login/phone number duplication?
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	// valid creation
	try{
		xhr.send(jsonPayload);

		var jsonObject = JSON.parse(xhr.responseText);

		userId = jsonObject.id;

	}

	// else
	catch(err){
		document.getElementById("registerResult").innerHTML = err.message;
	}




}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function AddContacts()
{
	var newFname = document.getElementById("contactText_fname").value;
	var newLname = document.getElementById("contactText_lname").value;
	var newEmail = document.getElementById("contactText_email").value;
	var newPhone = document.getElementById("contactText_phone").value;
	document.getElementById("contactAddResult").innerHTML = "";

	var jsonPayload = '{"FirstName" : "' + newFname + '","LastName" : "' + newLname + '","Email" : "' + newEmail + '","Number" : "' + newPhone + '", "UserID" : ' + userId + '}';
	var url = urlBase + '/AddContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function SearchContacts()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	var srchType = document.getElementById("SearchT").value;

	var contactList = "";

	var jsonPayload = '{"search" : "' + srch + '","searchT" : "' + srchType + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ ){
				contactList += jsonObject.results[i];
				newList = contactList[i]["FirstName"]+contactList[i]["LastName"]+contactList[i]["Email"]+contactList[i]["Number"];
				if(i<jsonObject.results.length - 1){
					newList += "<br />\r\n";
				}
			}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}
