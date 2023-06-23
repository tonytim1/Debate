import dataclasses
import os
import time
import uuid

import firebase_admin
import pyrebase
from firebase_admin import credentials, auth
from firebase_admin import firestore
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit

from models import Room, User

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./server/debate-center-firebase-key.json"

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins='*')

config = {
  'apiKey': "AIzaSyDgh6sFpRq3YmEJDW4Z-L4ReInFSkA6NSY",
  'authDomain': "debate-center-dd720.firebaseapp.com",
  'databaseURL': "https://debate-center-dd720-default-rtdb.europe-west1.firebasedatabase.app",
  'projectId': "debate-center-dd720",
  'storageBucket': "debate-center-dd720.appspot.com",
  'messagingSenderId': "524928099280",
  'appId': "1:524928099280:web:9b24e083399f9bfae0cfd5"
}

# Initialize Firebase Admin SDK for Firestore
cred_firestore = credentials.Certificate("./server/debate-center-firebase-key.json")
app_firestore = firebase_admin.initialize_app(cred_firestore, name='Firestore', options={
    'storageBucket': config['storageBucket']
})

db_firestore = firestore.client(app_firestore)

# Auth
firebase_auth = pyrebase.initialize_app(config)
auths = firebase_auth.auth()

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html') 


@socketio.on('connect')
def handle_connect():
    print('Client connected. id=', request.sid)

# ---------- SIGN UP ---------- #
@app.route('/api/signup', methods=['POST'])
def signup():
    user_data = request.get_json()
    
    email = user_data.get('email')
    password = user_data.get('password')
    
    name = user_data.get('name')
    username = user_data.get('username')
    tags = user_data.get('tags')
    image = user_data.get('image')

    try:
        # create new user base on email and password
        new_user = auths.create_user_with_email_and_password(email=email, password=password)
        login_user = auths.sign_in_with_email_and_password(email, password)
        token = login_user['idToken']
        user_info = auths.get_account_info(token)['users'][0]
        user_id = user_info['localId']

        # Add user details to database
        user_ref = db_firestore.collection('users').document(user_id)
        user_ref.set({
            'name': name,
            'username': username,
            'tags':tags
        })

        # # # Add image
        # # destination_blob_name = f'users/{user_id}/profile _image'
        # # bucket = storage.bucket(app=app_firestore)
        # # blob = bucket.blob(destination_blob_name)
        # # blob.upload_from_filename('C:\\Users\\t-idobanyan\Desktop\pic.jpg')

        # # # Get the download URL of the uploaded image
        # # download_url = blob.generate_signed_url(
        # #     version='v4',
        # #     expiration=datetime.timedelta(days=7),
        # #     method='GET'
        # # )

        # # Store the download URL in the user's document in Firestore
        # user_ref.update({'image': download_url})
        
        
        # Return success response
        return jsonify({'message': 'Signup successful', 'userId': username, 'token': token }), 200
    
    except auth.EmailAlreadyExistsError:
        # Handle case when the provided email already exists
        return jsonify({'error': 'Email already exists'}), 400
    
    except Exception as e:
        # Handle other errors
        print(e)
        return jsonify({'error': str(e)}), 500


# ---------- SIGN IN ---------- #
@app.route('/api/signin', methods=['POST'])
def signin():
    user_data = request.get_json()
    email = user_data.get('email')
    password = user_data.get('password')
    try:
        login_user = auths.sign_in_with_email_and_password(email, password)
        token = login_user['idToken']
        print(token)
        user_info = auths.get_account_info(token)['users'][0]
        user_id = user_info['localId']

        users_ref = db_firestore.collection('users').document(user_id)
        users_user_data = users_ref.get().to_dict()
        username = users_user_data['username']

        # Return success response
        return jsonify({'message': 'Login successful', 'userId': username, 'token': token }), 200
    
    except Exception as e:
        # Handle other errors
        print(e)
        return jsonify({'error': str(e)}), 500

# user_to_socket = {}
# room_to_users = {}
# room_to_sockets = {}
socket_to_user = {}
socket_to_room = {}
rooms = {}

