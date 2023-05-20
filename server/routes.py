from flask import Flask, request, jsonify
from flask_cors import CORS

from flask_pymongo import PyMongo

app = Flask(__name__)
app.config['MONGO_URI'] = 'mongodb://localhost:27017'
mongo = PyMongo(app)
CORS(app)

@app.route('/create_room', methods=['POST'])
def create_room():
    name = request.form.get('name')
    topic = request.form.get('topic')
    # Add more fields as per your requirements

    room = {
        'name': name,
        'topic': topic
        # Add more fields as per your requirements
    }

    rooms_collection = mongo.db.rooms
    inserted_room = rooms_collection.insert_one(room)

    if inserted_room.inserted_id:
        return f"Room '{name}' created successfully!"
    else:
        return "Failed to create room."
    
@app.route("/hello")
def say_hello():
    return jsonify({'msg': "hello bitch"})

if __name__ == "__main__":
    app.run(debug=True)