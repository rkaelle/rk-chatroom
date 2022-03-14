var n = prompt("Enter a name");
var colors = ["teal", "magenta", "gainsboro", "aquamarine", "indigo"];
var c = colors[Math.floor(colors.length * Math.random())];

$(document).ready(function() {
    var socket = io();

    socket.on('my_response', function(msg, cb) {
        $('#message-box').append(`<div class='message'><span class='name' style='background-color: ${msg.color}'>${msg.name}</span>   ${msg.data}</div>`);
        $("#message-box").scrollTop($("#message-box")[0].scrollHeight);
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
        socket.emit('my_broadcast_event', {data: $('#broadcast_data').val(), name: n, color: c, time: Date.now()});
        $("#broadcast_data").val("");
        return false;
    });
});