# ---------- USER INFO ---------- #
@app.route('/api/user', methods=['GET'])
def get_user():
    id_token = request.headers.get('Authorization')
    print(id_token)
    try:
        decoded_token = auths.get_account_info(id_token)['users'][0]
        user_uid = decoded_token['localId']
        user_ref = db_firestore.collection('users').document(user_uid)
        user_doc = user_ref.get().to_dict()
        user_doc["email"] = decoded_token['email']
        return jsonify(user_doc)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------- HOME PAGE ---------- #
@socketio.on("fetch_all_rooms")
def get_all_rooms():
    sid = request.sid
    print(f"fetch_all_rooms sid: {sid}")
    # sort by current users in room
    sorted_rooms = {k: dataclasses.asdict(v) for k, v in sorted(rooms.items(), key=lambda item: -len(item[1].users_list))}
    socketio.emit("all_rooms", sorted_rooms, room=sid)


# ---------- CREATE ROOM PAGE ---------- #
@app.route('/api/create_room', methods=['POST'])
def create_room():
    room_data = request.json
    room_id = uuid.uuid4().hex

    room = Room(
        id = room_id,
        name=room_data.get('name'),
        tags=room_data.get('tags'),
        teams=room_data.get('teams'),
        team_names=room_data.get('teamNames'),
        room_size=room_data.get('room_size'),
        time_to_start=time.time() + room_data.get('time_to_start') * 60,
        spectators=room_data.get('spectators'),
        users_list={},
        spectators_list=[],
        moderator=room_data.get('moderator'),
        is_conversation=False,
        pictureId=room_data.get('pictureId', -1),
    )
    rooms[room_id] = room
    socketio.emit("rooms_updated") # TODO: send only the new room

    # Return the room ID as a response
    return jsonify({'roomId': room_id})


# -------------- ROOM PAGE ------------- #
@socketio.on('join_room')
def join_debate_room(data):
    # Get the request data
    sid = request.sid
    room_id = data.get('roomId')
    user_id = data.get('userId')
    print(f"join_room room_id: {room_id}, sid: {sid}, user_id: {user_id}")

    if room_id not in rooms:
        # Room not found, send a specific response
        emit('room not found', {'error': 'Room not found'})
        return

    room = rooms[room_id]

    if len(room.users_list) >= room.room_size and user_id not in room.users_list:
        # Room is full, send a specific response
        emit('room is full', room=sid)
        return
    
    if room.is_conversation:
        # if not room.specators:
        #     print("uesr tried to join conversation room that doesnt have spectators")
        #     emit('room is full', room=sid)
        #     return
        # # TODO: add user to spectators list
        room.spectators_list.append(user_id)
        emit('user_join', dataclasses.asdict(room) ,room=sid)


    if user_id not in room.users_list and user_id is not None:
        room.users_list.update({user_id: User(sid=sid, ready=False, team=False)})

        # Notify all users in the room about the change
        emit('room_data_updated', dataclasses.asdict(room), to=room_id)

    # Join the SocketIO broadcast room
    socket_to_room[request.sid] = room_id
    socket_to_user[request.sid] = user_id
    join_room(room_id)
    emit('user_join', dataclasses.asdict(room), room=sid)


@socketio.on('leave_click')
def leave_debate_room(data):
    # Get the request data
    sid = request.sid
    room_id = data.get('roomId')
    user_id = data.get('userId')

    if sid in socket_to_room:
        socket_to_room.pop(sid)
    if sid in socket_to_user:
        socket_to_user.pop(sid)

    if room_id not in rooms:
        # Room not found, send a specific response
        emit('leave_room_error', {'error': 'Room not found'})
        return

    room = rooms[room_id]

    if user_id not in room.users_list:
        emit('leave_room_error', {'error': 'User is not in the room'})
        leave_room(room_id)
        return

    room.users_list.pop(user_id)

    if not room.users_list:
        # Delete the room if no users are left
        emit("rooms_updated", broadcast=True)  # TODO: send only the deleted room
        rooms.pop(room_id)
        leave_room(room_id)
        return

    # If the moderator left, assign a new moderator
    if user_id == room.moderator:
        room.moderator = list(room.users_list.keys())[0]

    # leave the SocketIO broadcast room
    leave_room(room_id)

    # Notify all users in the room about the change
    emit('room_data_updated', dataclasses.asdict(room), to=room_id)


