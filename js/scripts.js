//Enable camera/microphone access
navigator.getWebcam = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

navigator.getWebcam({audio: true, video: true}, function(stream) {

    window.localStream = stream;

    console.log("Camera access permitted. Streaming...");

    $('#local').prop('src', URL.createObjectURL(window.localStream));

}, function(){ console.log("error"); });

$(function() {

    var local = new Peer();
    
    local.on('open', function(id) {

        $('#local-id').text(id);
        $('#local-status').text("Connection open.");
    });
    
    var remote = new Peer();
    
    remote.on('open', function(id) {

        $('#remote-id').text(id);
        $('#call-id').val(id);
        $('#remote-status').text("Connection open.");
    });
    
    remote.on('call', function(call) {
        
        $('#remote-status').text("Answering call from local peer");
        call.answer(window.localStream);    
        
        call.on('stream', function(stream) {

            $('#remote-status').text("Displaying local peer's stream.");
            $('#remote').prop("src", URL.createObjectURL(stream));
        });
    });

    $('#make-call').click(function() {

        $('#local-status').text("Calling remote peer.");
        local.call($('#call-id').val(), window.localStream);

    });

    $('#end-call').click(function() {
        $('#remote-status').text("Ending call.");
		window.existingCall.close();
	});
});