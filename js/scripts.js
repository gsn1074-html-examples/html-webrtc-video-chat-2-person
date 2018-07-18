navigator.getWebcam = ( navigator.getUserMedia || 
                        navigator.webkitGetUserMedia || 
                        navigator.mozGetUserMedia || 
                        navigator.msGetUserMedia);

var peer = new Peer({ 
   debug: 3,
   config: {'iceServers': 
    [
        { url: 'stun:stun.l.google.com:19302' },
            // { url: 'stun:stun1.l.google.com:19302' },
            // { url: 'turn:numb.viagenie.ca', username:"gsn1074@gmail.com", credential:"!@Numb1992"}
    ]
  }
});

//set my ID in UI
peer.on('open', function(){

    console.log("In peer.onOpen() -- set my id in UI");
    $('#my-id').text(peer.id);

});

// Answer automatically for demo
peer.on('call', function(call) {

    console.log("In peer.oncall() -- answering incoming call");
    call.answer(window.localStream);
    HandleIncomingCall_3(call);

});

// Click handlers setup
$(function() {

    $('#make-call').click(function() {

        var callToId = $('#callto-id').val();

        console.log("Clicked make call button:");
        console.log("Calling: " + callToId);

        var call = peer.call(callToId, window.localStream);
        HandleIncomingCall_3(call);

    });

    $('end-call').click(function() {

        console.log("Clicked end call button.");

        window.existingCall.close();
        ShowRemoteConnectionPrompt_2();
    });

    $('#step1-retry').click(function() {

        console.log("Clicked retry button.");

        $('#step1-error').hide();
        getLocalSteam_1();
    });

    getLocalSteam_1();
});

//Get audio/video stream
// Display the video stream in the video object
function getLocalSteam_1() {
 
    console.log("In getLocalSteam_1");

    navigator.getWebcam({audio: false, video: true}, function(stream){

        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        ShowRemoteConnectionPrompt_2();

    }, function(){ $('#step1-error').show(); });
}

//Adjust the UI
function ShowRemoteConnectionPrompt_2() { 
    console.log("In step2 - showing remote connection controls");
    $('#getLocalSteam_1').hide();
    $('#HandleIncomingCall_3').hide();
    $('#ShowRemoteConnectionPrompt_2').show();
}

// Hang up on an existing call if present
function HandleIncomingCall_3(call) {
    console.log("In HandleIncomingCall_3");
    if (window.existingCall) {
        window.existingCall.close();
    }

    console.log("waiting on incoming call.");
    // Wait for stream on the call, then setup peer video
    call.on('stream', function(stream) {
        console.log("****incoming call recieved.****");
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    console.log("updating ui in HandleIncomingCall_3");
    
    $('#getLocalSteam_1').hide();
    $('#ShowRemoteConnectionPrompt_2').hide();
    $('#HandleIncomingCall_3').show();
}
