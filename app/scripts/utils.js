	function ie_check(){
		var v = 3
    , div = document.createElement( 'div' )
    , all = div.getElementsByTagName( 'i' )
  do
    div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->'
  while
    (all[0])
  return v > 4 ? v : document.documentMode
	}


	function decodeXml(string) {
		string = string.replace("&amp;", "&");
		string = string.replace("&quot;", "\"")
		string = string.replace("&apos;", "'")
		string = string.replace("&lt;", "<")
		string = string.replace("&gt;", ">")
		string = string.replace(/&#(\d+);/g, function (m, n) { return String.fromCharCode(n); });
		return string;
	}

	function getResponseMessage(response) {
		var startIdx = response.indexOf("&quot;");
		startIdx = startIdx + 6;
		var endIdx = response.indexOf("&quot;", startIdx);

		var error = response.substring(startIdx,endIdx)
		var decodedError = decodeXml(error);
		return decodedError;
	}

	function showMessage(message, width, height, onclick) {
		var popup = document.getElementById("popup");
		var popupBackground = document.getElementById("popupbackground");

		popup.innerHTML = message + "<br/><button onclick='hideMessage();" + onclick + "' Style=' position: absolute; right: 20px; bottom: 15px;'>OK</button>"
		popup.style.width = width + "px";
		popup.style.height = height + "px";
		var x = (window.innerWidth / 2) - (width / 2);
		var y = (window.innerHeight / 2) - (height / 2);
		popup.style.position = "fixed";
		popup.style.bottom = y + "px";
		popup.style.right = x + "px";
		popup.style.display="block";

		popupBackground.style.width =  (document.width !== undefined) ? document.width : document.body.offsetWidth + "px";
		popupBackground.style.height = (document.height !== undefined) ? document.height : document.body.offsetHeight + "px";
		popupBackground.style.display="block";
	}

	function hideMessage() {
		var popup = document.getElementById("popup");
		var popupBackground = document.getElementById("popupbackground");

		popup.style.display="none";
		popupBackground.style.display="none";

	}

	function showRecaptchaPopup(mode) {
		Recaptcha.reload();

		var popup = document.getElementById("recaptchaPopup");
		var popupBackground = document.getElementById("popupbackground");
		var emailPwdLabel = document.getElementById("lblYourEmailPwd");
		var emailPwdInput = document.getElementById("emailPwd");
		var captchaButton = document.getElementById("captchaButton");

		var x = (window.innerWidth / 2) - (177);
		var y = (window.innerHeight / 2);

		var captchaButtonText = "#signUp#";


		popup.style.width = "354px";
		if(mode == MODE_FORGOT_PWD) {
			popup.style.height = "280px";
			y = y - 140;
			if(ie) {
				popup.style.height = "320px";
				y = y - 160;
				emailPwdLabel.style.display="inline";
			}
			emailPwdInput.style.display="inline";
			captchaButtonText = "#send#";

		} else {
			popup.style.height = "230px";
			y = y - 115;
			if(ie) {
				popup.style.height = "250px";
				y = y - 125;
			}
			emailPwdLabel.style.display="none";
			emailPwdInput.style.display="none";
		}

		captchaButton.innerHTML = captchaButtonText;

		popup.style.position = "fixed";
		popup.style.bottom = y + "px";
		popup.style.right = x + "px";
		popup.style.display="block";

		popupBackground.style.width =  (document.width !== undefined) ? document.width : document.body.offsetWidth + "px";
		popupBackground.style.height = (document.height !== undefined) ? document.height : document.body.offsetHeight + "px";
		popupBackground.style.display="block";
	}

	function hideRecaptcha() {
		var popup = document.getElementById("recaptchaPopup");
		var popupBackground = document.getElementById("popupbackground");

		popup.style.display="none";
		popupBackground.style.display="none";

	}


	function redirectTo(url) {
		window.location = url;
	}


	function showRecaptcha(element) {
	    Recaptcha.create(config.recaptchaKey, element, {
		theme: "white",
        callback: Recaptcha.focus_response_field});
	}

	function replaceAll(find, replace, str) {
		return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
	}

	function escapeRegExp(str) {
		return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	}

	function putFocusOn(elementId) {
		var element = document.getElementById(elementId);
		if( elementExists(element) ) {
			element.focus();
		}
	}

	function copyElementValue(sourceElementId, targetElementId) {
		var copyval = $(sourceElementId).val();
		$(targetElementId).val(copyval);
	}

	function getUrlParameterValue(parameterName) {
		var value = "";
		var query = window.location.search.substring(1);
	    var vars = query.split("&");
	    for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
			if(pair[0] === parameterName) {
				value = pair[1];
				return value;
			}
		}
		return value;
	}

	function elementExists(element) {
		return typeof(element) != 'undefined' && element != null;
	}

	function setCookie(name,value,exdays,path,domain) {
		var cvalue= name + "=" + value;
		var d = new Date();
		d.setTime(d.getTime()+(exdays*24*60*60*1000));
		var expires = "; expires="+d.toGMTString();
		var cDomain= "; domain=" + domain;
		var cPath = "; path=" + path;
		document.cookie = cvalue + expires + cDomain + cPath;
	}

	function getCookie(cname) {
		var name = cname + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++){
			var c = ca[i].trim();
			if (c.indexOf(name)==0) return c.substring(name.length,c.length);
		 }
		return "";
	}

	function scrollStick(){
		var top = $('.vertical-tabs').offset().top;
		var width;

		$(window).scroll(function (event){
			var y = $(this).scrollTop();
			width = $('.vertical-tabs').width();
			if (y >= top - 10) {
				$('.vertical-tabs, .vertical-tab-content-container').addClass('scrolling');
				$('.vertical-tabs').width(width);
			} else {
				$('.vertical-tabs, .vertical-tab-content-container').removeClass('scrolling');
				$('.vertical-tabs').removeAttr('style');
			}
		});
		window.onresize = function(event){
			$('.vertical-tabs').removeAttr('style');
		};
	}

	function accordionScrollCal(y, el){
		if (el.length){
			$(window).scroll(function(event){
				var a = el.offset();
				var max = $(document).height() - y;
				if (el.offset().top > max){
					el.css('position','static');
				}
				if (a.top - $(document).scrollTop() > 900){
					$('.js-vertical-tab-accordion-heading.is-next').css('position','fixed');
				}
			});
		}
	}

	function initDocs(){
		$(".js-vertical-tab-content").hide();
		$(".js-vertical-tab-content:first").show();

		/* if in tab mode */
		$(".js-vertical-tab").on('click touchend', function(event) {
		  event.preventDefault();

		  $(".js-vertical-tab-content").hide();
		  var activeTab = $(this).attr("rel");
		  $("#"+activeTab).show();

		  $(".js-vertical-tab").removeClass("is-active is-next");
		  $(this).addClass("is-active").next().next().addClass('is-next');

		  $(".js-vertical-tab-accordion-heading").removeClass("is-active");
		  $(".js-vertical-tab-accordion-heading[rel^='"+activeTab+"']").addClass("is-active");
		});

		/* if in accordion mode */
		$(".js-vertical-tab-accordion-heading").on('click touchend', function(event) {
		  event.preventDefault();
			var nextall = $(this).next().nextAll();
			var next = $(this).next().next();
			var heightLast = 0;
		  $(".js-vertical-tab-content").hide();
		  var accordion_activeTab = $(this).attr("rel");
		  $("#"+accordion_activeTab).show();

		  $(".js-vertical-tab-accordion-heading").removeClass("is-active is-next").removeAttr('style');
		  $(this).addClass("is-active").next().next().addClass('is-next');
			nextall.each(function(i){
				heightLast =+ $(this).outerHeight();
			});

			accordionScrollCal(heightLast, next);

		  $(".js-vertical-tab").removeClass("is-active");
		  $(".js-vertical-tab[rel^='"+accordion_activeTab+"']").addClass("is-active");
		});

		$('.js-vertical-tab-accordion-heading.is-active').trigger('touchend');
	}

	function getUrlParameter( name )
	{
		  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		  var regexS = "[\\?&]"+name+"=([^&#]*)";
		  var regex = new RegExp( regexS );
		  var results = regex.exec( window.location.href );
		  if( results == null )
				return null;
		  else
				return results[1];
	}
