from flask import Flask, request, jsonify
import pyrebase

app = Flask(__name__)

# Configure your Firebase project
firebase_config = {
    "apiKey": "AIzaSyDgh6sFpRq3YmEJDW4Z-L4ReInFSkA6NSY",
    "authDomain": "debate-center-dd720.firebaseapp.com",
    # "databaseURL": "YOUR_DATABASE_URL",
    "projectId": "debate-center-dd720",
    "storageBucket": "debate-center-dd720.appspot.com",
    "messagingSenderId": "524928099280",
    "appId": "1:524928099280:web:9b24e083399f9bfae0cfd5",
    # "measurementId": "YOUR_MEASUREMENT_ID"
}

firebase = pyrebase.initialize_app(firebase_config)
db = firebase.database()

@app.route('/api/create-room', methods=['POST'])
def create_room():
    try:
        # Get the room data from the request body
        room_data = request.get_json()
        
        # Push the room data to the "rooms" collection in Firebase Realtime Database
        room_ref = db.child("rooms").push(room_data)

        # Return the created room ID
        return jsonify({'roomId': room_ref.key()}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
