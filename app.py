##rk create task comsci
# from threading import Lock
from flask import Flask, render_template, session
import random
from random import randrange
from flask_socketio import SocketIO, emit
from engineio.payload import Payload
import string

#Payload.max_decode_packets = 50

async_mode = None
possiblekeys = [''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(9)),'thiscouldpossiblybeakey']
app = Flask(__name__)
app.config['SECRET_KEY'] = possiblekeys[randrange(2)]
socketio = SocketIO(app, async_mode=async_mode)
# thread = None
# thread_lock = Lock()




@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)


@socketio.event
def my_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']})


@socketio.event
def my_broadcast_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count'], 'name': message['name']},
         broadcast=True)

@socketio.event
def ping():
    emit('pong')


@socketio.event
def connect():
    global thread
    #with thread_locxk:
        #if thread is None:
            #thread = socketio.start_background_task(background_thread)
    emit('my_response', {'data': 'Connected', 'count': 0})


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", debug=False, port=5000)