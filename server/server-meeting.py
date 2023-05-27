import os
from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room
from dotenv import load_dotenv
import jwt
from models import User

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app)

load_dotenv()

PORT = 8000

@app.route('/')
def index():
    return "Server is up and running"

@socketio.on('connect')
def handle_connect():
    pass

@socketio.on('joinRoom')
def handle_join_room(room_id):
    user_token = request.args.get('token')
    try:
        payload = jwt.decode(user_token, os.getenv('SECRET'))
        socketio.clients[request.sid]['userId'] = payload
        user = User.query.filter_by(id=payload).first()
        socketio.clients[request.sid]['username'] = user.username
        socketio.clients[request.sid]['name'] = user.name
        join_room(room_id)
        if room_id in socketio.server.rooms:
            socketio.server.rooms[room_id].append(request.sid)
        else:
            socketio.server.rooms[room_id] = [request.sid]
        users_in_this_room = [socketio.clients[client]['userId'] for client in socketio.server.rooms[room_id] if client != request.sid]
        emit('usersInRoom', users_in_this_room, room=room_id)
    except jwt.InvalidTokenError:
        print('Invalid token')

@socketio.on('sendingSignal')
def handle_sending_signal(payload):
    user_id_to_send_signal = payload['userIdToSendSignal']
    emit('userJoined', {'signal': payload['signal'], 'callerId': payload['callerId']}, to=user_id_to_send_signal)

@socketio.on('returningSignal')
def handle_returning_signal(payload):
    caller_id = payload['callerId']
    emit('takingReturnedSignal', {'signal': payload['signal'], 'id': request.sid}, to=caller_id)

@socketio.on('sendMessage')
def handle_send_message(payload):
    message = payload['message']
    name = socketio.clients[request.sid]['name']
    username = socketio.clients[request.sid]['username']
    emit('receiveMessage', {'message': message, 'name': name, 'username': username}, room=payload['roomId'])

@socketio.on('disconnect')
def handle_disconnect():
    room_id = None
    for room, clients in socketio.server.rooms.items():
        if request.sid in clients:
            room_id = room
            clients.remove(request.sid)
            break
    if room_id is not None:
        leave_room(room_id)
        emit('userLeft', request.sid, room=room_id)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=PORT)
