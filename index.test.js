const { prepareParticipants, createMatches } = require('./index.js');
const config = require('./config.json');

describe('Secret Santa Tests', () => {
  let participants;

  beforeAll(() => {
    participants = prepareParticipants(config.PARTICIPANTS, config.DONT_PAIR, config.DONT_REPEAT);
  });

  test('prepareParticipants should correctly process participants and restrictions', () => {
    expect(participants.length).toBe(config.PARTICIPANTS.length);
    config.DONT_PAIR.forEach(pair => {
      const [person1, person2] = pair.split(',').map(p => p.trim());
      const participant = participants.find(p => p.name === person1);
      expect(participant.invalidMatches.has(person2)).toBeTruthy();
    });
  });

  test('createMatches should respect DONT_PAIR restrictions', () => {
    const matches = createMatches(participants);
    const matchPairs = matches.map((giver, i) => [giver.name, matches[(i + 1) % matches.length].name]);

    config.DONT_PAIR.forEach(pair => {
      const [person1, person2] = pair.split(',').map(p => p.trim());
      expect(matchPairs).not.toContainEqual([person1, person2]);
      expect(matchPairs).not.toContainEqual([person2, person1]);
    });
  });
});

