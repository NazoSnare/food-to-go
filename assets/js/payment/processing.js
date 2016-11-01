jQuery(window).load(function() {
$(".loader").delay(2000).fadeOut("slow");
setTimeout(() => {
	window.location = "/success";
}, 1500);
});
