'use strict';

var isValid = function(data) {
        if (typeof(data.status) != "undefined") {
            $.userSession.storeOK = 0;
            ohSnap(data.message);
            return false;
        } else {
            return true;
        }
}
$("#activemenu").on("change",function( event ){
    
        
        $.userSession.expire(); 
        var action = parseInt($(this).find('option:selected').val());
        var token = $.userSession.token;
        if(action === 404){
            return false;
        }
        Handlebars.registerHelper("format", function( num ){return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,");});
        Handlebars.registerHelper("checkpicture", function( images ){return (images=="null") ? "default.jpg" : images;});
        Handlebars.registerHelper("chkStatus", function( status ){

           return (status=="0") ? "OFFLINE" : "<button id='userFixNow'>Disconnect</button>";

        });
        Handlebars.registerHelper("getValue", function( key, options){
            
            return options[key];
          

        });
        Handlebars.registerHelper("chkRewards", function( h ){

       return (h>0) ? "<button id='claimRewards'>Claim Reward</button>" : "";

         });
        switch(action){

            case 0:
            $.userSession.islogin=false;
               userContainer.empty();
               window.location.hash="#cmd/home";
               store.clear();
            break;

            case 1:
                $.server.request({route:{app: 'checkpoint',type: action,token: token}})
                .then(
                     function( data ){
                         var source   = $("#resetst-wrapper").html();
                         var template = Handlebars.compile(source);
                         var html    = template( data );
                        htmlContainer.html(html);

                     },
                     //callback fail
                     function(){}
                     );
                 break;
            case 3:
                $.server.request({route: {app: 'checkpoint',type: action,token: token}})
                .then( 
                    function( data ){
                        var source   = $("#changeschool-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template( data );

                         htmlContainer.html(html);
                    },
                 function(){}

                 );
            break;
            case 4:
            $.server.request({route: {app: 'checkpoint',type: action,token: token}})
             .then( 
                 function( data ){
                     var source   = $("#reborn-wrapper").html();
                     var template = Handlebars.compile(source);
                     var html    = template( data  );

                         htmlContainer.html(html);


                 },
                 function(){}

                 );

            break;
            case 5:
              $.server.request({route: {app: 'checkpoint',type: action,token: token}})
              .then( 
                 function( data ){
                        
                     var source   = $("#goldtovp-wrapper").html();
                     var template = Handlebars.compile(source);
                     var html    = template( data );

                         htmlContainer.html(html);

                 },
                 function(){});
             break;
            case 6:
              $.server.request({route: {app: 'checkpoint',type: action,token: token}})
              .then( 
                     function( data ){
                         var source   = $("#voting-wrapper").html();
                         var template = Handlebars.compile(source);
                         var html    = template( data );

                             htmlContainer.html(html);
                     },
                     //error callback
                     function( ){}
                 );
             break;
             case 8:
             $.server.request({route: {app: 'itemshop',mode: 2}})
             .then(
                     function( data ){

                         var source   = $("#voteshop-wrapper").html();
                         var template = Handlebars.compile(source);
                         var html    = template( data );

                             htmlContainer.html(html);
                     },
                     function(){}
                 );
             break;
         case 9:
             $.server.request({route: {app: 'itemshop',mode: 1}})
             .then(
                     function( data ){
                         var source   = $("#premiumshop-wrapper").html();
                         var template = Handlebars.compile(source);
                         var html    = template( data );

                             htmlContainer.html(html);
                     },
                     function(){}
                 );
             break;
        case 10:
            var source  = $("#topup-wrapper").html();
            var template = Handlebars.compile(source);
            var html    = template();

            htmlContainer.html(html);

             break;
        case 11:

            $.server.request({route: {app: 'userinfo',token: token}})
            .then( 
             function( data ){
                    var gt_H = Math.floor(data.GameTime3 /60);
                    var gt_M = data.GameTime3 - 60 * gt_H;
                    var source  = $("#accuserdata-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( {data:data,h:gt_H,m:gt_M} );
                   
                 htmlContainer.html(html);
             },
             //callback failed
             function(){}
            );
           break;
    }
       
});

$("#TEMPLATES").delegate("#resetAction", "click", function( event ) {
    blockUI();
        var chaID = $("#chaID").val(),
            token = $.userSession.token;
    if ($.userSession.clickGuard()) {
        return false;
    }
    $.userSession.storeOK= true;
        if (chaID != null) {
            $.server.request({
                route: {
                    app: 'resetStats',
                    chaID: chaID,
                    token: token
                }
            }).done(function(data) {
                $.unblockUI();
                if (isValid(data)) {

                    ohSnap("Reset Success");
                    htmlContainer.empty();
                    $.userSession.expire();

                    $.userSession.storeOK= false; 

                }
            }).fail(function() {
                ohSnap(

                    "Server failed to response your request"
                );
            });
        } else {
            ohSnap("Problem found.. please contact administrator");
        }
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#changeAction", "click", function( event ) {
    if ($.userSession.clickGuard()) {
        return false;
    }
    $.userSession.storeOK= true;
	var token = $.userSession.token,
        chaID = $("#chaID").val(),
	    school = $("#schoolActive").val();
	$.server.request({
		route: {
			app: 'changeschool',
			token: token,
			chaID: chaID,
			school: school
		}
	}).done(function(data) {

		if (isValid(data)) {
          
            $.userSession.storeOK= false;
             $.userSession.expire(); 
			ohSnap("Transfer Success");
			 htmlContainer.empty();
		}
	}).fail(function(data) {
		ohSnap("server failed to response");
	});
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#doReborn", "click", function( event ) {
    blockUI();
	if ($.userSession.clickGuard()) {
		return false;
	}
	$.userSession.storeOK= true;
	var token = $.userSession.token,
	   chaID = $("#chaID").val();
	$.server.request({
		route: {
			app: 'reborn',
			token: token,
			chaID: chaID
		}
	}).done(function(data) {
         $.unblockUI();
		if (isValid(data)) {
             $.userSession.expire(); 
			$.userSession.storeOK= false;
			ohSnap("Reborn Success");
			 htmlContainer.empty();
		}
	}).fail(function(data) {
		ohSnap("server failed to response");
	});
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate(".convertChaEvent", "change", function( event ) {

	var source  = $("#goldtovphelp-wrapper").html();
    var template = Handlebars.compile(source);
 
	var vpCurrency = parseInt($(this).find(':selected').data('rate'));
	var chaNum = this.value;
	var n = parseInt($(this).find(':selected').data('number'));
	var html    = template({rate:vpCurrency,gold:n});
	$(".subwrapper").html( html );
	$("#goldACC").keyup(function() {
		var g = this.value;
		if (g > 0) {
			if (g <= n) {
				if (g >= vpCurrency) {
					var gold = Math.floor(g);
					var bal = n - gold;
					var vp = Math.floor(gold / vpCurrency);
					$("#chaGold").text(bal);
					$("#gtRes").text(vp);
                        //show the button convert 
                        $("#btnPlace").html(
                        	"<br><button data-gold=" +
                        	gold + " data-idz=" +
                        	chaNum +
                        	" id='convertnow'>Convert now</button>"
                        	);
                    } else {
                    	ohSnap("Please Enter More than " +
                    		vpCurrency);
                    	$("#btnPlace").empty();
                    }
                } else {
                	ohSnap("Not enough Gold");
                	$("#btnPlace").empty();
                }
            } else {
            	ohSnap("Please enter correct amount");
            	$("#btnPlace").empty();
            }
        });
event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#convertnow", "click", function( event ) {
        blockUI();
        if ($.userSession.clickGuard()) {
            return false;
        }
        $.userSession.storeOK = true;
        var id = $(this).data("idz"),
            token = $.userSession.token,
            gold = $(this).data("gold");
        $.server.request({
            route: {
                app: 'convertGold',
                id: id,
                gold: gold,
                token: token
            }
        }).done(function(data) {
             $.unblockUI();
            if (isValid(data)) {
                $.userSession.storeOK = false;
                 $.userSession.expire(); 
                ohSnap("convert sucessful");
                htmlContainer.empty();
            }
        }).fail(function() {
            ohSnap("server failed to response");
            $.userSession.storeOK = 1;
        });
        event.stopImmediatePropagation();
    });
  $("#TEMPLATES").delegate("#voteAction", "click", function( event ) {
        if ($.userSession.clickGuard()) {
            return false;
        }
        $.userSession.storeOK = false;
        var link = $("#linkActive").val(),
        	url  = $("#linkActive").find('option:selected').data("linkads"),
            token = $.userSession.token;
        window.open(url, "_blank");
        $.server.request({
            route: {
                app: 'votelink',
                token: token,
                link: link
            }
        }).done(function(data) {
            if (isValid(data)) {
                $.userSession.storeOK = false;
                 $.userSession.expire(); 
                ohSnap("Vote Success");
            }
        }).fail(function(data) {
            ohSnap("server failed to response");
        });
        event.stopImmediatePropagation();
    });
 $("#TEMPLATES").delegate("#buyItem", "click", function( event ) {
    blockUI();
    if($.userSession.clickGuard()) {
        return false;
    }
    $.userSession.storeOK = true;
        var token = $.userSession.token;
        var n = $(this).data('item');
        var mode = $(this).data('mode');
        var imei = $.userSession.imei;

        $.server.request({route: {app: 'buyitem',n: n,token: token,mode: mode}})
        .done(function(data) {
             $.unblockUI();
            if (isValid(data)) {
                 $.userSession.expire(); 
               confirm("Item Purchase Success....Continue Shopping?",function(e) {
                    if(!e) {
                        htmlContainer.empty();
                    }
                });
                $.userSession.storeOK = false;
            }
        }).fail(function() {
            ohSnap("server failed to response");
    });
    event.stopImmediatePropagation();
});
 $("#TEMPLATES").delegate("#categorySelect", "change", function( event ) {
        var mode = $(this).data("seekmode"),
            ctg = $("#categorySelect").val();
        	$.server.request({route: { app: 'searchItemCtg',mode: mode,ctg: ctg }})
        	.then( function( data ){
        		if(mode==2){
        			var source   = $("#voteshop-wrapper").html();
        		}else{
        			var source   = $("#premiumshop-wrapper").html();
        		}
        		
                var template = Handlebars.compile(source);
                var html    = template( data );

                htmlContainer.html(html);

        	});
        event.stopImmediatePropagation();
 });
  $("#TEMPLATES").delegate("#topUpCard", "click", function( event ) {
    blockUI();
    if ($.userSession.clickGuard()) {
        return false;
    }
    $.userSession.storeOK= true;
        var sn = $("#topUpCardSN").val(),
            pn = $("#topUpCardPIN").val(),
            token = $.userSession.token;
        if (sn == "" || pn == "") {
            ohSnap("All field are required");
            return false;
             $.unblockUI();
        }
        $.server.request({
            route: {
                app: 'topup',
                sn: sn,
                pn: pn,
                token: token
            }
        }).then(function(data) {
             $.unblockUI();
            if (isValid(data)) {
                ohSnap("Point Inserted...");
                 $.userSession.expire(); 
                $.userSession.authenticate(); //after success call userlogin prototype//

                $.userSession.storeOK= false;
            }
        }, function() {
            ohSnap("unhandle process");
        });
    event.stopImmediatePropagation();
  });
  $("#TEMPLATES").delegate("#uiToggleEvent", "click", function() {
        var eventType = $(this).data("uitype");
        $(this).parents("#ui_PassForm").hide();
        switch (eventType) {
            case "chPass":
                $("#ui_chPassFormManager").fadeIn();
                break;
            case "chPin":
                $("#ui_chPinFormManager").fadeIn();
                break;
            default:
                return false;
                break;
        }
    });
  $("#TEMPLATES").delegate("#chPassSave", "submit", function(event) {
        event.preventDefault();
        var current = $("#chpass1").val(),
            newp = $("#chpass2").val(),
            newp2 = $("#chpass3").val(),
            pin = $("#chpass4").val(),
            token = $.userSession.token;
        if (newp === newp2) {
            if (current === newp) {
                ohSnap("Please try another Password...");
            } else {
                $.server.request({
                    route: {
                        app: 'changepass',
                        old: current,
                        pass: newp,
                        pin: pin,
                        token: token
                    }
                }).done(function(data) {
                    if (isValid(data)) {
                         $.userSession.expire(); 
                        ohSnap("Change Password Success");
                        userContainer.empty();
               			window.location.hash="#cmd/home";
               			$.userSession.islogin=false;
               			store.clear();
                    }
                }).fail(function() {
                    ohSnap("server failed to response");
                });
            }
        } else {
            ohSnap(" Password Mismatch");
        }
    });
    $("#TEMPLATES").delegate("#chPinSave", "submit", function(event) {
        event.preventDefault();
        var current = $("#chpin1").val(),
            newp = $("#chpin2").val(),
            newp2 = $("#chpin3").val(),
            token = $.userSession.token;
        if (newp === newp2) {
            if (current === newp) {
                ohSnap("Please try another Pincode...");
            } else {
                $.server.request({
                    route: {
                        app: 'changepin',
                        old: current,
                        pin: newp,
                        token: token
                    }
                }).done(function(data) {
                    if (isValid(data)) {
                         $.userSession.expire(); 
                        ohSnap("Change Pincode Success");
                       	userContainer.empty();
               			window.location.hash="#cmd/home";
               			$.userSession.islogin=false;
               			store.clear();
                    }
                }).fail(function() {
                    ohSnap("server failed to response");
                });
            }
        } else {
            ohSnap(" Pincode Mismatch");
        }
    });
$("#TEMPLATES").delegate("#viewChaInfo", "click", function() {
        var token = $.userSession.token;

        $.server.request({route: {app: 'characterData',token: token}})
        .then( function( data ){
             $.userSession.expire(); 
        	var source  = $("#mycharacter-wrapper").html();
           	var template = Handlebars.compile(source);
            var html    = template( data );

            htmlContainer.html(html);

        },
        //callback failed
        function(){}
        );
        
});
$("#TEMPLATES").delegate("#userFixNow", "click", function() {
        var token = $.userSession.token;
        $.server.request({
            route: {
                app: 'userfix',
                token: token
            }
        }).then(function(data) {
            if (isValid(data)) {
                 $.userSession.expire(); 
                ohSnap("Account Disconnected");
                store.clear();
                store.set("userAction", false);
                location.reload();
            }
        });
    })
$("#TEMPLATES").delegate("#claimRewards", "click", function( event ) {
    blockUI();
    if ($.userSession.clickGuard()) {
        return false;
    }
    $.userSession.storeOK= true;
        var token = $.userSession.token;
        $.server.request({
            route: {
                app: 'gametime',
                token: token
            }
        }).then(function(data) {
             $.unblockUI();
            if (isValid(data)) {
                 $.userSession.expire(); 
                ohSnap("Game Time Collected....");

                 $.userSession.storeOK= false;
            }
        }, function() {
            ohSnap(
                "Server Failed to response.. Please try again later."
            );
        });
        event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#searchItem", "click", function( event ) {
    blockUI();
        var strItem = $("#searchSTR").val(),
            mode = $(this).data("mode");
        $.server.request({
            route: {
                app: 'searchItem',
                mode: mode,
                ItemName: strItem
            }
        }).done(function(data) {
             $.unblockUI();
            var storeSize = data.length,
                fragments = $(".storeItem"),
                storeElement = "";
            if (isValid(data)) {
                if(mode==2){
                    var source   = $("#voteshop-wrapper").html();
                }else{
                    var source   = $("#premiumshop-wrapper").html();
                }
                
                var template = Handlebars.compile(source);
                var html    = template( data );

                htmlContainer.html(html);
            }
        }).fail(function(data) {
            ohSnap("server failed to response");
        });
        event.stopImmediatePropagation();
    });

 
