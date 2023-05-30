import time
import firebase_admin
import datetime
from firebase_admin import storage
from firebase_admin import credentials, auth
from firebase_admin.auth import UserRecord
from firebase_admin import db, firestore
from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
from flask_socketio import SocketIO, join_room, leave_room, emit
import pyrebase
import os

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


@app.route('/api/signup', methods=['POST'])
def signup():
    user_data = request.get_json()
    email = user_data.get('email')
    password = user_data.get('password')
    
    name = user_data.get('name')
    username = user_data.get('username')
    tags = user_data.get('tags')
    image = user_data.get('image')

    print(image)
    
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

        # Add image
        destination_blob_name = f'users/{user_id}/profile _image'
        bucket = storage.bucket(app=app_firestore)
        blob = bucket.blob(destination_blob_name)
        blob.upload_from_filename('C:\\Users\\t-idobanyan\Desktop\pic.jpg')

        # Get the download URL of the uploaded image
        download_url = blob.generate_signed_url(
            version='v4',
            expiration=datetime.timedelta(days=7),
            method='GET'
        )

        # Store the download URL in the user's document in Firestore
        user_ref.update({'image': download_url})
        
        
        # Return success response
        return jsonify({'message': 'Signup successful', 'userId': user_id, 'token': token}), 200
    
    except auth.EmailAlreadyExistsError:
        # Handle case when the provided email already exists
        return jsonify({'error': 'Email already exists'}), 400
    
    except Exception as e:
        # Handle other errors
        print(e)
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/signin', methods=['POST'])
def signin():
    user_data = request.get_json()
    email = user_data.get('email')
    password = user_data.get('password')
    try:
        login_user = auths.sign_in_with_email_and_password(email, password)
        token = login_user['idToken']
        user_info = auths.get_account_info(token)['users'][0]
        user_id = user_info['localId']
        # db_firestore.collection('users')
        # user_name = user_info['displayName']
        # Return success response
        return jsonify({'message': 'Login successful', 'userId': user_id, 'token': token}), 200
    
    except Exception as e:
        # Handle other errors
        print(e)
        return jsonify({'error': str(e)}), 500

# ---------- HOME PAGE ---------- #
@socketio.on("fetch_all_rooms")
def get_all_rooms():
    rooms_ref = db_firestore.collection('rooms')

    rooms = {}
    for room in rooms_ref.stream():
        room_data = room.to_dict()
        room_id = room.id
        rooms[room_id] = room_data

    socketio.emit("all_rooms", rooms, room=request.sid)    


# ---------- CREATE ROOM PAGE ---------- #
@app.route('/api/create_room', methods=['POST'])
def create_room():
    room_data = request.json
    name = room_data.get('name')
    tags = room_data.get('tags')
    teams = room_data.get('teams')
    room_size = room_data.get('room_size')
    time_to_start_in_minutes = room_data.get('time_to_start')
    time_to_start = time.time() + time_to_start_in_minutes * 60 
    spectators = room_data.get('spectators')
    moderator = room_data.get('moderator') # change to username when ready

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

    socketio.emit("rooms_updated") # broadcast=True

    # Return the room ID as a response
    return jsonify({'roomId': room_ref.id})
# -------------------------------------- #

# -------------- ROOM PAGE ------------- #
@socketio.on('join_room')
def join_debate_room(data):
    
    # Get the request data
    rec_data = data
    room_id = rec_data.get('roomId')
    user_id = rec_data.get('userId')
    # user_id = f"{request.remote_addr}"  # change to user_id when ready
    
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
    emit('user_join', room_data ,room=request.sid)


@socketio.on('leave_click')
def leave_debate_room(data):
    # Get the request data
    rec_data = data
    room_id = rec_data.get('roomId')
    user_id = rec_data.get('userId') # f"{request.remote_addr}"  # change to user_id when ready

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()

    if not room_doc.exists:
        # Room not found, send a specific response
        emit('leave_room_error', {'error': 'Room not found'})
        leave_room(room_id)
        return

    room_data = room_doc.to_dict()
    users_dict = room_data.get('users_list', [])

    if user_id not in users_dict:
        emit('leave_room_error', {'error': 'User is not in the room'})
        leave_room(room_id)
        return

    users_dict.pop(user_id)
    room_ref.update({'users_list': users_dict})

    if not users_dict:
        # Delete the room if no users are left
        emit("rooms_updated", broadcast=True)
        room_ref.delete()
        leave_room(room_id)
        return

    # If the moderator left, assign a new moderator
    if user_id == room_data['moderator']:
        room_ref.update({'moderator': list(users_dict.keys())[0]})

    # leave the SocketIO broadcast room
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

# ------------- USERS SHOW ------------- #
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
    users_list.update({details['userId']: {'ready': False, 'team': not user['team']}})
    room_ref.update({'users_list': users_list})  # Add user to the users_list in Firestore

    updated_room_doc = room_ref.get()
    updated_room_data = updated_room_doc.to_dict()

    # Notify all users in the room about the change
    emit('room_data_updated', updated_room_data, room=details['roomId'])

@socketio.on('ready_click')
def handle_ready_click(details):
    print(details)
    user_id = details.get('userId') # f"{request.remote_addr}"  # change to user_id when ready

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(details['roomId'])
    room_doc = room_ref.get()

    if not room_doc.exists:
        return
    
    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', {})

    if user_id not in users_list:
        return
    
    user = users_list[user_id]
    users_list.update({user_id: {'ready': not user['ready'], 'team': user['team']}})
    room_ref.update({'users_list': users_list})  # Add user to the users_list in Firestore

    updated_room_doc = room_ref.get()
    updated_room_data = updated_room_doc.to_dict()

    # Notify all users in the room about the change
    emit('room_data_updated', updated_room_data, room=details['roomId'])

# -------------------------------------- #

# -------------- CONVERSATION PAGE ------------- #

@socketio.on('start_conversation_click')  # TODO: add a thread that will start the conversation after the needed time
def handle_conversation_start(details):
    print(details)
    # Notify all users in the room about the change
    emit('conversation_start', room=details['roomId'])

@socketio.on('joinConversationRoom')
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

@socketio.on('disconnect')
def handle_disconnect():
# Get the request data
    print('Client disconnected')
    # Join the SocketIO broadcast room
    leave_room(request.sid)


# ---------- CHAT ---------- #        

@socketio.on('sendMessage')
def handle_send_message(payload):
    print(f"received message: {payload}")
    message = payload['message']
    room_id = payload['roomId']
    user_id = payload.get('userId') # f"{request.remote_addr}"  # change to user_id when ready
    emit('receiveMessage', {'message': message, 'userId': user_id}, room=room_id)


if __name__ == '__main__':
    # socketio.run(app, host='0.0.0.0', port=5000, debug=True, keyfile='./server/key.pem', certfile='./server/cert.pem')
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
