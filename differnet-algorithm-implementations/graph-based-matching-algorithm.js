const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('../config.json');


/**
 * The `createGraph` function takes in participants data, a list of pairs that should not be paired
 * together, and a list of pairs that should not be repeated, and returns a graph representing the
 * relationships between the participants.
 * @param participantsData - An array of strings representing the names of participants in a graph.
 * Each string contains the name of a participant.
 * @param dontPair - The `dontPair` parameter is an array of pairs of participants who should not be
 * paired together. Each pair is represented as a string with two names separated by a comma. For
 * example, if `dontPair` is `['Ahnaf, Jubair', 'Turna, Hunter']`, it means that Ahnaf
 * @param dontRepeat - The `dontRepeat` parameter is an array of pairs of participants who should not
 * be paired together more than once. Each pair is represented as a string with two names separated by
 * a comma. For example, if `dontRepeat` is `['Ahnaf, Jubair']`, it means that Ahnaf should not be paired
 *  with Jubair this year if they were paired together last year.
 * @returns The function `createGraph` returns a graph represented as a `Map` object.
 */
const createGraph = (participantsData, dontPair, dontRepeat) => {
    let graph = new Map();

    // Initialize graph nodes
    participantsData.forEach(data => {
        const [name] = data.split(' ');
        graph.set(name, new Set());
    });

    // Function to apply constraints
    const applyConstraint = (person1, person2) => {
        graph.get(person1).add(person2);
        graph.get(person2).add(person1);
    };

    // Apply DONT_PAIR constraints
    dontPair.forEach(pair => {
        const [person1, person2] = pair.split(',').map(p => p.trim());
        applyConstraint(person1, person2);
    });

    // Apply DONT_REPEAT constraints
    dontRepeat.forEach(pair => {
        const [person1, person2] = pair.split(',').map(p => p.trim());
        applyConstraint(person1, person2);
    });

    return graph;
};


/**
 * The `findMatching` function attempts to find suitable matches for participants based on a given
 * graph, with a specified retry limit.
 * @param graph - The `graph` parameter is a Map object that represents the relationships between
 * participants. The keys of the map represent the givers, and the values are Sets that contain the
 * potential receivers for each giver. For example:
 * @param [retryLimit] - The `retryLimit` parameter is the maximum number of attempts the function
 * will make to find suitable matches for all participants. If the function is unable to find suitable
 * matches within the specified number of attempts, it will throw an error.
 * Default is set to 10
 * @returns The function `findMatching` returns a `Map` object containing the matches between
 * participants. Each key-value pair in the `Map` represents a match, where the key is the giver and
 * the value is the receiver.
 */
const findMatching = (graph, retryLimit = 10) => {
    let attempts = 0;

    while (attempts < retryLimit) {
        let matches = new Map();
        let available = new Set(graph.keys());

        for (let giver of available) {
            const potentialReceiver = Array.from(available).find(receiver =>
                !graph.get(giver).has(receiver) && giver !== receiver
            );

            if (potentialReceiver) {
                matches.set(giver, potentialReceiver);
                available.delete(giver);
                available.delete(potentialReceiver);
            }
        }

        if (matches.size === graph.size / 2) {
            return matches;
        }

        attempts++;
    }

    throw new Error('Unable to find suitable matches for all participants.');
};

/**
 * The function `runSecretSanta` assigns participants to each other for a Secret Santa gift exchange,
 * while considering any restrictions on pairings and a specified budget.
 */
const runSecretSanta = () => {
    try {
        const participantNodes = createGraph(PARTICIPANTS, DONT_PAIR, DONT_REPEAT);
        const matches = findMatching(participantNodes);

        matches.forEach((receiver, giver) => {
            console.log(`${giver} got ${receiver} for Secret Santa.`);
        });
        // Uncomment to send SMS
        // await sendSMS(matches, BUDGET);
        // console.log('Secret Santa messages sent successfully!');
    }
    catch (error) {
        console.error('Error in Secret Santa:', error.message);
    }
};

runSecretSanta();
