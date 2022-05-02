## The following code is the backend python for the web server using the flask library & socketio

#importing modules and dependencies
from flask import Flask, render_template, session, escape
import random
from flask_socketio import SocketIO, emit
#from engineio.payload import Payload
import string
from flask_ngrok import run_with_ngrok
import time

#Payload.max_decode_packets = 50

#the async server does not take any special modes hence "async_mode = none"
async_mode = None
#this list of possiblekeys has a randomly generated key with 9 alphanumeric characters 
possiblekeys = [''.join(random.SystemRandom().choice(string.ascii_uppercase + string.digits) for _ in range(9))]
#this initialized the flask app by setting the app equal to the flask with the parameter of name
app = Flask(__name__)
run_with_ngrok(app)
#this accesses our previously written 9 character alphanumeric string written earlier and sets it equal to the app's key and keeps the client side secure.  this key encrypts the cookies and sends them encrypted to the browser.
app.config['SECRET_KEY'] = random.choice(possiblekeys)
#this sets the app for the socketio webserver and 
socketio = SocketIO(app, async_mode=async_mode)
#thread = None
#thread_lock = Lock()

#this sets the route the webserver will be hosting and it specifically hosts the index.html file in the templates folder with async_mode=socketio.async_mode
@app.route('/')
def index():
    return render_template('index.html', async_mode=socketio.async_mode)

#this is the handler for when there is a event(aka a message inputted) in the websocket / flask and it emits (function in flask) the message inputted along with other data such as name, color and data of the message
@socketio.event
def send_message_event(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    message_time = time.strftime("%-I:%M:%S %p")
    emit('my_response',
         {'data': escape(message['data']), 'count': session['receive_count'], 'name': escape(message['name']), 'color': escape(message['color']), 'time': message_time},
         broadcast=True)

#this is the code for the ping display in the top right corner.  it defines the event my_ping and will be accessed in the javascript file
@socketio.event
def my_ping():
    emit('my_pong')

#this is the event if a client connects to the webserver
@socketio.event
def connect():
    global thread

#this sets the parameters for the socketio app and essentially states the app is the flask app, the app will be visible to all on the network, debuf mode is not on, and sets port 5000 
if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", debug=False, port=5000)
    app.run()
