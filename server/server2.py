from collections import defaultdict
import os
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit, join_room, leave_room

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)

# Initialize SocketIO
socketio = SocketIO(app)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(".\debate-center-dd720-firebase-adminsdk-pepv1-07be2008cd.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

socket_to_user = {}
room_to_sockets = defaultdict(list)
socket_to_room = {}


@app.route('/create_room', methods=['POST'])
def create_room():
    # Get the request data
    room_data = request.get_json()
    name = room_data.get('name')
    tags = room_data.get('tags')
    teams = room_data.get('teams')
    room_size = room_data.get('room_size')
    time_to_start = room_data.get('time_to_start')
    spectators = room_data.get('spectators')
    moderator = room_data.get('moderator')

    # Create a new room document
    new_room = {
        'name': name,
        'tags': tags,
        'teams': teams,
        'room_size': room_size,
        'time_to_start': time_to_start,
        'spectators': spectators,
        'ready_list': [],
        'spectators_list': [],
        'moderator': moderator
    }

    # Add the room to the Firestore collection
    room_ref = db.collection('rooms').document()
    room_ref.set(new_room)

    # Return the room ID as a response
    return jsonify({'roomId': room_ref.id}), 200


@socketio.on('connect')
def handle_connect():
    pass

@socketio.on('joinRoom')
def handle_join_room(payload):
    room_id = payload['roomId']
    username = payload['username']
    join_room(room_id)
    # query user from database
    users_in_this_room = [socket_to_user[sid] for sid in room_to_sockets[room_id]]
    socket_to_user[request.sid] = username
    room_to_sockets[room_id].append(request.sid)
    emit('usersInRoom', users_in_this_room, room=room_id)


@socketio.on('sendingSignal')
def handle_sending_signal(payload):
    user_id_to_send_signal = payload['userIdToSendSignal']
    emit('userJoined', {'signal': payload['signal'], 'callerId': payload['callerId']}, to=user_id_to_send_signal)

@socketio.on('returningSignal')
def handle_returning_signal(payload):
    caller_id = payload['callerId']
    emit('returningSignalAck', {'signal': payload['signal'], 'id': request.sid}, to=caller_id)

@socketio.on('sendMessage')
def handle_send_message(payload):
    message = payload['message']
    room_id = payload['roomId']
    username = payload['username']
    # save message to database ?
    emit('receiveMessage', {'message': message, 'username': username}, room=room_id)

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

# Run the Flask app
if __name__ == '__main__':
    app.run()
