import { faker } from '@faker-js/faker';
import { sample, sampleSize } from 'lodash';
import ROOMS from './exploreRooms'
import USERS from './user'

// ----------------------------------------------------------------------

// const room = sample(ROOMS);
// const users = sampleSize(USERS, room.roomSize)
const room = {
  id: faker.datatype.uuid(),
  roomName: 'what do you think on the reform?',
  topic: 'politics',
  teams: false,
  hostUser: USERS[0],
  roomSize: 4,
  users: [
    {...USERS[0], ready: true},
    {...USERS[1], ready: false},
    {...USERS[2], ready: true},
  ],
  messages: [
    {author: USERS[1], text: "Hi"},
    {author: USERS[0], text: "Sup?"}
  ],
  currentUser: sample([USERS[0], USERS[1], USERS[2]])
}

export default room;
