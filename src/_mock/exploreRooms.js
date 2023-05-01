import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const rooms = [...Array(3)].map((_, index) => ({
  id: faker.datatype.uuid(),
  title: sample([
    'what do you think on the reform?',
    'why go vegan?',
    'israel-palestine conflict',
  ]),
  topic: sample([
    'politics',
    'health',
    'conspiracy',
  ]),
  hostName: faker.name.fullName(),
  roomSize: sample([
    '1/2',
    '2/4',
    '1/4',
    '4/4',
  ]),
  teams: faker.datatype.boolean(),
  viewers: faker.datatype.boolean(),
}));

export default rooms;
