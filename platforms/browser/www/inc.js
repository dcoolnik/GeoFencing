// PhoneGap
function testService() {
	console.log("in test service")
	alert("TestService")
	var xhrGet = new XMLHttpRequest();
	var url = "http://4652a01a.ngrok.io/GeoFencing/webresources/geo/testService";
	xhrGet.open("GET", url, true);
	xhrGet.onreadystatechange = function () {
		if (xhrGet.readyState == 4 && xhrGet.status == 200) {
			alert("Response: " + xhrGet.responseText)
		}
	}
	xhrGet.send();
}

function getLocation() {
	console.log("in getlocation")
	navigator.geolocation.getCurrentPosition(onSuccess, onError, { enableHighAccuracy: true });
}
// onSuccess Geolocation
//
function onSuccess(position) {

	console.log('onSuccess')

	$('#geolocation').html('Latitude: ' + position.coords.latitude + '<br />' +
		'Longitude: ' + position.coords.longitude + '<br />' +
		'Altitude: ' + position.coords.altitude + '<br />' +
		'Accuracy: ' + position.coords.accuracy + '<br />' +
		'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '<br />' +
		'Heading: ' + position.coords.heading + '<br />' +
		'Speed: ' + position.coords.speed + '<br />' +
		'Timestamp: ' + position.timestamp + '<br />');

	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var mapOptions = {
		center: new google.maps.LatLng(latitude, longitude),
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var xhr = new XMLHttpRequest();
	var url = "http://4652a01a.ngrok.io/GeoFencing/webresources/geo/submitGeoCord";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json = JSON.parse(xhr.responseText);
			console.log(json.email + ", " + json.name)
		}
	}
	var data = JSON.stringify({
		"Latitude": position.coords.latitude,
		"Longitude": position.coords.longitude,
		"Altitude": position.coords.altitude,
		"Accuracy": position.coords.accuracy,
		"Altitude Accuracy": position.coords.altitudeAccuracy,
		"Heading": position.coords.heading,
		"Speed": position.coords.speed,
		"Timestamp": position.timestamp
	});
	xhr.send("metadata=" + data);
}

// onError Callback receives a PositionError object
//
function onError(error) {
	var element = document.getElementById('geolocation');
	element.innerHTML = 'code: ' + error.code + '\n' +
		'message: ' + error.message + '\n';
}

function sendData() {
	var username = document.forms['loginForm'].elements['username'].value;
	var password = document.forms['loginForm'].elements['password'].value;

	var loginRequest = new XMLHttpRequest();
	var url = "http://4652a01a.ngrok.io/GeoFencing/webresources/geo/login";
	loginRequest.open("POST", url, true);
	loginRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	loginRequest.onreadystatechange = function () {
		if (loginRequest.readyState == 4 && loginRequest.status == 200) {
			var response = loginRequest.responseText;
			//alert("user: " + response)
			if (response == "admin") {
				var userListRequest = new XMLHttpRequest();
				var url = "http://4652a01a.ngrok.io/GeoFencing/webresources/geo/getUserList";
				userListRequest.open("GET", url, true);
				userListRequest.onreadystatechange = function () {
					if (userListRequest.readyState == 4 && userListRequest.status == 200) {
						var response = JSON.parse(userListRequest.response);
						alert("userList: " + JSON.stringify(response))
						populateTable(response);
					}
				}
				userListRequest.send();
			}
		}
	}
	loginRequest.send("username=" + username + "&password=" + password);
}

function populateTable(userList) {
	var $table = $("<table></table>");
	var $header = $("<th>Available Users</th>");
	$table.append($header);

	for (var i = 0; i < userList.length; i++) {
		var user = userList[i];
		var $line = $("<tr></tr>");
		$line.append($("<td></td>").html(user));
		$table.append($line);
	}

	$table.appendTo($("#userListTable"));
}