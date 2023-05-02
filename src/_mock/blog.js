import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const POST_TITLES = [
  '',
  'Capitalism or Socialism?',
  'will Biden continue to another term?',
  'debate - vegan vegetarian ',
  "Debate on Aristotle's Ethics",
  'What is the source of global warming?  ',
  'A debate on the Israeli-Palestinian conflict',
  'What caused the economic crisis in 2008 ?',
];

const posts = [...Array(7)].map((_, index) => ({
  id: faker.datatype.uuid(),
  cover: `/assets/images/covers/cover_${index + 1}.jpg`,
  title: POST_TITLES[index + 1],
  createdAt: faker.date.past(),
  view: faker.datatype.number(),
  comment: faker.datatype.number(),
  share: faker.datatype.number(),
  favorite: faker.datatype.number(),
  author: {
    name: faker.name.fullName(),
    avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  },
}));

export default posts;
