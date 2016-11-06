var orderID;
var order;
var items;
var count = 0;
var checked;
var name, address, phone, mileage;
var store = ("575 Meyers St, Kettle Falls WA 99141");

// TODO: GET THE STORE ADDRESS AND USE IT IN THE GOOGLE API.

$( document ).ready(function() {
	hideAll();

	$("#infoButton").on("click", function(e) {
		e.preventDefault();

		name = $("#name").val();
		address = $("#address").val() + ", " + $("#city").val() + ", " +
		$("#state").val() + " " + $("#zip").val();
		phone = $("#number").val();

		// declare geocoder and distance matrix
		var geocoder = new google.maps.Geocoder();
		var service = new google.maps.DistanceMatrixService;

		// geocode and return formatted address
		geocoder.geocode({ "address": address }, function(results, status) {
			if (status === "OK") {
				address = results[0].formatted_address;
				// trigger the save info post to save formatted address -- temp
				$(document).trigger("trigger-matrix");
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});

		// check for distance from store
		$(document).on("trigger-matrix", function() {
		service.getDistanceMatrix({
			origins: [address],
			destinations: [store], // this is the store destination
			travelMode: 'DRIVING',
			unitSystem: google.maps.UnitSystem.IMPERIAL,
			avoidHighways: false,
			avoidTolls: false
		}, function(response, status) {
			if (status === "OK") {
				mileage = response.rows[0].elements[0].distance.text;
				$(document).trigger("trigger-distance");
			} else {
				alert("Error : " + status);
			}
		});
	});

	$(document).on("trigger-distance", function() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/api/checkDistance",
		data: {distance: mileage}
	}).done(function(result) {
		if (result.error === true) {
			alert(result.message);
			return console.error(result.message);
		}
		// do something with the success, like show a link
		console.log(result);
		if (result !== true) {
			// TODO: probably throw an error or something
			alert("You're to far away for delivery");
		} else {
			$(document).trigger("trigger-post");
		}

	}).fail(function(err) {
		// do something with the failure, like laugh at the user
		window.alert("hahahahaha! NO!");
		console.error(err);
	});
});

	$(document).on("trigger-post", function() {
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "/api/info",
			data: {order: order, name: name, address: address, phone: phone},
		}).done(function(result) {
				if (result.error === true) {
					alert(result.message);
				return console.error(result.message);
				}
			// do something with the success, like show a link
			console.log(result);
			$("#deliveryInfo").hide();
			$("#one").show("fade");
			getAllItems();
		}).fail(function(err) {
			// do something with the failure, like laugh at the user
			window.alert("hahahahaha! NO!");
			console.error(err);
	 });
	});

	});

	$("#cartButton").on("click", function(e) {
		e.preventDefault();

		var add;
		var uncheck;

		for (var i = 0; i < count; i++) {
			if ($(`#item${i}`).prop("checked") == true) {
				uncheck = `#item${i}`;
				add = items[i].value;
			}
		}

		if (add != null) {
			$.ajax({
				type: "POST",
				dataType: "json",
				url: "/api/addItem",
				data: {item: add, order: order},
			}).done(function(result) {
				if (result.error === true) {
					alert(result.message);
					return console.error(result.message);
				}
				// do something with the success, like show a link
				add = null;
				$("input.checkbox").not(this).prop('checked', false);
				console.log(result);
			}).fail(function(err) {
				// do something with the failure, like laugh at the user
				window.alert("hahahahaha! NO!");
				console.error(err);
			});
		}
	});

function hideAll() {
	$("#one").hide();
	$("#two").hide();
}

function getAllItems() {
	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/api/items",
	}).done(function(result) {
		if (result.error === true) {
			alert(result.message);
			return console.error(result.message);
		}
		// do something with the success, like show a link
		items = result;
		console.log(result);
		for(var i = 0; i < result.length; i++) {

			$("#content").append(`<tr><th scope="row"><input type="checkbox" class="checkbox" id="item${count}"></th><td>${result[i].value.name}</td>
				<td>${result[i].value.category}</td><td>${result[i].value.description}</td>
				<td>${result[i].value.price}</td></tr>`);

			count++
		}
	}).fail(function(err) {
		// do something with the failure, like laugh at the user
		window.alert("hahahahaha! NO!");
		console.error(err);
 });
}
});
