$( document ).ready(function() {
	setTimeout(() => {
		$.get( "api/success", function(data) {
			$( "#key" ).append(data);
});
	}, 1000);
});
