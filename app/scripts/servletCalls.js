

	function doLogin() {
		var buyerId = document.getElementById("login").value;
		var pwd = document.getElementById("password").value;


		var params = "buyerId="+buyerId+"&pwd="+pwd+"&appId="+config.applicationId+"&customerId="+config.customerId+"&op="+config.operation;
		var fullUrl = config.loginURL + "?" + params;

		/*xmlHttpRequest.open("GET", fullUrl, true);
		xmlHttpRequest.onreadystatechange = processLogin;
		xmlHttpRequest.send(null);*/

		 $.ajax({
			type: "GET",
			async: false,
			dataType: "jsonp",
			url: fullUrl,
			success: function(response) {
				processLogin(response);
			}
		});
	}

	function validateLoginForm() {
		var buyerId = document.getElementById("login").value;
		var pwd = document.getElementById("password").value;

		//Validate buyerId
		if(buyerId == "") {
			showMessage(strings.ENTER_EMAIL_ADDRESS, "300", "120", "");
			return false;
		}

		//Validate password
		if(pwd == "") {
			showMessage(strings.ENTER_PASSWORD, "300", "120", "");
			return false;
		}

		return true;
	}

	function processLogin(response) {
		var rememberMe = document.getElementById("remember").checked;

		if(response.indexOf("error") > -1) {
			showMessage(getResponseMessage(response), "300", "120", "");
		} else {
			response = replaceAll("&#061;", "=", response);
			response = replaceAll("&#047;", "/", response);
			response = replaceAll("&#043;", "+", response);

			if(rememberMe) {
				var index = response.indexOf("=");
				var cookieValue = response.substring(index + 1);
				setCookie(config.cookieParam, cookieValue.trim(), 30, config.cookiePath, config.cookieDomain);
			} else {
				//set a cookie to a passed date to have it deleted by the browser
				setCookie(config.cookieParam, "expired", -30, config.cookiePath, config.cookieDomain);
			}

			//redirect the user to the dynamic website on successfull login
			redirectTo(config.loginSuccessURL + "?" + response);
		}
	}

	function doCreateNewBuyer(emailInput, buyerIdInput, pwdInput, confirmPwdInput, regionInput) {

		var buyerId = document.getElementById(emailInput).value;
		var email = document.getElementById(buyerIdInput).value
		var pwd = document.getElementById(pwdInput).value;
		var confirmPwd = document.getElementById(confirmPwdInput).value;
		var region = document.getElementById(regionInput).value;

		var captchaChallenge = Recaptcha.get_challenge();/*document.getElementsByName("recaptcha_challenge_field")[0].value;*/
		var captchaResponse = Recaptcha.get_response();/*document.getElementsByName("recaptcha_response_field")[0].value;*/

		var params = "buyerId="+buyerId
					+"&pwd="+pwd
					+"&appId="+config.applicationId
					+"&customerId="+config.customerId
					+"&email="+email
					+"&region="+region
					+"&locale="+navigator.language
					+"&captchaChallenge="+captchaChallenge+"&captchaResponse="+captchaResponse;
		var fullUrl = config.createNewBuyerURL + "?" + params;

		 $.ajax({
			type: "GET",
			async: false,
			dataType: "jsonp",
			url: fullUrl,
			error : function(jqXHR, textStatus, errorThrown) {
				alert(textStatus);
			},
			success: function(response) {
				processCreateBuyerResponse(response, buyerId);
			}
		});

	}


	function processCreateBuyerResponse(response, buyerId) {
		//SUCCESS
		if(response.indexOf("success message")!=-1) {

			var successmessage = getResponseMessage(response);
			var requestId = successmessage.split("created -- ")[1];

			var message = replaceAll(keywords.BUYERID, buyerId, strings.ACCOUNT_CREATION_SUCCESS);
			redirectTo("signup.html?requestId="+requestId);
			//showMessage(message, "400", "160",  "");
			return;
		}

		//ACCOUNT CREATION ERRORS
		if(response.indexOf("error message")!=-1) {

			var errormessage = getResponseMessage(response);

			//The account already exists   http://stackoverflow.com/questions/3586775/javascript-string-equality-whats-the-correct-way
			if(errormessage === "Buyer already exists" ) {
				Recaptcha.reload();
				var message = replaceAll(keywords.BUYERID, buyerId, strings.ACCOUNT_ALREADY_EXISTS);
				showMessage(message, "400", "120", "onAccountAlreadyExists();");
				return;
			}

			//The account already exists but has not been activated
			if(errormessage === "Buyer already exists, but is not activated.") {
				Recaptcha.reload();
				var message = replaceAll(keywords.BUYERID, buyerId, strings.ACCOUNT_NOT_ACTIVATED);
				showMessage(message, "400", "160", "");
				return;
			}

			//CAPTCHA ERROR
			var captchaIdx = response.indexOf("CAPTCHA");
			var errorIdx = response.indexOf("ERROR");
			if( captchaIdx!=-1 && errorIdx!=-1) {
				var message = replaceAll(keywords.ERROR, errormessage, strings.CAPTCHA_ERROR);
				showMessage(message, "400", "160", "");
				return;
			}

			showMessage(errormessage, "400", "160", "");
			return;
		} else {
			//No captcha error => the captcha has been validated, we have to reload the recaptcha component
			Recaptcha.reload();
		}


		var decodedReponse = decodeXml(response);
		showMessage(decodedReponse, "400", "160", "");
	}

	function validateCreateBuyerForm(emailInput, pwdInput, confirmPwdInput) {
		var email = document.getElementById(emailInput).value
		var pwd = document.getElementById(pwdInput).value;
		var confirmPwd = document.getElementById(confirmPwdInput).value;

		//Validate e-mail
		if(email == "") {
			showMessage(strings.ENTER_EMAIL_ADDRESS, "300", "120", "");
			return false;
		}

		var atpos=email.indexOf("@");
		var dotpos=email.lastIndexOf(".");
		if (atpos<1 || dotpos<atpos+2 || dotpos+2>=email.length) {
			showMessage(strings.INVALID_EMAIL_ADDRESS, "300", "120", "");
			return false;
		}

		//Validate password
		if(pwd == "") {
			showMessage(strings.ENTER_PASSWORD, "300", "120", "");
			return false;
		}
		if( pwd != confirmPwd) {
			showMessage(strings.PASSWORDS_NOT_IDENTICAL, "300", "120", "");
			return false;
		}


		return true;
	}


	function doSendPasswordRequest() {

		var emailPwd = document.getElementById("emailPwd").value;

		var captchaChallenge = Recaptcha.get_challenge();/*document.getElementsByName("recaptcha_challenge_field")[0].value;*/
		var captchaResponse = Recaptcha.get_response();/*document.getElementsByName("recaptcha_response_field")[0].value;*/

		var params = "customerId="+config.customerId
					+"&id="+emailPwd
					+"&appId="+config.applicationId
					+"&captchaChallenge="+captchaChallenge+"&captchaResponse="+captchaResponse;
		var fullUrl = config.forgotMyPassword + "?" + params;

		 $.ajax({
			type: "GET",
			async: false,
			dataType: "jsonp",
			url: fullUrl,
			error : function(jqXHR, textStatus, errorThrown) {
				alert(textStatus);
			},
			success: function(response) {
				processSendPasswordResponse(response, emailPwd);
			}
		});
	}

	function processSendPasswordResponse(response, emailPwd) {
		//SUCCESS
		if(response.indexOf("success message")!=-1) {

			var successmessage = getResponseMessage(response);
			var requestId = successmessage.split("created -- ")[1];

			var message = replaceAll(keywords.EMAIL_ADDRESS, emailPwd, strings.NEW_PASSWORD_SENT);
			redirectTo("signup.html?requestId="+requestId);
			//showMessage(message, "400", "160",  "");
			return;
		}

		//REQUEST ERRORS
		if(response.indexOf("error message")!=-1) {

			var errormessage = getResponseMessage(response);

			//CAPTCHA ERROR
			var captchaIdx = response.indexOf("CAPTCHA");
			var errorIdx = response.indexOf("ERROR");
			if( captchaIdx!=-1 && errorIdx!=-1) {
				var message = replaceAll(keywords.ERROR, errormessage, strings.CAPTCHA_ERROR);
				showMessage(message, "400", "160", "");
				return;
			}

			showMessage(errormessage, "400", "160", "");
			return;
		} else {
			//No captcha error => the captcha has been validated, we have to reload the recaptcha component
			Recaptcha.reload();
		}


		var decodedReponse = decodeXml(response);
		showMessage(decodedReponse, "400", "160", "");
	}

	function validateSendPasswordForm() {
		var emailPwd = document.getElementById("emailPwd").value

		//Validate e-mail
		if(emailPwd == "") {
			showMessage(strings.ENTER_EMAIL_ADDRESS, "300", "120", "");
			return false;
		}

		var atpos=emailPwd.indexOf("@");
		var dotpos=emailPwd.lastIndexOf(".");
		if (atpos<1 || dotpos<atpos+2 || dotpos+2>=emailPwd.length) {
			showMessage(strings.INVALID_EMAIL_ADDRESS, "300", "120", "");
			return false;
		}

		return true;
	}

	function validateCaptcha() {
		//Validate captcha
		var captchaResponse = Recaptcha.get_response();
		if( captchaResponse == "") {
			showMessage(strings.ENTER_CAPTCHA, "300", "120", "");
			return false;
		}
		return true;
	}

	function doSendActivationEmail_forBuyer() {
		var buyerId = document.getElementById("email_2").value
		var params = "buyerId="+buyerId+"&customerId="+config.customerId;
		doSendActivationEmail(params);
	}

	function doSendActivationEmail_forRequestId() {
		var params = "id="+getUrlParameterValue("requestId");
		doSendActivationEmail(params);
	}

	function doSendActivationEmail(params) {

		var fullUrl = config.sendActivationEmail + "?" + params;

		 $.ajax({
			type: "GET",
			async: false,
			dataType: "jsonp",
			url: fullUrl,
			success: function(response) {
				processActivationEmail(response);
			}
		});
	}

	function processActivationEmail(response) {

		if(response.indexOf("success message")!=-1) {;
			showMessage(strings.ACTIVATION_EMAIL_SENT, "400", "160", "onAccountAlreadyExists();");
			return;
		}
		else if(response.contains("error")) {
			var errormessage = getResponseMessage(response);
			var message = strings.ACTIVATION_EMAIL_FAILED.replace(keywords.ERROR, errormessage);
			showMessage(message, "300", "120", "onAccountAlreadyExists();");
		} else  {
			alert(response);
		}
	}

	function onAccountAlreadyExists() {
		showLoginPanel();
		copyElementValue("input#email_2", "input#login");
		putFocusOn("password");
	}

	function showLoginPanel() {
		var flipDiv = document.getElementById("flipdiv");
		if( elementExists(flipDiv) ) {
			flipDiv.className= "flip hero-right";
		}
		if (ie == true){
			$('#flipback').css('display','none');
		}
	}

	function showsignUpPanel() {
		if (ie == true){
			$('#flipback').css('display','block');
		}
		$(".flip").addClass('flipped');
	}
