Handlebars.registerHelper("checkPointType", function( point ){

       return (point=="1") ? "E-Point" : "C-Point";
});
Handlebars.registerHelper('selected', function(option, value){
    if (option == value[0].ItemCtg) {
        return ' selected';
    } else {
        return ''
    }
});
Handlebars.registerHelper('select_opt', function(option, value){
    if (option == value) {
        return ' selected';
    } else {
        return ''
    }
});

$("#TEMPLATES").delegate("#showHideControl", "click", function( event ) {
    var contElement = $(this),
    action = contElement.data("admcontrol");
    if (contElement.hasClass("shown")) {
        contElement.text(" HIDE CONTROL ").removeClass("shown");
        $("#" + action).show();
    } else {
        contElement.text(" SHOW CONTROL ").addClass("shown");
        $("#" + action).hide();
    }
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#seekusername","click", function(event) {
    
        event.preventDefault();
        var username = $("#Skusername").val();
        if (username == "") {
            ohSnap("Username field cannot be empty");
        } else {
            var token = $.userSession.token,
                auth = $.userSession.auth,
                pin = store.get('pin');
            $.server.request({
                route: {
                    app: 'admin_searchUserInfo',
                    username: username,
                    token: token,
                    auth: auth,
                    pin: pin
                }
            }).then(function(data) {
                if (isValid(data)) {
                     $.userSession.expire(); 
                    var ele = $("#userNameDisplay")
                    ele.html("<tr><td>Name</td><td>" + data
                        .Name +
                        "</td><td></td><td></td></tr><tr><td>UserNum</td><td>" +
                        data.UserNum +
                        "</td><td></td><td></td></tr><tr><td>UserName</td><td>" +
                        data.Username +
                        "</td><td></td></tr><tr><td>User Type</td><td>" +
                        data.UserType +
                        "</td><td></td></tr><tr><td>V Point</td><td>" +
                        data.vPoint +
                        "</td><td class='addPointer' data-user='" +
                        data.UserNum +
                        "' id='changeVpoint'>Add V Point</td></tr><tr><td>E Point</td><td>" +
                        data.ePoint +
                        "</td><td class='addPointer' data-user='" +
                        data.UserNum +
                        "' id='changeEpoint'>Add E Point</td></tr>"
                    );
                    ele.slideDown();
                }
            }, function() {
                ohSnap("Request Denied or failed");
            });
        }
        event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#changeVpoint", "click", function( event ) {
        var token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            userNum = $(this).data("user");
        var point = prompt("Please enter Additional V Point", "0");
        if (point > 0) {
            $.server.request({
                route: {
                    app: 'addVpoint',
                    token: token,
                    auth: auth,
                    pin: pin,
                    userNum: userNum,
                    point: point
                }
            }).then(function(data) {
                if (isValid(data)) {
                     $.userSession.expire(); 
                    ohSnap("Point Inserted");
                }
            }, function() {
                ohSnap("Request Denied or Failed");
            });
        }
        event.stopImmediatePropagation();
    })
    $("#TEMPLATES").delegate("#changeEpoint", "click", function( event ) {
        var token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            userNum = $(this).data("user");
        var point = prompt("Please enter Additional V Point", "0");
        if (point > 0) {
            $.server.request({
                route: {
                    app: 'addEpoint',
                    token: token,
                    auth: auth,
                    pin: pin,
                    userNum: userNum,
                    point: point
                }
            }).then(function(data) {
                if (isValid(data)) {
                     $.userSession.expire(); 
                    ohSnap("Point Inserted");
                }
            }, function() {
                ohSnap("Request Denied or Failed");
            });
        }
        event.stopImmediatePropagation();
    })
    $("#TEMPLATES").delegate("#generateView", "click", function( event ) {
        var token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'viewPoint',
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(function(data) {
            if (isValid(data)) {
                 $.userSession.expire(); 
                var source  = $("#viewGenpoint-wrapper").html();
                var template = Handlebars.compile(source);
                var html    = template( data );

                htmlContainer.html(html);
               
            }
        }, function() {
            ohSnap("Unable to handle request");
        });
        event.stopImmediatePropagation();
    })
    $("#TEMPLATES").delegate("#generateBtn", "click", function( event ) {
        var point = $("#evpoint").val(),
            type = $("#pointOption").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        if (type > 0) {
            if (point != "" && point > 0) {
                $.server.request({
                    route: {
                        app: 'generaPoint',
                        type: type,
                        point: point,
                        token: token,
                        auth: auth,
                        pin: pin
                    }
                }).then(function(data) {
                    if (isValid(data)) {
                         $.userSession.expire(); 
                        ohSnap("Point Generated");
                        $("#evpoint").val(0);
                    }
                }, function() {
                    ohSnap("Request Denied or failed");
                });
            } else {
                ohSnap("Please Enter Amount greater than 0");
            }
        } else {
            ohSnap("Please select proper point....");
        }
        event.stopImmediatePropagation();
    })
 $("#TEMPLATES").delegate("#showLinkAvailable", "click", function( event ) {
        var token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'viewLinkAddress',
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                 $.userSession.expire(); 
                var size = data.length,
                    linkFragment = "";
                linkFragment +=
                    "<tr><td><b>Link Name</b></td><td><b>Link Type</b></td><td><b>Date Upload</b></td><td><b>ACTION</b></td></tr>";
                for (var a = 0; a < size; a++) {
                    var type = (data[a].status == 1) ?
                        "Full Client " : "Patch";
                    linkFragment += "<tr><td>" + data[a].linkName +
                        "</td><td>" + type + "</td><td>" + data[
                            a].dateUpload +
                        "</td><td><button id='delLinkAddress' data-linkid='" +
                        data[a].id +
                        "' style='background:red;color:#fff'>DELETE</button></td></tr>";
                }
                $("#linkSubForm").html(linkFragment).show();
            }, function() {
                ohSnap("Server Failed to response");
            })
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#delLinkAddress", "click", function( event ) {
        $(this).parents("tr").remove();
        var linkID = $(this).data("linkid");
        token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'delLinkAddress',
                linkID: linkID,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                     $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#SaveLink", "click", function( event ) {
        var linkType = $("#linkTypeCreate").val(),
            linkName = $("#linkNameCreate").val(),
            linkAddress = $("#linkAddressCreate").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        if (linkType == 0) {
            ohSnap("Please Select Link Type")
        } else {
            $.server.request({
                route: {
                    app: 'savenewLink',
                    linkType: linkType,
                    linkName: linkName,
                    linkAddress: linkAddress,
                    token: token,
                    auth: auth,
                    pin: pin
                }
            }).then(
                //success callback
                function(data) {
                    if (isValid(data)) {
                         $.userSession.expire(); 
                        ohSnap("Link Added");
                        $("#linkSubForm").empty();
                    }
                },
                //fail callbacks
                function() {
                    ohSnap("Server Failed to response");
                });
        }
        event.stopImmediatePropagation();
    });
  $("#TEMPLATES").delegate("#showCreateLinkForm", "click", function( event ) {
        var source  = $("#createlink-wrapper").html();
        var template = Handlebars.compile(source);
        var html    = template();
        $("#linkSubForm").html(html);
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#showCreateNewsForm", "click", function( event ) {
        var source  = $("#createnewsform-wrapper").html();
        var template = Handlebars.compile(source);
        var html    = template();
        $("#linkSubForm2").html(html);
        nicEditors.allTextAreas("newsBodyContent");
       event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#showNewsPublish", "click", function( event ) {
        $.server.request({
            route: {
                app: 'fetchNews',
                newstype: 0
            }
        }).then(function(data) {
             $.userSession.expire(); 
            var subNews = "",
                len = data.length;
            type = {
                1: "EVENT",
                2: "NEWS",
                3: "SYSTEM"
            };
            for (var a = 0; a < len; a++) {
                subNews +=
                    "<tr><td><div class='newwrapper span60 " +
                    type[data[a].type] + "'>" + type[data[a]
                        .type] +
                    "</div></td><td><div class='newwrapper'>" +
                    data[a].date + "</div></td><td>" + data[
                        a].subject +
                    "</td><td><button id='deleteNewsAct' data-newsnum='" +
                    data[a].id +
                    "' style='background:red;color:#fff'>DELETE</button> <button id='editNews' data-newsnum='"+data[a].id+"'>EDIT</button></td></tr>";
            }
            $("#linkSubForm2").html(subNews);
        }, function() {
            ohSnap("server failed to response");
        });
    event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#deleteNewsAct", "click", function( event ) {
        $(this).parents("tr").remove();
        var newsnum = $(this).data("newsnum"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'deleteNews',
                newsnum: newsnum,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                     $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#editNews", "click", function() {
        var newsnum = $(this).data("newsnum"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'editNews',
                id: newsnum,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    var source  = $("#editnewsform-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                     $("#linkSubForm2").html( html );
                     
                     nicEditors.allTextAreas("newsBodyContents");
                     $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    });
    $("#TEMPLATES").delegate("#saveCreatedNews", "click", function( event ) {
        var nicE = new nicEditors.findEditor('newsBodyContent'),
            body = nicE.getContent(),
            nType = $("#newsType").val(),
            subject = $("#newsSubject").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        if (nType == 0) {
            ohSnap("Please Select News Type");
        } else {
            $.server.request({
                route: {
                    app: 'saveNewsPub',
                    nType: nType,
                    subject: subject,
                    body: body,
                    token: token,
                    auth: auth,
                    pin: pin
                }
            }).then(
                //success callback
                function(data) {
                    if (isValid(data)) {
                         $.userSession.expire(); 
                        ohSnap("News has been publish");
                        $("#linkSubForm2").empty();
                    }
                }, function() {
                    ohSnap("Server Failed to response");
                });
        }
        event.stopImmediatePropagation();
    }); 
 $("#TEMPLATES").delegate("#saveEditedNews", "click", function( event ) {
        var nicE = new nicEditors.findEditor('newsBodyContents'),
            newsnum = $(this).data("newsnum"),
            body = nicE.getContent(),
            nType = $("#newsType2").val(),
            subject = $("#newsSubject2").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        if (nType == 0) {
            ohSnap("Please Select News Type");
        } else {
            $.server.request({
                route: {
                    app: 'saveEditNews',
                    nType: nType,
                    id:newsnum,
                    subject: subject,
                    body: body,
                    token: token,
                    auth: auth,
                    pin: pin
                }
            }).then(
                //success callback
                function(data) {
                    if (isValid(data)) {
                         $.userSession.expire(); 
                        ohSnap("News Updated");
                        $("#linkSubForm2").empty();
                    }
                }, function() {
                    ohSnap("Server Failed to response");
                });
        }
        event.stopImmediatePropagation();
    }); 
 $("#TEMPLATES").delegate("#addCtg", "click", function( event ) {
        $.server.request({
            route: {
                app: 'getCategory'
            }
        }).then(function(data) {
             $.userSession.expire(); 
            var len = data.length,
                categoryElm = "";
            for (var a = 0; a < len; a++) {
                categoryElm += "<tr><td>" + data[a].id +
                    "</td><td>" + data[a].CategoryName +
                    "</td><td><button data-ctgid='" + data[
                        a].id +
                    "' id='deleteCtg' style='background:red'>DELETE</button></td></tr>";
            }
            categoryElm +=
                "<tr><td>?</td><td><input id='addCtgToDBName' type='text'/></td><td><button id='addCtgToDB'>ADD</button></td></tr>";
            $("#linkSubForm3").html(categoryElm);
        }, function() {
            ohSnap("failed to fetch ctg list");
        });
        event.stopImmediatePropagation();
    })
    $("#TEMPLATES").delegate("#deleteCtg", "click", function( event ) {
        var ctgid = $(this).data("ctgid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $(this).parents("tr").remove();
        $.server.request({
            route: {
                app: 'deleteCtg',
                ctgid: ctgid,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(function(data) {
             $.userSession.expire(); 
            ohSnap("deleted");
        }, function() {
            ohSnap("Server Failed to response");
        });
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#addCtgToDB", "click", function( event ) {
        var ctgName = $("#addCtgToDBName").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'addCtg',
                ctgName: ctgName,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(function(data) {
            if (isValid(data)) {
                 $.userSession.expire(); 
                $("#addCtg").click();
            }
        }, function() {
            ohSnap("Server Failed to response");
        });
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#addNewItem", "click", function( event ) {
        var itemCtg = $("#itemCategory").val(),
            itemtype = $("#itemCurrency").val(),
            itemMid = $("#itemMid").val(),
            itemSid = $("#itemSid").val(),
            itemName = $("#ItemName").val(),
            itemImage = $("#ItemImage").val(),
            itemDisc = $("#ItemDisc").val(),
            ItemPrice = $("#ItemPrice").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        if (itemCtg == 0) {
            ohSnap("Please Select Item Category");
            return false;
        }
        if (itemtype == 0) {
            ohSnap("Please Select Item Type");
            return false;
        }
        if (itemMid == "" || itemSid == "") {
            ohSnap("Item Mid Sid Cannot be empty");
            return false;
        }
        if (itemName == "") {
            ohSnap("You for got to add Item Name");
            return false;
        }
        if (ItemPrice == "") {
            $("#ItemPrice").focus();
            ohSnap("Please Set Item Price");
            return false;
        }
        itemImage = (itemImage == "") ? "NULL" : itemImage;
        itemDisc = (itemDisc == "") ? "NULL" : itemDisc;
        $.server.request({
            route: {
                app: 'addNewItem',
                itemCtg: itemCtg,
                itemtype: itemtype,
                ItemPrice: ItemPrice,
                itemMid: itemMid,
                itemSid: itemSid,
                itemName: itemName,
                itemImage: itemImage,
                itemDisc: itemDisc,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(function(data) {
            if (isValid(data)) {
                ohSnap("Item Added to store");
                $.userSession.expire(); 
                $("#createITEM").click();
            }
        }, function() {
            ohSnap("Server Failed to response");
        });
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#createITEM", "click", function( event ) {
        $.server.request({
            route: {
                app: 'getCategory'
            }
        }).then(
            //success callback
            function(data) {
                $.userSession.expire(); 
                var source  = $("#createItemView-wrapper").html();
                var template = Handlebars.compile(source);
                var html    = template( data );
                $("#linkSubForm3").html( html );
            },
            //fail callback
            function() {});
        event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#viewITEM", "click", function( event ) {
        var token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'getAllItem',
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback 
            function(data) {
                $.userSession.expire(); 
                var source  = $("#storeItemView-wrapper").html();
                var template = Handlebars.compile(source);
                var html    = template( data );
                $("#linkSubForm3").html( html );
            },
            //failed callbacks
            function() {
                ohSnap("Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#deleteItemAct", "click", function( event ) {
        $(this).parents("tr").remove();
        var id = $(this).data("productnum"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'deleteStoreItems',
                id: id,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                     $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#modifyItz", "click", function( event ) {
        var id = $(this).data("productnum"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        $.server.request({
            route: {
                app: 'loadEditItem',
                id: id,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                   
                     $.userSession.expire(); 
                     var source  = $("#editItemView-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    $("#linkSubForm3").html( html );
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
    $("#TEMPLATES").delegate("#updateItem", "click", function( event ) {
        var itemCtg = $("#itemCategory").val(),
            id = $(this).data("productnum"),
            itemtype = $("#itemCurrency").val(),
            itemMid = $("#itemMid").val(),
            itemSid = $("#itemSid").val(),
            itemName = $("#ItemName").val(),
            itemImage = $("#ItemImage").val(),
            itemDisc = $("#ItemDisc").val(),
            ItemPrice = $("#ItemPrice").val(),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin');
        if (itemCtg == 0) {
            ohSnap("Please Select Item Category");
            return false;
        }
        if (itemtype == 0) {
            ohSnap("Please Select Item Type");
            return false;
        }
        if (itemMid == "" || itemSid == "") {
            ohSnap("Item Mid Sid Cannot be empty");
            return false;
        }
        if (itemName == "") {
            ohSnap("You for got to add Item Name");
            return false;
        }
        if (ItemPrice == "") {
            $("#ItemPrice").focus();
            ohSnap("Please Set Item Price");
            return false;
        }
        itemImage = (itemImage == "") ? "NULL" : itemImage;
        itemDisc = (itemDisc == "") ? "NULL" : itemDisc;
        $.server.request({
            route: {
                app: 'updateEditItem',
                itemCtg: itemCtg,
                id:id,
                itemtype: itemtype,
                ItemPrice: ItemPrice,
                itemMid: itemMid,
                itemSid: itemSid,
                itemName: itemName,
                itemImage: itemImage,
                itemDisc: itemDisc,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(function(data) {
            if (isValid(data)) {
                ohSnap("Item Updated");
                $.userSession.expire(); 
                $("#linkSubForm3").empty();
            }
        }, function() {
            ohSnap("Server Failed to response");
        });
        event.stopImmediatePropagation();
    });

   $("#TEMPLATES").delegate("#webloadfunctionz", "click", function( event ) {
        var token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fID = $("#webconfigselected").val();
        elm = $("#linkSubForm4"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            configload = $.server.request({
                route: {
                    app: 'loadconfig',
                    fid: fID,
                    token: token,
                    auth: auth,
                    pin: pin
                }
            });
        switch (fID) {
            case "1":
                configload.done(function(data) {
                    
                    var source  = $("#webconfigReset-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "3":
                configload.done(function(data) {
                    
                    var source  = $("#webconfigChangeSc-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "4":
                configload.done(function(data) {
                    var source  = $("#webconfigRb-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "5":
                configload.done(function(data) {
                    var source  = $("#webconfigGtoVp-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "6":
               configload.done(function(data) {
                    var source  = $("#webconfigVote-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "8":
                configload.done(function(data) {
                    var source  = $("#webconfigVPStore-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "9":
               configload.done(function(data) {
                    var source  = $("#webconfigEPStore-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "10":
                configload.done(function(data) {
                    var source  = $("#webconfigRecharge-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            case "11":
                elm.html(
                    "<tr><td><h3>No Available settings</h3></td></tr>"
                );
                break;
            case "12":
                 configload.done(function(data) {
                    var source  = $("#webconfigStage-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data  );
                    elm.html( html );
                });
            case "13":
                 configload.done(function(data) {
                    var source  = $("#webconfigStage-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data  );
                    elm.html( html );
                });
            case "14":
                 configload.done(function(data) {
                    var source  = $("#webconfigStage-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data  );
                    elm.html( html );
                });
                break;
            case "29":
                 configload.done(function( data ) {
                    var source  = $("#webconfigGameTime-wrapper").html();
                    var template = Handlebars.compile(source);
                    var html    = template( data );
                    elm.html( html );
                });
                break;
            default:
                elm.empty();
                console.log(fID);
                break;
        }
        event.stopImmediatePropagation();
    });
 $("#TEMPLATES").delegate("#saveWebConfig", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            gold = $("#gold_ws").val(),
            ep = $("#ep_ws").val(),
            vp = $("#vp_ws").val(),
            status = $("#status_ws").val();
            
            if(gold<0 || gold != parseInt(gold, 10)){
                ohSnap("Please set to 0 if gold is not required");
                return false;
            }
            if(ep<0 || ep != parseInt(ep, 10)){
                ohSnap("Please set to 0 if EP is not required");
                return false;
            }
            if(vp<0 || vp != parseInt(vp, 10)){
                ohSnap("Please set to 0 if VP is not required");
                return false;
            }


        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                gold: gold,
                ep: ep,
                vp: vp,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                   ohSnap("Settings Updated");
                    $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigCs", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            gold = $("#gold_ws").val(),
            ep = $("#ep_ws").val(),
            vp = $("#vp_ws").val(),
            status = $("#status_ws").val();
            
            if(gold<0 || gold != parseInt(gold, 10)){
                ohSnap("Please set to 0 if gold is not required");
                return false;
            }
            if(ep<0 || ep != parseInt(ep, 10)){
                ohSnap("Please set to 0 if EP is not required");
                return false;
            }
            if(vp<0 || vp != parseInt(vp, 10)){
                ohSnap("Please set to 0 if VP is not required");
                return false;
            }


        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                gold: gold,
                ep: ep,
                vp: vp,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                   ohSnap("Settings Updated");
                    $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigRb", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            status = $("#status_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                  location.reload();
                    $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigRbStage", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token   = $.userSession.token,
            auth    = $.userSession.auth,
            pin     = store.get('pin'),
            gold    = $("#stagegold_ws").val(),
            level   = $("#stagelevel_ws").val(),
            max     = $("#stagemaxrb_ws").val(),
            reward  = $("#stagereward_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                gold: gold,
                level: level,
                max: max,
                reward: reward
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                  location.reload();
                    $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigGtV", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            rate = $("#vrate_ws").val(),
            status = $("#status_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                rate: rate,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                  location.reload();
                    $.userSession.expire(); 
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#addNewVoteLink", "click", function( event ) {

    $(this).closest('tr').prev().after("<tr><td>LINK NAME <input id='newlinkname_cs' type='text' value=''> </td><td>URL  <input id='newlinkurl_cs' type='text' value=''></td><td><button  id='addnewlinkCom'>ADD</button></td></tr>");
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#removeThisLink", "click", function( event ) {

   var id = $(this).data("delid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            that = this;
           

        $.server.request({
            route: {app: 'deleteVoteLink',
                id: id,
                token: token,
                auth: auth,
                pin: pin
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("link deleted");
                    $.userSession.expire(); 
                    $(that).closest('tr').remove();
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });  
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#addnewlinkCom", "click", function( event  ) {

   var token = $.userSession.token,
        auth = $.userSession.auth,
        pin = store.get('pin'),
        fname = $("#newlinkname_cs").val(),
        url = $("#newlinkurl_cs").val(),
        that = this;

        $.server.request({
            route: {app: 'addVoteLink',
                token: token,
                auth: auth,
                pin: pin,
                url: url,
                fname: fname
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("link updated");
                    $.userSession.expire(); 
                    $(that).closest('tr').html("<td>"+fname+"</td><td>"+url+"</td>");
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });  
    event.stopImmediatePropagation();
});
$("#TEMPLATES").delegate("#saveWebConfigVotelink", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            reward = $("#vrate_ws").val(),
            status = $("#status_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                status: status,
                reward:reward
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("Vote Config updated");
                    $.userSession.expire(); 
                
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigVPStore", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            status = $("#status_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("Store updated");
                    $.userSession.expire(); 
                
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigEPStore", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            status = $("#status_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("Setting updated");
                    $.userSession.expire(); 
                
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigRecharge", "click", function( event ) {
       
        var id = $(this).data("configid"),
            token = $.userSession.token,
            auth = $.userSession.auth,
            pin = store.get('pin'),
            fname = $("#functioNamez").val(),
            status = $("#status_ws").val();

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                fname: fname,
                status: status
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("Setting updated");
                    $.userSession.expire(); 
                
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });
$("#TEMPLATES").delegate("#saveWebConfigGametime", "click", function( event ) {
       
        var id      = $(this).data("configid"),
            token   = $.userSession.token,
            auth    = $.userSession.auth,
            pin     = store.get('pin'),
            reward  = $("#rewards_wws").val()

        $.server.request({
            route: {app: 'saveconfig',
                id: id,
                token: token,
                auth: auth,
                pin: pin,
                reward: reward
            }
        }).then(
            //success callback
            function(data) {
                if (isValid(data)) {
                    ohSnap("Setting updated");
                    $.userSession.expire(); 
                
                }
            },
            //fail callback
            function() {
                ohSnap(" Server Failed to response");
            });
    event.stopImmediatePropagation();
    });