@socketio.on('fetch_room_data')
def fetch_room_data(data):
    # Get the request data
    room_id = data.get('roomId')

    if room_id not in rooms:
        # Room not found, send a specific response
        emit('fetch_room_data_error', {'error': 'Room not found'})
        return

    room = rooms[room_id]
    emit('room_data', dataclasses.asdict(room), room=request.sid)

# -------------------------------------- #

# ------------- USERS SHOW ------------- #
@socketio.on('switch_team')
def switch_team(data):
    room_id = data.get('roomId')
    user_id = data.get('userId')

    if room_id not in rooms:
        return

    room = rooms[room_id]
    
    if user_id not in room.users_list:
        return
    
    user = room.users_list[user_id]
    user.team = not user.team

    # Notify all users in the room about the change
    emit('room_data_updated', dataclasses.asdict(room), to=room_id)

@socketio.on('ready_click')
def handle_ready_click(data):
    room_id = data.get('roomId')
    user_id = data.get('userId')
    print(f"ready_click room_id: {room_id}, sid: {request.sid}, user_id: {user_id}")

    if room_id not in rooms:
        return
    
    room = rooms[room_id]
    
    if user_id not in room.users_list:
        return
    
    user = room.users_list[user_id]
    user.ready = not user.ready

    # Notify all users in the room about the change
    emit('room_data_updated', dataclasses.asdict(room), to=room_id)

# -------------------------------------- #

# -------------- CONVERSATION PAGE ------------- #

@socketio.on('start_conversation_click')  # TODO: add a thread that checks the timer for each room and starts conversation when it reaches 0
def handle_conversation_start(data):
    room_id = data.get('roomId')

    if room_id not in rooms:
        return
    
    rooms[room_id].is_conversation = True
    
    # Notify all users in the room about the change
    emit('conversation_start', to=room_id)

# -------------- SIGNALING ------------- #
    
@socketio.on('sendingSignal')
def handle_sending_signal(payload):
    user_sid_to_send_signal = payload['userSidToSendSignal']
    user_id = payload['userId']
    # caller_id should be request.sid
    print(f"got sendingSignal from user: {user_id}, sid: {request.sid}, caller_id: {payload['callerId']}, to: {user_sid_to_send_signal}")
    emit('sendingSignalAck', {'signal': payload['signal'], 'callerId': payload['callerId'], 'userId': user_id}, to=user_sid_to_send_signal)

@socketio.on('returningSignal')
def handle_returning_signal(payload):
    caller_id = payload['callerId']
    user_id = payload['userId']
    print(f"got returningSignal from user: {user_id}, sid: {request.sid}, caller_id: {caller_id}")
    emit('returningSignalAck', {'signal': payload['signal'], 'calleeId': request.sid, 'userId': user_id}, to=caller_id)

@socketio.on('disconnect')
def handle_disconnect():
    # Get the request data
    sid = request.sid
    room_id = socket_to_room.get(sid)
    user_id = socket_to_user.get(sid)
    print(f'Client disconnected with sid: {sid}, room_id: {room_id}, user_id: {user_id}',)

    if sid in socket_to_room:
        socket_to_room.pop(sid)
    if sid in socket_to_user:
        socket_to_user.pop(sid)

    if room_id is None or room_id not in rooms:
        return
    room = rooms[room_id]
    if user_id is None:
        return
    if user_id in room.users_list:
        room.users_list.pop(user_id)

    leave_room(room=room_id)
    # update room data and notify users
    emit('room_data_updated', dataclasses.asdict(room), to=room_id)
    emit('userLeft', { "id": sid }, to=room_id)  # for conversations only


# ---------- CHAT ---------- #        

@socketio.on('sendMessage')
def handle_send_message(payload):
    print(f"received message: {payload}")
    message = payload['message']
    room_id = payload['roomId']
    user_id = payload.get('userId') # f"{request.remote_addr}"  # change to user_id when ready
    emit('receiveMessage', {'message': message, 'userId': user_id}, to=room_id)


if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port=8000, debug=True, keyfile='./server/key.pem', certfile='./server/cert.pem')
    socketio.run(app, host='0.0.0.0', port=8000, debug=True)
