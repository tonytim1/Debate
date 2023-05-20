class Room:
    def __init__(self, name, max_participants):
        self.name = name
        self.max_participants = max_participants

    def to_dict(self):
        return {
            'name': self.name,
            'max_participants': self.max_participants
        }
