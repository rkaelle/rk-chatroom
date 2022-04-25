var n = prompt("Enter a name");
var colors = ['#6B7566', "#495660", "#667979", "#847F80", "#A081AD",'#99CCED','#FF5733', '#9A33FF','#D4FF33','#33FF92','#C233FF','#FF3336','#FF338F','#3398FF','#FF9933','#339EFF','#BCFF33','#FFFFFF'];
var c = colors[Math.floor(colors.length * Math.random())];
//const timestamp = new Date.now()

$(document).ready(function() {
    var socket = io();

    socket.on('my_response', function(msg, cb) {
        console.log(msg);
        $('#message-box').append(`<div class='message flex-container'>
            <div class="flex-item">
                <span class='name' style='background-color: ${msg.color}'>${msg.name}</span>
            </div>
            <div class="flex-item">
               ${msg.data}  
            </div>
            <div class="flex-item">
                <span class="time"> ${msg.time}</span>
            </div>`);
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
        socket.emit('send_message_event', {data: $('#broadcast_data').val(), name: n, color: c });
        $("#broadcast_data").val("");
        return false;
    });
});