MODE_FORGOT_PWD = "FORGOT_PWD";
MODE_CREATE_BUYER = "CREATE_BUYER";
MODE_GLASS_APP_REQUEST = "GLASS_APP_REQUEST";

global_currentMode = "";

global_emailInput = ""
global_buyerIdInput = ""
global_passInput = ""
global_confirmPassInput = ""
global_regionInput = ""
ie = false
version = ""

$( document ).ready(function() {
	try {
		emailAddress="";
		if (sessionStorage.getItem("flBuyerId")) {
		// Restore the contents of the text field
			emailAddress = sessionStorage.getItem("flBuyerId");
		}
		document.getElementById("flBuyerId").textContent= " " + emailAddress;
	} catch (err) {
		// Do nothing. Exception can be thrown when the site is loading in the dynamic site, but the initializeHomePage function is called by the site in this case.
	}
});
