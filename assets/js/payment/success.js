$( document ).ready(function() {

	$.ajax({
		type: "POST",
		dataType: "json",
		url: "/api/save",
	}).done(function(result) {
		if (result.error === true) {
			alert(result.message);
			return console.error(result.message);
		}
		// do something with the success, like show a link
		console.log(result);
	}).fail(function(err) {
		// do something with the failure, like laugh at the user
		console.error(err);
 });
});
