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
 * Shuffle the elements of an array randomly.
 */
const shuffleArray = array => {
  array.forEach((_, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  });
};


/**
 * The function checks if a giver and receiver are a valid match based on their names and the giver's
 * list of people they do not want to match with.
 * @param giver - An object representing the giver of the gift. It should have a "name" property that
 * represents the name of the giver. It can also have a "doNotMatchWith" property, which is an array of
 * names representing people that the giver should not be matched with.
 * @param receiver - The `receiver` parameter represents the person who will receive a gift.
 * @returns The function `isValidMatch` returns a boolean value. It returns `true` if the `receiver` is
 * not in the `doNotMatchWith` array of the `giver` and if the names of the `giver` and `receiver` are
 * not the same. Otherwise, it returns `false`.
 */
const isValidMatch = (giver, receiver) => {
  const { doNotMatchWith = [] } = giver;
  return !doNotMatchWith.includes(receiver.name) && giver.name !== receiver.name;
};

/**
 * The function `minConflicts` uses the min-conflicts algorithm to resolve conflicts among participants
 * by randomly selecting conflicted participants and resolving their conflicts until either all
 * conflicts are resolved or the maximum number of iterations is reached.
 * @param participants - An array of participants, where each participant is represented by an object
 * or a unique identifier.
 * @param [maxIterations] - The `maxIterations` parameter specifies the maximum number of
 * iterations the algorithm will run before giving up. If the algorithm is unable to resolve all
 * conflicts within this number of iterations, it will throw an error.
 * @returns The function `minConflicts` returns the `participants` array if all conflicts are resolved.
 */
const minConflicts = (participants, maxIterations = 100) => {
  let currentIterations = 0;
  shuffleArray(participants); // Start with a random assignment

  while (currentIterations < maxIterations) {
    let conflicts = findConflicts(participants);

    if (conflicts.length === 0) {
      return participants; // All conflicts resolved
    }

    // Randomly select a participant from those in conflict
    let conflictedParticipant = conflicts[Math.floor(Math.random() * conflicts.length)];
    resolveConflictForParticipant(conflictedParticipant, participants);

    currentIterations++;
  }

  throw new Error('Max iterations reached without resolving all conflicts');
};

/**
 * Find participants involved in conflicts.
 */
const findConflicts = participants => {
  return participants.filter(p => {
    const receiverIndex = (participants.indexOf(p) + 1) % participants.length;
    return !isValidMatch(p, participants[receiverIndex]);
  });
};

/**
 * Resolve conflicts for a specific participant.
 */
const resolveConflictForParticipant = (participant, participants) => {
  // Implement logic to resolve conflict for the given participant
  // This may involve finding a new match that minimizes conflicts
};

/**
 * Run the Secret Santa process using the Min-Conflicts algorithm.
 */
const runSecretSanta = async () => {
  try {
    const participants = prepareParticipants(PARTICIPANTS, DONT_PAIR, DONT_REPEAT);
    const resolvedParticipants = minConflicts(participants);

    resolvedParticipants.forEach((giver, index) => {
      const receiver = resolvedParticipants[(index + 1) % resolvedParticipants.length];
      console.log(`${giver.name} got ${receiver.name} for Secret Santa.`);
    });

    // Uncomment to send SMS
    // await sendSMS(resolvedParticipants, BUDGET);
    // console.log('Secret Santa messages sent successfully!');
  } catch (error) {
    console.error('Error in Secret Santa:', error.message);
  }
};

runSecretSanta();
