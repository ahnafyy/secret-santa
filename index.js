// Load and process config file
const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('./config.json');

/**
 * The function "prepareParticipants" takes in an array of participants' data, a list of pairs that
 * should not be paired together, and a list of pairs that should not be repeated, and returns an array
 * of participants with their respective data and invalid matches.
 * @param participantsData - An array of strings representing participant data. Each string contains
 * the name and phone number of a participant, separated by a space.
 * @param dontPair - An array of pairs of participants who should not be paired together. Each pair is
 * represented as a string with two names separated by a comma (e.g., "John, Jane").
 * @param dontRepeat - The `dontRepeat` parameter is an array of pairs of participants who should not
 * be paired together again. Each pair is represented as a string separated by a comma. For example, if
 * `dontRepeat` is `['Alice, Bob', 'Charlie, David']`, it means that Alice should not
 * @returns The function `prepareParticipants` returns an array of participant objects. Each
 * participant object has properties for name, phone, and invalidMatches.
 */
const prepareParticipants = (participantsData, dontPair, dontRepeat) => {
  const participants = participantsData.map(data => {
    const [name, phone] = data.split(' ');
    return { name, phone, invalidMatches: new Set() };
  });

  [...dontPair, ...dontRepeat].forEach(pair => {
    const [person1, person2] = pair.split(',').map(p => p.trim());
    const person = participants.find(p => p.name === person1);
    if (person) person.invalidMatches.add(person2);
  });

  return participants;
};

/**
 * The shuffleArray function shuffles the elements of an array randomly.
 */
const shuffleArray = array => {
  array.forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  });
};

/**
 * The function creates valid matches between participants by shuffling the array and ensuring that no
 * participant is matched with someone they have specified as an invalid match.
 * @returns The function `createMatches` returns either the `participants` array if all matches are
 * valid, or it recursively calls itself with the same `participants` array until valid matches are
 * found.
 */
 const createMatches = participants => {
  shuffleArray(participants);
  const validMatches = participants.every((giver, i) => {
    const receiverIndex = (i + 1) % participants.length;
    return !giver.invalidMatches.has(participants[receiverIndex].name);
  });

  return validMatches ? participants : createMatches(participants);
};

/**
 * The function `sendSMS` sends SMS messages to participants in a Secret Santa gift exchange, informing
 * them of their assigned recipient and the budget for the gift.
 * @param matches - The `matches` parameter is an array of objects representing the participants in a
 * Secret Santa gift exchange. Each object has properties for name, phone, and invalidMatches.
 * @returns The function `sendSMS` is returning a promise that resolves to an array of messages sent to
 * the secret santa participants.
 */
const sendSMS = (matches) => {
  const budget = BUDGET;
  // To-do: Implement SMS functionality
};

/**
 * The function `runSecretSanta` prepares participants, creates matches, sends SMS messages, and logs
 * the success or error message.
 */
const runSecretSanta = async () => {
  try {
    const participants = prepareParticipants(PARTICIPANTS, DONT_PAIR, DONT_REPEAT);
    const matches = createMatches(participants);

    matches.forEach((giver, index) => {
      const receiver = matches[(index + 1) % matches.length];
      console.log(`${giver.name} got ${receiver.name} for Secret Santa.`);
    });

    // Uncomment to send SMS
    // await sendSMS(matches, BUDGET);
    // console.log('Secret Santa messages sent successfully!');
  } catch (error) {
    console.error('Error in Secret Santa:', error.message);
  }
};

module.exports = {
  prepareParticipants,
  createMatches,
  sendSMS,
  runSecretSanta
};

runSecretSanta();
