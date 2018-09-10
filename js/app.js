/**
# Developed with love by Tearhear18
# Junen 17, 2015 version
# tearhear18@gmail.com
# version 3.3.5
**/
//----------CONFIGURATION-----------------------------//
var cfg = {
    "serverName": "RAN Online PH",
    "timeExpire":500000,
    "folderName":"THEME1"
};

//------------END OF CONFIG----------------------------//

htmlContainer = $("#TEMPLATES");
userContainer = $("#AccUIWrapper_controller");

(function($, window ){
    'use strict';
    var isValid;
    var ranking;
    var holder;
     Handlebars.registerHelper("addOne", function( number ){return number+1;});
     Handlebars.registerHelper("pstatus", function( status ){
        return (status=="0") ? "off.png" : "on.png";
    });
     Handlebars.registerHelper("newsType", function( status ){
        var n ={
            "1":"EVENT",
            "2":"NEWS",
            "3":"SYSTEM"
        };
        return n[status];
    });

	$.server = {
		url:"http://74.91.116.101/service/",
        request: function(options) {
            return $.post($.server.url, options).promise();
        },
        debug: function(options) {
            $.post($.server.url+ "debug.php", options).promise().done(
                function(response) {
                        console.log(response);
                });
        }    
    }
    $.userSession = {
        timer:0,
        storeOK: false,
        expire: function(){
            window.clearTimeout(this.timer);
            this.timer = setTimeout( function(){
                console.log("auto log out invoke");
                store.set("uac", false);
                var source   = $("#notify-wrapper").html();
                var template = Handlebars.compile(source);
                var html    = template();
                 window.location.hash = '#userTimeout=true';
                htmlContainer.html(html);
                userContainer.empty();
                store.clear();
                $.userSession.islogin=false;
            },cfg.timeExpire);  

           
        },
         clickGuard: function() {
            if (this.storeOK) {
                return true;
            } else {
                return false;
            }
        },
        authenticate: function(){
            $.userSession.token = store.get("token"),
            $.userSession.serial = store.get("serial");
            if(this.islogin){

                var user = $.server.request({route: {app: 'authenticate',token: this.token,serial: this.serial}});
                    user.then(
                        function( data ){
                          
                            if(data.Activation){
                                var source   = $("#update-wrapper").html();
                                var template = Handlebars.compile(source);
                                var html    = template(data);
                                window.location.hash ='activation&uid=' + $.userSession.token;
                                htmlContainer.html(html);
                                return false;
                            }
                            $.userSession.auth = data.user.auth;
                            if (!data.user.isAdmin) {
                                var n = {notification:data.user.notification,fullname:data.user.userName,vpoint:data.user.p1,epoint:data.user.p2,lastlogin:data.user.LastLoginDate,menu:data.menu}
                                var source   = $("#userinfo-wrapper").html();
                                var template = Handlebars.compile(source);
                                var html    = template( n );

                                userContainer.html( html );

                                var source   = $("#userwall-wrapper").html();
                                var template = Handlebars.compile(source);
                                var html   = template({name:cfg.serverName});
                                htmlContainer.html(html);
                                window.location.hash = data.user.userName;
                                $.getScript("./js/usermodule.js");

                            }else{
                                //admin
                                pin = store.get('pin');
                                if (pin == null) {
                                    var pin = prompt("Please Enter your Security Code","PIN")
                                    if (pin != null) {
                                        store.set('pin', pin);
                                    } else {
                                        store.clear();
                                        location.reload();
                                    }
                                }
                                var n = {notification:data.user.notification,fullname:data.user.userName,vpoint:data.user.p1,epoint:data.user.p2,lastlogin:data.user.LastLoginDate,menu:data.menu}
                                var source   = $("#admininfo-wrapper").html();
                                var template = Handlebars.compile(source);
                                var html    = template( n );

                                userContainer.html( html );
                                $.getScript("./js/news.js");
                                $.getScript("./js/admin.js");
                                $.server.request({route: {app: 'serverstatus'}}).then(
                                    function( data ){
                                        var source   = $("#administrative-wrapper").html();
                                        var template = Handlebars.compile(source);
                                        var html    = template(data);
                                      
                                        htmlContainer.html(html);

                                    },
                                    function(){}
                                );
                                window.location.hash = data.user.userName;
                                $.getScript("./js/usermodule.js");
                                $.userSession.imei = data.user.imei;

                            }
                           // window.location.hash = data.userName;
                           
                        },
                        //callback failed
                        function(){
                            
                            store.clear();
                            ohSnap("Unable to authenticate to server");
                        }
                    );
            }else{
                store.clear();
            }
        }


    }
    var isValid = function(data) {
        if (typeof(data.status) != "undefined") {
            $.userSession.storeOK = 0;
            ohSnap(data.message);
            return false;
        } else {
            return true;
        }
    }

    $.display = {
    	formatNumber: function(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g,"$1,");
        },
        error: function(){
            var source   = $("#error-wrapper").html();
            var template = Handlebars.compile(source);
            var html    = template();

            htmlContainer.html(html);

        },
        message: function( data ){
            var source   = $("#notice-wrapper").html();
            var template = Handlebars.compile(source);
            var html    = template( data );

            htmlContainer.html( html );
        }
    }

    $.tearhear18 = {
    	configuration:{},
    	bootLoader: function(){
           // document.title = cfg.serverName;
            this.loadChaRanking();
            this.loadGuildHolder();
    		this.countTotalCharacter();
            
            $.userSession.islogin = store.get("uac"); //get user status
            

            if($.userSession.islogin){
                 
                 $.userSession.authenticate();
                 $.userSession.expire(); //expire after 10 secs
            }

            if(window.location.hash=="" || window.location.hash=="#cmd/home"){
                $.tearhear18.loadNews( 0 );
            }


    	},
        countTotalCharacter: function(){
            $.server.request({route: {app:'chaonline'}})  //set fake true if you want generate fake counter
            .then(
                //success
                function( data ){
                    
                   $("#onlinestate").html( data );
                },
                //failed
                function(){}
            );
        }
        ,
    	loadChaRanking:function(  ){
            $.server.request({route: {app: 'charank'}})
            .then(
                //success
                function( data ){
                    
                    var source   = $("#player-ranking").html();
                    var template = Handlebars.compile(source);
                    var html    = template(data);

                    $(".rRanking").html(html);
                },
                //failed
                function(){}
            );
    	},
        loadGuildHolder:function(){
            holder = $.server.request({route: {app: 'guildrank'}});
            holder.then(
                //success
                function( response ){
                   
                    var SG   = (typeof response.SG === "undefined") ? "NO GUILD HOLDER" : response.SG;
                    var MP   = (typeof response.MP === "undefined") ? "NO GUILD HOLDER" : response.MP;
                    var PHNX = (typeof response.PHNX === "undefined") ? "NO GUILD HOLDER" : response.PHNX;
                    var TH = (typeof response.TH === "undefined") ? "NO GUILD HOLDER" : response.TH;
                    var SGL = (typeof response.SG === "undefined") ? "Not Available" : response.SG_leader;
                    var MPL = (typeof response.MP === "undefined") ? "Not Available" : response.MP_leader;
                    var PHNXL = (typeof response.PHNX === "undefined") ? "Not Available" : response.PHNX_leader;
                    var THL = (typeof response.TH === "undefined") ? "Not Available" : response.TH_leader;
                    
                    var data = {SG:SG,MP:MP,PHNX:PHNX,TH:TH,SGL:SGL,MPL:MPL,PHNXL:PHNXL,THL:THL}
                    var source   = $("#guild-holder").html();
                    var template = Handlebars.compile(source);
                    var html    = template(data);

                    $(".gHolder").html(html);
                    
                },
                //failed
                function(){}
            );

        },
        loadNews: function( newstype ){
            var news = $.server.request({route: {app: 'fetchNews', newstype: newstype}});
                news.then(
                    function( data ){
                            
                        var type = {
                            1: "EVENT",
                            2: "NEWS",
                            3: "SYSTEM"
                        }
                        var source   = $("#news-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template(data);

                        

                        htmlContainer.html( html );
                    },
                    //post request failed
                    function(){}
                );
        },
        loadSingleNews: function( newsid ){
            var news = $.server.request({route: {app:'fetchSingleNews',id:newsid}});
                news.then(
                    function( data ){
                        
                        var source   = $("#viewnews-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template(data);

                        htmlContainer.html( html );
                        
                    },

                    //callback failed
                    function(){}
                );
        },
        loadFullClient: function(){
            var download = $.server.request({route: {app:'download',type: 1}});
                download.then( 
                    function( data ){

                        var source   = $("#fullclientdownload-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template(data);

                        htmlContainer.html( html );
                        
                    },
                    //callback fail
                    function(){}
                );
        },
        loadPatch: function(){
            var download = $.server.request({route: {app:'download',type: 2}});
                download.then( 
                    function( data ){
                        
                        var source   = $("#patchdownload-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template(data);

                        htmlContainer.html( html );

                    },
                    //callback fail
                    function(){}
                );
        },
        rankhelper: function( ctype ){
            var rank = $.server.request({route: {app: 'charank',size: 25 ,type: ctype}});
                rank.then( 
                    function( data ){
                       
                        var source   = $("#totalrank-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template(data);
                         
                        htmlContainer.html( html );
                        

                    },
                    //callback fail
                    function(){});
        },
        loadfile: function( file ) {
            $("html, body").animate({
                scrollTop: 0
            }, "slow");
           htmlContainer.load(file + " .boxWrapper");
        }
    }
    $("#TEMPLATES").delegate("#userLogin", "submit", function(event) {
        event.preventDefault();
        blockUI();
        var username = $("#username").val(),
            password = $("#password").val();

        var login = $.server.request({
            route: {
                app: 'login',
                username: username,
                password: password
            }
        }).then(function(data) {
            $.unblockUI();
            if (isValid(data)) {
                $.userSession.islogin = true;
                store.set('token', data[0]);
                store.set('serial', data[1]);
                store.set("uac", true);

                $.userSession.authenticate();
                $.userSession.expire();  //expire after 10 secs

                
            }
        }, 
        function() {
           
        });
    
    });
    $("#TEMPLATES").delegate("#recoverForm", "submit", function(event) {
        event.preventDefault();

        var username = $("#rec_userName").val(),
            token = $.userSession.token;
        if (token == null) {
            $.server.request({route: {app: 'recoverpass',username: username}})
            .then(
                //success call back//
                function(data) {
                    if (isValid(data)) {
                        $.userSession.token = data.id;
                        var source   = $("#accrecover2-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template(data);

                        htmlContainer.html( html );
                        
                    }
                },
                //error call back
                function() {
                    ohSnap(
                        "Request fail.. please refresh your browser"
                    );
                });
        } else {
            ohSnap(
                "Your other account is connected.. Please log out to continue"
            );
        }
    });
    $("#TEMPLATES").delegate("#recoverFormVerify", "submit", function(event) {
        event.preventDefault();
        var sec_answer = $("#rec_answer").val(),
            sec_answer_pin = $("#rec_answer_pin").val(),
            token = $.userSession.token;
        $.server.request({route: {app: 'verifyAnswer',answer: sec_answer,pin: sec_answer_pin,token: token}})
        .then(function(data) {
            if (isValid(data)) {
                store.clear();
                var source   = $("#recoveryDisplay-wrapper").html();
                var template = Handlebars.compile(source);
                var html    = template({newpass:data});

                htmlContainer.html( html );
                window.location.hash = "#recovery=true";
            }
        }, function() {
            ohSnap(
                " Server failed to response, Please try Again!."
            );
        });
    });
    $("#TEMPLATES").delegate("#updateForm", "submit", function(event) {
        event.preventDefault();
        var fullname = $("#rfullName").val(),
            secQ = $("#secQA").val(),
            secA = $("#secAnswer").val(),
            token = $.userSession.token;
        $.server.request({
            route: {
                app: 'update',
                fullname: fullname,
                secQ: secQ,
                secA: secA,
                token: token
            }
        }).then(function(data) {
            if (isValid(data)) {
                $.userSession.authenticate();
                htmlContainer.empty();
                ohSnap("Profile Updated!.");
            }
        }, function() {
            $.webInterface.severFail();
        });
    })
    $("#TEMPLATES").delegate("#RegisterForm", "submit", function(event) {
        event.preventDefault();
        //requestType=1001;
        var username = $("#usernameR").val(),
            email = $("#emailR").val(),
            password = $("#passwordR").val(),
            password2 = $("#password2R").val(),
            pincode = $("#pincodeR").val();
        if (password != password2) {
            ohSnap(" Please verify Password correctly..");
            return false
        }
        $.server.request({
            route: {
                app: 'register',
                username: username,
                email: email,
                password: password,
                pincode: pincode
            }
        })
        .done(function(data) {
            if (isValid(data)) {
                var source   = $("#finishReg-wrapper").html();
                var template = Handlebars.compile(source);
                var html    = template({username:username,email:email,password:password,pincode:pincode,server:cfg.serverName});

                htmlContainer.html( html );
                ohSnap("Registration Success");
            }
        }).fail(function() {
            ohSnap("Server connection failed");
        });
    });
    $.router = {
        ranking: function( options ){
            switch (options.b) {
                case "all":
                    $.tearhear18.rankhelper(0);
                    break;
                case "archer":
                    $.tearhear18.rankhelper(31);
                    break;
                case "swordie":
                    $.tearhear18.rankhelper(32);
                    break;
                case "magician":
                    $.tearhear18.rankhelper(33);
                    break;
                case "brawler":
                    $.tearhear18.rankhelper(34);
                    break;
                case "gunner":
                    $.tearhear18.rankhelper(35);
                    break;
                case "extreme":
                    $.tearhear18.rankhelper(36);
                    break;
                case "assasin":
                    $.tearhear18.rankhelper(37);
                    break;
                default:
                    $.display.error();
                    break;
            }
        },
        download: function( options ){
            switch (options.b) {
                case "fullclient":
                    $.tearhear18.loadFullClient();
                    break;
                case "patch":
                    $.tearhear18.loadPatch();
                    break;
                default:
                    $.display.error();
                    break;
            }
        },
        user: function( options ){
           
            switch (options.b) {
                case "register":
                    if($.userSession.islogin){
                        ohSnap("Currently account in session. please logout to signup new account");
                         $.display.error();
                    }else{
                        var source   = $("#register-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template();

                        htmlContainer.html(html);
                    }
                    break;

                case "login":
                    if($.userSession.islogin){
                        ohSnap("Currently account in session. please logout to login new account");
                        $.display.error();
                    }else{
                        var source   = $("#login-wrapper").html();
                        var template = Handlebars.compile(source);
                        var html    = template();

                        htmlContainer.html(html);
                    }
                    break;
                case "recover":
                    var source = $("#recovery-wrapper").html();
                    var template = Handlebars.compile(source);

                    var html    = template();
                    htmlContainer.html(html);
                    break;
                default:
                    $.display.error();
                    break;
            }

        },
        news: function( options ){
             
            switch( options.b ){
                case "tab":
                    $.tearhear18.loadNews( options.c );
                    break;
                case "view":
                     $.tearhear18.loadSingleNews( options.c );
                    break;

                default:
                     $.display.error();
                     break;
            }

        },
        home: function(){
          
            $.tearhear18.loadNews();
        },
        externals: function(options) {
             
            switch (options.b) {
                case "contact":
                    $.tearhear18.loadfile(cfg.folderName+"/contact.html");
                    break;
                case "forum":
                   
                     window.open(
                        "https://www.facebook.com",
                        '_blank');
                    
                    break;
                case "privacy":
                    $.tearhear18.loadfile(cfg.folderName+"/privacy.html");
                    break;
                case "termsofservice":
                    $.tearhear18.loadfile(cfg.folderName+"/tos.html");
                    break;
                case "about":
                    $.tearhear18.loadfile(cfg.folderName+"/about.html");
                    break;
                case "coder":
                    window.open(
                        "https://www.facebook.com/claramelz",
                        '_blank');
                    break;
                default:
                    $.display.error();
                    break;
            }

        },
        notification: function( options ){
             $.userSession.expire(); 
            if(!$.userSession.islogin){
               $.display.error();
               return false;
            }
            var token = $.userSession.token;
            switch( options.b){
                case "view":
                      $.server.request({route:{app:"notification",token:token}})
                      .then( 
                        function( data ){
                            var source   = $("#mynotification-wrapper").html();
                            var template = Handlebars.compile(source);
                            var html    = template( data );

                            htmlContainer.html(html);


                        },
                        //callback failed
                        function(){}

                        );
                    break;

                default:
                    $.display.error();
                    break;
            }
        }
    }
    Path.map("#cmd(/:a)(/:b)(/:c)").to(function() {
        var n = this.cmd.a;
        if (n in $.router) {
           
                
           
                $.router[n](this.cmd); 
           
            

        } else {
            $.display.error();
        }
    });
    Path.listen();

})(jQuery, window );
$.tearhear18.bootLoader();
function ohSnap(n, e, a) {
    var o = "5000",
        r = $("#errorPlaceHolder"),
        i = "";
    a && (i = "<span class='" + a + "'></span> ");
    var t = $('<div class="alert">' + i + n + "</div>");
    r.append(t), t.on("click", function() {
        ohSnapX($(this))
    }), setTimeout(function() {
        ohSnapX(r.children(".alert").first())
    }, o)
}

function ohSnapX(n) {
    "undefined" != typeof n ? n.remove() : $(".alert").remove()
};
function blockUI(){
     $.blockUI({ css: { 
            border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#fff' 
        } }); 

};