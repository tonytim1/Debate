from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017'
mongo = PyMongo(app)
CORS(app)

@app.route('/create_room', methods=['POST'])
def create_room():
    name = request.json.get('name')
    tags = request.json.get('tags')
    teams = request.json.get('teams')
    time_to_start = request.json.get('time_to_start')
    spectators = request.json.get('spectators')

    room = {
        'name': name,
        'tags': tags,
        'teams': teams,
        'time_to_start': time_to_start,
        "spectators": spectators
    }

    # rooms_collection = mongo.db.rooms
    # inserted_room = rooms_collection.insert_one(room)

    # if inserted_room.inserted_id:
    #     return f"Room '{name}' created successfully!"
    # else:
    #     return "Failed to create room."
    return jsonify({'msg': f"Room '{room['name']}' created successfully!"})

if __name__ == "__main__":
    app.run(debug=True)