import firebase_admin
from firebase_admin import credentials
from firebase_admin import db, firestore
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

# Initialize Firebase Admin SDK for Firestore
cred_firestore = credentials.Certificate("D:\VSC\debate\server\debate-center-dd720-firebase-adminsdk-pepv1-07be2008cd.json")
app_firestore = firebase_admin.initialize_app(cred_firestore, name='Firestore')
db_firestore = firestore.client(app_firestore)


@socketio.on('connect')
def handle_connect():
    print('Client connected. id=', request.sid)


# ---------- CREATE ROOM PAGE ---------- #
@app.route('/api/create_room', methods=['POST'])
def create_room():
    room_data = request.json
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
        'users_list': {},
        'spectators_list': [],
        'moderator': moderator,
        'is_conversation': False,
    }

    # Add the room to Firestore (assuming you have initialized the Firestore client)
    room_ref = db_firestore.collection('rooms').document()
    room_ref.set(new_room)

    # Return the room ID as a response
    return jsonify({'roomId': room_ref.id})
# -------------------------------------- #

# -------------- ROOM PAGE ------------- #
@socketio.on('join_room')
def join_debate_room(data):
    
    # Get the request data
    rec_data = data
    room_id = rec_data.get('roomId')
    # user_id = rec_data.get('userId')
    user_id = request.remote_addr
    
    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()

    if not room_doc.exists:
        # Room not found, send a specific response
        emit('room not found', {'error': 'Room not found'})
        return

    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', [])
    room_size = room_data.get('room_size', 0)

    if len(users_list) >= room_size and user_id not in users_list:
        # Room is full, send a specific response
        emit('room is full', room=request.sid)
        return

    if user_id not in users_list:
        users_list.update({user_id: {'ready': False, 'team': False}})
        room_ref.update({'users_list': users_list})  # Add user to the users_list in Firestore

        updated_room_doc = room_ref.get()
        updated_room_data = updated_room_doc.to_dict()
        room_data = updated_room_data
        # Notify all users in the room about the change
        emit('room_data_updated', updated_room_data, room=room_id)

    # Join the SocketIO broadcast room
    join_room(room_id)
    emit('join', room_data ,room=request.sid)


@socketio.on('leave_room')
def leave_debate_room(data):
    # Get the request data
    rec_data = data
    room_id = rec_data.get('roomId')
    user_id = rec_data.get('userId')

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()

    if not room_doc.exists:
        # Room not found, send a specific response
        emit('leave_room_error', {'error': 'Room not found'})
        return

    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', [])
    room_size = room_data.get('room_size', 0)

    if user_id not in users_list:
        emit('leave_room_error', {'error': 'User is not in the room'})
        return

    users_list.remove(user_id)
    room_ref.update({'users_list': users_list})

    # Join the SocketIO broadcast room
    leave_room(room_id)

    updated_room_doc = room_ref.get()
    updated_room_data = updated_room_doc.to_dict()

    # Notify all users in the room about the change
    emit('room_data_updated', updated_room_data, room=room_id)


@socketio.on('fetch_room_data')
def fetch_room_data(data):
    # Get the request data
    room_data = data
    room_id = room_data.get('roomId')

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()

    if room_doc.exists:
        room_data = room_doc.to_dict()
        emit('room_data', room_data, room=request.sid)
    else:
        # Room not found, send a specific response
        emit('fetch_room_data_error', {'error': 'Room not found'})
# -------------------------------------- #

# ---------- USERS SHOW ---------- #
@socketio.on('switch_team')
def switch_team(details):
    print(details)

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(details['roomId'])
    room_doc = room_ref.get()

    if not room_doc.exists:
        return
    
    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', {})

    if details['userId'] not in users_list:
        return
    
    user = users_list[details['userId']]
    users_list.update({details['userId']: {'ready': user['ready'], 'team': not user['team']}})
    room_ref.update({'users_list': users_list})  # Add user to the users_list in Firestore

    updated_room_doc = room_ref.get()
    updated_room_data = updated_room_doc.to_dict()

    # Notify all users in the room about the change
    emit('room_data_updated', updated_room_data, room=details['roomId'])

@socketio.on('ready_click')
def handle_ready_click(details):
    print(details)

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(details['roomId'])
    room_doc = room_ref.get()

    if not room_doc.exists:
        return
    
    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', {})

    if details['userId'] not in users_list:
        return
    
    user = users_list[details['userId']]
    users_list.update({details['userId']: {'ready': not user['ready'], 'team': user['team']}})
    room_ref.update({'users_list': users_list})  # Add user to the users_list in Firestore

    updated_room_doc = room_ref.get()
    updated_room_data = updated_room_doc.to_dict()

    # Notify all users in the room about the change
    emit('room_data_updated', updated_room_data, room=details['roomId'])

if __name__ == '__main__':
    socketio.run(app, host='10.0.0.20', port=5000, debug=True)
