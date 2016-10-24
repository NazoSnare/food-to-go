var orderID;
var order;
var items;
var count = 0;
var checked;

$( document ).ready(function() {
	hideAll();

		$("#content").on("change", "input", function() {
			$("input.checkbox").not(this).prop('checked', false);
		});

	$("#infoButton").on("click", function(e) {
		e.preventDefault();

		var name = $("#name").val();
		var address = $("#address").val() + ", " + $("#city").val() + ", " +
		$("#state").val() + " " + $("#zip").val();
		var phone = $("#number").val();

		// TODO: Street address validation with google maps!
		// check for if address is valid or not.
		// TODO: check for distance from store to address.
		// this is a later function.
		console.log(name);
		console.log(address);
		console.log(phone);
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

	$("#checkoutButton").on("click", function(e) {
		e.preventDefault();
		alert("Checkout Functionality to be added!")
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
