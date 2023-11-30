// Load and process config file
const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('./config.json');

/**
 * The function "createParticipant" takes an array of participant data and returns an array of
 * participant objects with name, phone, and doNotMatchWith properties.
 * @param participantsData - An array of strings representing participant data. Each string contains
 * the name and phone number of a participant, separated by a space.
 * @returns The function `createParticipant` returns an array of objects. Each object in the array
 * represents a participant and has properties for `name`, `phone`, and `doNotMatchWith`.
 */
const createParticipant = (participantsData) => {
  return participantsData.map(data => {
    const [name, phone] = data.split(' ');
    return { name, phone, doNotMatchWith: [] };
  });
}

/**
 * The function "prepareParticipants" takes in an array of participants' data, a list of pairs that
 * should not be paired together, and a list of pairs that should not be repeated, and returns an array
 * of participants with their respective data and invalid matches.
 * @param participantsData - An array of strings representing participant data. Each string contains
 * the name and phone number of a participant, separated by a space.
 * @param dontPair - An array of pairs of participants who should not be paired together. Each pair is
 * represented as a string with two names separated by a comma (e.g., "Ahnaf, Jubair").
 * @param dontRepeat - The `dontRepeat` parameter is an array of pairs of participants who should not
 * be paired together again. Each pair is represented as a string separated by a comma. For example, if
 * `dontRepeat` is `['Ahnaf, Jubair', 'Turna, Hunter']`, it means that Ahnaf should not be paired with
 * Jubair this time since they were last year, and Turna should not be paired with Hunter again.
 * @returns The function `prepareParticipants` returns an array of participant objects. Each
 * participant object has properties for name, phone, and doNotMatchWith.
 */
const prepareParticipants = (participantsData, dontPair, dontRepeat) => {
  const participants = createParticipant(participantsData);

  dontPair.forEach(pair => {
    const [nameOfFirstPerson, nameOfSecondPerson] = pair.split(', ');
    const firstPerson = participants.find(participant => participant.name === nameOfFirstPerson);
    const secondPerson = participants.find(participant => participant.name === nameOfSecondPerson);

    firstPerson.doNotMatchWith.push(nameOfSecondPerson);
    secondPerson.doNotMatchWith.push(nameOfFirstPerson);
  });

  dontRepeat.forEach(pair => {
    const [nameOfGiver, nameOfReceiver] = pair.split(', ');
    const giver = participants.find(participant => participant.name === nameOfGiver);

    giver.doNotMatchWith.push(nameOfReceiver);
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
 * The function `isValidMatch` checks if a giver and receiver are a valid match based on the receiver's
 * name not being in the giver's list of invalid matches.
 * @param giver - The `giver` parameter represents the person who is giving a gift. It could be an
 * object that contains information about the giver, such as their name, preferences, and a set of
 * invalid matches (people they cannot give a gift to).
 * @param receiver - The `receiver` parameter represents the person who will receive a gift in a gift
 * exchange.
 * @returns The function `isValidMatch` returns a boolean value.
 */
const isValidMatch = (giver, receiver) => {
  const { doNotMatchWith = [] } = giver;
  return !doNotMatchWith.includes(receiver.name);
};

/**
 * The function creates valid matches between participants by shuffling the array and ensuring that no
 * participant is matched with someone they have specified as an invalid match. It tries up to a certain
 * number of times to find valid matches.
 * @param participants The array of participants.
 * @param retryLimit The maximum number of times to attempt to create matches. Defaults to 10.
 * @returns The function returns either the `participants` array if all matches are valid, or null if it
 * reaches the retry limit without finding valid matches.
 */
const createMatches = (participants, retryLimit = 10) => {
    let attempt = 0;

    while (attempt < retryLimit) {
        shuffleArray(participants);

        const validMatches = participants.every((giver, giverIndex) => {
            const receiverIndex = (giverIndex + 1) % participants.length;
            const receiver = participants[receiverIndex];
            return isValidMatch(giver, receiver);
        });

        if (validMatches) {
            return participants;
        }

        attempt++;
    }

    throw new Error('Unable to find suitable matches for all participants.');
};

/**
 * The function `sendSMS` sends SMS messages to participants in a Secret Santa gift exchange, informing
 * them of their assigned recipient and the budget for the gift.
 * @param matches - The `matches` parameter is an array of objects representing the participants in a
 * Secret Santa gift exchange. Each object has properties for name, phone, and doNotMatchWith.
 * @returns The function `sendSMS` is returning a promise that resolves to an array of messages sent to
 * the secret santa participants.
 */
const sendSMS = (matches) => {
  const budget = BUDGET;
  // To-do: Implement SMS functionality
};

/**
 * The function `runSecretSanta` assigns participants to each other for a Secret Santa gift exchange,
 * while considering any restrictions on pairings and a specified budget.
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

// runSecretSanta();
