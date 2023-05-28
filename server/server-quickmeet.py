from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room, send, emit
import os
from datetime import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

socketio = SocketIO(app)

rooms = {}
socketroom = {}
socketname = {}
micSocket = {}
videoSocket = {}
roomBoard = {}
_users_in_room = {} # stores room wise user list
_room_of_sid = {} # stores room joined by an used
_name_of_sid = {} # stores display name of users

@app.route('/')
def index():
    return app.send_static_file('index.html')

@socketio.on('connect')
def handle_connect():
    pass

@socketio.on('join room')
def handle_join_room(data):
    roomid = data['roomid']
    username = data['username']
    join_room(roomid)
    socketroom[request.sid] = roomid
    socketname[request.sid] = username
    micSocket[request.sid] = 'on'
    videoSocket[request.sid] = 'on'

    if roomid in rooms and len(rooms[roomid]) > 0:
        rooms[roomid].append(request.sid)
        socketio.to(roomid).emit('message', f'{username} joined the room.', 'Bot', datetime.now().strftime("%I:%M %p"))
        socketio.emit('join room', rooms[roomid], socketname, micSocket, videoSocket, room=roomid)
    else:
        rooms[roomid] = [request.sid]
        socketio.emit('join room', None, None, None, None, room=roomid)

    socketio.emit('user count', len(rooms[roomid]), room=roomid)

@socketio.on('action')
def handle_action(msg):
    if msg == 'mute':
        micSocket[request.sid] = 'off'
    elif msg == 'unmute':
        micSocket[request.sid] = 'on'
    elif msg == 'videoon':
        videoSocket[request.sid] = 'on'
    elif msg == 'videooff':
        videoSocket[request.sid] = 'off'

    socketio.to(socketroom[request.sid]).emit('action', msg, request.sid)

@socketio.on('video-offer')
def handle_video_offer(data):
    offer = data['offer']
    sid = data['sid']
    socketio.to(sid).emit('video-offer', offer, request.sid, socketname[request.sid], micSocket[request.sid], videoSocket[request.sid])

@socketio.on('video-answer')
def handle_video_answer(data):
    answer = data['answer']
    sid = data['sid']
    socketio.to(sid).emit('video-answer', answer, request.sid)

@socketio.on('new icecandidate')
def handle_new_icecandidate(data):
    candidate = data['candidate']
    sid = data['sid']
    socketio.to(sid).emit('new icecandidate', candidate, request.sid)

@socketio.on('message')
def handle_message(data):
    msg = data['msg']
    username = data['username']
    roomid = data['roomid']
    socketio.to(roomid).emit('message', msg, username, datetime.now().strftime("%I:%M %p"))