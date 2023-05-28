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
cred_firestore = credentials.Certificate("./debate-center-dd720-firebase-adminsdk-pepv1-07be2008cd.json")
app_firestore = firebase_admin.initialize_app(cred_firestore, name='Firestore')
db_firestore = firestore.client(app_firestore)


@app.route('/api/create_room', methods=['POST', 'OPTIONS'])
def create_debate_room():
    if request.method == 'OPTIONS':
        # Set CORS headers for the preflight request
        response = jsonify({'roomId': ''})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

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
        'users_list': {},
        'spectators_list': [],
        'moderator': moderator,
        'is_conversation': False,
    }

    # Add the room to Firestore
    room_ref = db_firestore.collection('rooms').document()
    room_ref.set(new_room)

    # Return the room ID as a response
    response = jsonify({'roomId': room_ref.id})
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response


@app.route('/api/join_room', methods=['POST', 'OPTIONS'])
def join_debate_room():
    print("in join room")
    if request.method == 'OPTIONS':
        # Set CORS headers for the preflight request
        response = jsonify({})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response
    print("getting data")
    # Get the request data
    rec_data = request.get_json()
    room_id = rec_data.get('roomId')
    # user_id = rec_data.get('userId')
    user_id = "new_user"
    print("got room id:", room_id)
    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()
      
    if not room_doc.exists:
        # Room not found, send a specific response
        response = jsonify({'error': 'Room not found'})
        return response
    
    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', [])
    room_size = room_data.get('room_size', 0)

    print("got room data:", room_data)

    if len(users_list) >= room_size and user_id not in users_list:
        print('room is full')
        # Room is full, send a specific response
        response = jsonify({'error': 'Room is full'})
        return response
    
    if user_id not in users_list:
        print("need to add")
        users_list.update({user_id: False})
        room_ref.update({'users_list': users_list})  # Add user to the users_list in Firestore

        updated_room_doc = room_ref.get()
        updated_room_data = updated_room_doc.to_dict()

        # Notify all users in the room about the change
        socketio.emit('room_data_updated', updated_room_data, room=room_id)

        response = jsonify(updated_room_data)

    # Join the SocketIO broadcast room
    join_room(room_id)

    return response


@app.route('/api/leave_room', methods=['POST'])
def leave_debate_room():
    if request.method == 'OPTIONS':
        # Set CORS headers for the preflight request
        response = jsonify({})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    # Get the request data
    rec_data = request.get_json()
    room_id = rec_data.get('roomId')
    user_id = rec_data.get('userId')

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()

    if not room_doc.exists:
        # Room not found, send a specific response
        response = jsonify({'error': 'Room not found'})
        return response
    
    room_data = room_doc.to_dict()
    users_list = room_data.get('users_list', [])
    room_size = room_data.get('room_size', 0)

    if user_id not in users_list:
        response = jsonify({'error': 'user is not in room'})
        return response
    
    
    users_list.remove(user_id)
    room_ref.update({'users_list': users_list})
    
    # Join the SocketIO broadcast room
    leave_room(room_id)

    updated_room_doc = room_ref.get()
    updated_room_data = updated_room_doc.to_dict()

    # Notify all users in the room about the change
    socketio.emit('room_data_updated', updated_room_data, room=room_id)

    response = jsonify(updated_room_data)
    
    return response


@app.route('/api/fetch_room_data', methods=['POST', 'OPTIONS'])
def fetch_room_data():
    if request.method == 'OPTIONS':
        # Set CORS headers for the preflight request
        response = jsonify({})
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    # Get the request data
    room_data = request.get_json()
    room_id = room_data.get('roomId')

    # Fetch the room data from Firestore
    room_ref = db_firestore.collection('rooms').document(room_id)
    room_doc = room_ref.get()

    if room_doc.exists:
        room_data = room_doc.to_dict()
        response = jsonify(room_data)
    else:
        # Room not found, send a specific response
        response = jsonify({'error': 'Room not found'})
    
    return response

if __name__ == '__main__':
    socketio.run(app, host='10.0.0.20', port=5000, debug=True)
