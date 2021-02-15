var urlBase = 'http://www.instacontact.live/LAMPAPI';
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
		// window.location.href = "index.html";
		window.location.assign("http://www.instacontact.live/index.html");
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

function doDelete(row){
	var jsonPayload = '{"ID" : "' + row + '","UserID" : ' + userId + '}';
	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				SearchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactDelUpResult").innerHTML = err.message;
	}
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

	var contactList = '<thead><tr id="Table_Row_0">\n<th>First</th>\n<th>Last</th>\n<th>Email</th>\n<th>Number</th>\n<th>Date Created</th>\n<th>Delete</th>\n<th>Update</th>\n</tr>\n</thead>\r\n<tbody>\n';

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
				// contactList += `<tr id="Table_Row_1">\n<td contenteditable='true' id = "td_0">${jsonObject.results[0]}</td>`;
				var row_cnt = 1;
				for( var i=0; i<jsonObject.results.length; i++ ){
					if (jsonObject.results[0] == "EMPTY|NULL"){
						var myObj = document.getElementById("contactList");
						myObj.remove();
						document.getElementById("contactSearchResult").innerHTML = "Contact(s) have not been found";
						break;
					}
					// first name

					contactList += `<tr id="Table_Row_${row_cnt}">\n`;

					contactList += `<td contenteditable='true' id = "td_0" data-title="First Name: " scope="row">${jsonObject.results[i]}</td>`
					i++;
					// last name
					contactList += `<td contenteditable='true' id = "td_1"
					data-title="Last Name: ">${jsonObject.results[i]}</td>`;
					i++;
					// email
					contactList += `<td contenteditable='true' id = "td_2" data-title="Email: ">${jsonObject.results[i]}</td>`;
					i++;
					// phone num
					contactList += `<td contenteditable='true' id = "td_3"
					data-title="Phone Number: ">${jsonObject.results[i]}</td>`;
					i++;
					// date
					contactList += `<td id = "td_4"
					data-title="Date Created: ">${jsonObject.results[i]}</td>`;
					i++;

					// delete
					contactList += `<td id="td_5"><button type="button" id="deleteButton" class="btn btn-outline-danger" style="border: 2px solid; font-weight:500" onclick="doDelete(${jsonObject.results[i]});"> Delete </button></td>`;
					// update
					contactList += `<td id="id_6"><button type="button" id="updateButton" class="btn btn-outline-primary" style="border: 2px solid; font-weight:500" onclick="updateContact(${jsonObject.results[i]},${(((i+1)/6))});"> Update </button></td>\n</tr>\r\n`;



					// update
					// contactList += `<td >${jsonObject.results[i]}</td>\n</tr>\n`;

					row_cnt++;

					// if((i+1)%6==0){
					// 	contactList += `<td><button type="button" id="deleteButton" class="btn btn-outline-primary" style="border: 2px solid; font-weight:500" onclick="doDelete(${jsonObject.results[i]});"> Delete </button></td>`;
					// 	contactList += `<td><button type="button" id="updateButton" class="btn btn-outline-primary" style="border: 2px solid; font-weight:500" onclick="updateContact(${jsonObject.results[i]},${(((i+1)/6)-1)});"> Update </button></td>`;
					// 	contactList += `</tr>\r\n`;
					// }
					// else if((i+2)%6==0){
					// 		contactList += `<td>${jsonObject.results[i]}</td>`;
					// }
					// else{
					// 	contactList += `<td contenteditable='true' id = "td_${i}">${jsonObject.results[i]}</td>`;
					// 	}

				}
				contactList += "</tbody>\r\n";

				document.getElementsByTagName("table")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementsById("contactList").innerHTML = "Error";
	}

}

function updateContact(php_row,row){
	var newFname = document.getElementById(`Table_Row_${row}`).cells[0].innerHTML;
	var newLname = document.getElementById(`Table_Row_${row}`).cells[1].innerHTML;
	var newEmail = document.getElementById(`Table_Row_${row}`).cells[2].innerHTML;
	var newPhone = document.getElementById(`Table_Row_${row}`).cells[3].innerHTML;
	document.getElementById("contactSearchResult").innerHTML = "";

	var jsonPayload = '{"FirstName" : "' + newFname + '","LastName" : "' + newLname + '","Email" : "' + newEmail + '","Number" : "' + newPhone + '", "ID" : ' + php_row + '}';
	var url = urlBase + '/UpdateContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact has been Updated";
				SearchContacts();
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}
