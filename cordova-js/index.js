//NOTIFICATION HANDLERS
notification = null;

//ANDROID
function successHandler (result) {
    console.log('result = ' + result);
}
function errorHandler (error) {
    console.log('error = ' + error);
}

//IOS
function tokenHandler (result) {
    var xhr = new XMLHttpRequest();
    var url =  "http://meteocity.com/ws/registerDevice?token="+result;
    xhr.open('GET',url);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xhr.send();
    xhr.onreadystatechange=function(){
        if (xhr.readyState==4 && xhr.status==200){
            var response=JSON.parse(xhr.responseText);
            if(response != "-1"){
                localStorage.setItem("device_id", response);
            }
        }
    }
}

// iOS
onNotificationAPN = function(event) {
    notification = event.alert;
    localStorage.setItem("notifications", true);
    if (event.alert){
        navigator.notification.alert(event.alert);
    };
    if ( event.sound ){
        var snd = new Media(event.sound);
        snd.play();
    };
    if ( event.badge ){
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    };
};


// Android
function onNotificationGCM(e) {
    switch( e.event ){
    case 'registered':
        if ( e.regid.length > 0 ){
            var xhr = new XMLHttpRequest();

            //A changer !
            var url =  "http://www.meteocity.com/ws/registerDevice/";
            xhr.open('POST',url);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.send("regId="+e.regid);
             xhr.onreadystatechange=function(){
                if (xhr.readyState==4 && xhr.status==200){
                    var response=JSON.parse(xhr.responseText);
                    if(response != "-1"){
                        localStorage.setItem("device_id", response);
                    }
                }

            }
        }
    break;

    case 'message':
        // if this flag is set, this notification happened while we were in the foreground.
        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
        if (e.foreground){
        }
        else{  // otherwise we were launched because the user touched a notification in the notification tray.
            window.location.href='/#!/notification';
        }
        // console.log(e.payload.message);
        // $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
        // $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
    break;

    case 'error':
    break;
  }
}





var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },


    receivedEvent: function(id) {
        var pushNotification = window.plugins.pushNotification;
        if ( device.platform == 'android' || device.platform == 'Android' ){
            try {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    //A modifier si c'est Meteo, à laisser si c'est Oxygem
                    "senderID":"204888071309",
                    "ecb":"onNotificationGCM"
                });
            } catch(e) {
                console.log(e);
            }
        }
        else{
            try {
                pushNotification.register(
                tokenHandler,
                errorHandler, {
                    "badge":"true",
                    "sound":"true",
                    "alert":"true",
                    "ecb":"onNotificationAPN"
                });
            } catch(e) {
                console.log(e);
            }
        }
    }
};
