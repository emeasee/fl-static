MODE_FORGOT_PWD = "FORGOT_PWD";
MODE_CREATE_BUYER = "CREATE_BUYER";
MODE_GLASS_APP_REQUEST = "GLASS_APP_REQUEST";
MODE_CREATE_INVITED_BUYER = "CREATE_INVITED_BUYER"

global_currentMode = "";

global_emailInput = ""
global_buyerIdInput = ""
global_passInput = ""
global_confirmPassInput = ""
global_regionInput = ""
ie = false
version = ""

$( document ).ready(function() {

	var urlParam = getUrlParameter("param");
	if(urlParam != null) {
		redirectTo(config.loginSuccessURL + "?param=" + urlParam);
	}

	var cookieParam=getCookie(config.cookieParam);
	//If the cookie exists, redirect the user to the dynamic website
	if (cookieParam!="") {
		//alert(cookieParam);
		//update cookie expiration date (1 month)
		setCookie(config.cookieParam, "cuitas", -30, config.cookiePath, config.cookieDomain);
		redirectTo(config.loginSuccessURL + "?param=" + cookieParam);
	}

	version = ie_check();

	if ( $('html').hasClass('ie6, ie7, ie8, ie9') || version != undefined ){
		ie = true;
		$('#flipback').css('display','none');
		$('input#login').css('width', '250px');
		$('input#password').css('width', '250px');
	} else {
		$('.side').css('backface-visibility','hidden');
		$("label#lblYourEmail").css('display','none');
		$("label#lblPassword").css('display','none');
		$("label#lblYourEmailPwd").css('display','none');
		$("label#lblAnswerCaptcha").css('display','none');
	}

     $('#js-expander-trigger').click(function(){
      $(this).toggleClass("expander-hidden");
     });

    $(".dropdown-button").click(function() {
        var $button, $menu;
        $button = $(this);
        $menu = $button.siblings(".dropdown-menu");
        $menu.toggleClass("show-menu");
        $menu.children("li").click(function() {
            $menu.removeClass("show-menu");
            $button.html($(this).html());
        });
    });

    $('.learn').click(function(){
       window.location.href = 'library.html';
    });

	$("button#flip-toggle").on("click touchend", function(event){
		var el = document.getElementById("top");
		el.scrollIntoView(true);

		event.preventDefault();
		event.stopPropagation();

		copyElementValue("input#email_1", "input#email_2");
		showsignUpPanel();
		putFocusOn("email_2");
	});

	$("button#flip-toggle2").on("click touchend", function(event){
		var el = document.getElementById("top");
		el.scrollIntoView(true);

		event.preventDefault();
		event.stopPropagation();

		copyElementValue("input#email_3", "input#email_2");
		showsignUpPanel();
		putFocusOn("email_2");
	});

	$("button#flip-toggleBack").on("click touchend", function(event){
		var el = document.getElementById("top");
		el.scrollIntoView(true);

		event.preventDefault();
		event.stopPropagation();

		showLoginPanel();
		putFocusOn("login");
	});

	$('form[name=createBuyerForm]').submit(function(){
		if(validateCreateBuyerForm("email_2", "pass", "confirmPass")) {
			global_emailInput = "email_2";
			global_buyerIdInput = "email_2";
			global_passInput = "pass";
			global_confirmPassInput = "confirmPass";
			global_regionInput = "region";
			global_currentMode = MODE_CREATE_BUYER;
			showRecaptchaPopup(MODE_CREATE_BUYER);
		}
		return false;
	});


	$('form[name=createBuyerForm2]').submit(function(){
		if(validateCreateBuyerForm("email_2_bottom", "pass_bottom", "confirmPass_bottom")) {
			global_emailInput = "email_2_bottom";
			global_buyerIdInput = "email_2_bottom";
			global_passInput = "pass_bottom";
			global_confirmPassInput = "confirmPass_bottom";
			global_regionInput = "region_bottom"
			global_currentMode = MODE_CREATE_BUYER;
			showRecaptchaPopup(MODE_CREATE_BUYER);
		}
		return false;
	});

	$('form[name=loginform]').submit(function(){
		if(validateLoginForm()) {
			doLogin();
		}
		return false;
	});

	$('form[name=captchaForm]').submit(function(){
		if(validateCaptcha()) {
			if(global_currentMode == MODE_FORGOT_PWD) {

				if(validateSendPasswordForm()) {
					doSendPasswordRequest();
				}
			}
			else {
				doCreateNewBuyer(global_emailInput, global_buyerIdInput, global_passInput, global_confirmPassInput, global_regionInput);
			}
		}
		hideRecaptcha();
		return false;
	});

	$('form[name=validateNewUserInvitationForm]').submit(function(){
		if(validateCreateBuyerForm("email_2", "pass", "confirmPass")) {
			/*global_emailInput = "email_2";
			global_buyerIdInput = "email_2";
			global_passInput = "pass";
			global_confirmPassInput = "confirmPass";
			global_regionInput = "region";
			global_currentMode = MODE_CREATE_BUYER;
			showRecaptchaPopup(MODE_CREATE_BUYER);*/
			validateNewUserInvitation("pass", "region", "captchaChallenge", "captchaResponse");
		}
		return false;
	});

	$("button#captchaButton").on("click", function(event){
		if(validateCaptcha()) {
			if(global_currentMode == MODE_FORGOT_PWD) {

				if(validateSendPasswordForm()) {
					doSendPasswordRequest();
				}
			}
			else {
				doCreateNewBuyer(global_emailInput, global_buyerIdInput, global_passInput, global_confirmPassInput, global_regionInput);
			}
		}
		hideRecaptcha();
		return false;
	});

	$("button#cancelButton").on("click", function(event){
		hideRecaptcha();
		return false;
	});

	$("label#forgotPwdBtn").on("click", function(event){
		global_currentMode = MODE_FORGOT_PWD;
		showRecaptchaPopup(MODE_FORGOT_PWD);
		return false;
	});

	if ($('#recaptcha_div').length){
		showRecaptcha('recaptcha_div');
	}

});
