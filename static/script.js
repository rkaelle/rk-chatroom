$(document).ready(function() {
    var socket = io();
    var n = ""
    var n = prompt("Enter name");

    socket.on('connect', function() {
        socket.emit('my_event', {data: 'Connected!'});
    });

    socket.on('my_response', function(msg, cb) {
        $('#message-box').append(`<div class='message'>${msg.name}   ${msg.data}</div>`);
        if (cb)
            cb();
    });

    var ping_pong_times = [];
    var start_time;
    window.setInterval(function() {
        start_time = (new Date).getTime();
        $('#transport').text(socket.io.engine.transport.name);
        socket.emit('my_ping');
    }, 1000);

    socket.on('my_pong', function() {
        var latency = (new Date).getTime() - start_time;
        ping_pong_times.push(latency);
        ping_pong_times = ping_pong_times.slice(-10);
        var sum = 0;
        for (var i = 0; i < ping_pong_times.length; i++)
            sum += ping_pong_times[i];
        $('#ping-pong').text(Math.round(10 * sum / ping_pong_times.length) / 10);
    });


    $('form#broadcast').submit(function(event) {
        event.preventDefault();
        socket.emit('my_broadcast_event', {data: $('#broadcast_data').val(), name: n});
        $("#broadcast_data").val("");
        return false;
    });
});