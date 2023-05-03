import { faker } from '@faker-js/faker';
import { sample } from 'lodash';

// ----------------------------------------------------------------------

const rooms = [...Array(8)].map((_, index) => ({
  id: faker.datatype.uuid(),
  title: sample([
    'what do you think on the reform?',
    'why go vegan?',
    'israel-palestine conflict',
    'Capitalism or Socialism?',
    'will Biden continue to another term?',
    'debate - vegan vegetarian',
    "Debate on Aristotle's Ethics",
    "What is the source of global warming?",
    "A debate on the Israeli-Palestinian conflict",
    "What caused the economic crisis in 2008 ?",
    "Pro-Life vs Pro-Choice: Should Abortion be Legal?",
    "Will ChatGPT do more harm than good?",
    "Should the US adopt stricter gun control legislation?",
    "Should animal testing be banned?",
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
    "3/7",
    "6/8",
    
  ]),
  teams: faker.datatype.boolean(),
  viewers: faker.datatype.boolean(),
}));

export default rooms;
