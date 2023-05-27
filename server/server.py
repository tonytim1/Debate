import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
from flask import Flask, jsonify, request

# Initialize Flask app
app = Flask(__name__)

# Initialize Firebase Admin SDK
cred = credentials.Certificate(".\debate-center-dd720-firebase-adminsdk-pepv1-07be2008cd.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

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

# Run the Flask app
if __name__ == '__main__':
    app.run()
