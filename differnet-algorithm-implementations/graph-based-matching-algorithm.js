const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('../config.json');


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
 * Jubair again, and Turna should not be paired with Hunter again.
 * @returns The function `prepareParticipants` returns an a graph data structure. A graph is a collection of 
 * nodes (also called vertices) and edges that connect  these nodes. In this case, the graph is represented 
 * as an object where each key is a participant and  the value is a set of participants that the key
 * participant cannot be matched with.
 */
const createGraph = (participantsData, dontPair, dontRepeat) => {
    let graph = new Map();

    // Initialize graph nodes
    participantsData.forEach(data => {
        const [name] = data.split(' ');
        graph.set(name, new Set());
    });

    // Apply DONT_PAIR constraints
    dontPair.forEach(pair => {
        const [person1, person2] = pair.split(',').map(p => p.trim());
        graph.get(person1).add(person2);
        graph.get(person2).add(person1);
    });

    // Apply DONT_REPEAT constraints
    dontRepeat.forEach(pair => {
        const [person1, person2] = pair.split(',').map(p => p.trim());
        graph.get(person1).add(person2); // Only one-way constraint
    });

    return graph;
};

/**
 * The function findMatching is a placeholder for a complex matching algorithm implementation in
 * JavaScript. We will use it to find maximum bipartite matching in a graph.
 * @param participantNodes - The "participantNodes" parameter in the "findMatching" function represents
 * a graph data structure. A graph is a collection of nodes (also called vertices) and edges that connect 
 * these nodes. In this case, the graph is represented as an object where each key is a participant and 
 * the value is a set of participants that the key participant cannot be matched with.
 * @returns an object representing a matching between participants.
 */
const findMatching = (graph, retryLimit = 10) => {
    let attempts = 0;

    while (attempts < retryLimit) {
        let matches = new Map();
        let available = new Set(graph.keys());

        graph.forEach((invalidMatches, giver) => {
            const potentialReceiver = Array.from(available).find(receiver => 
                !invalidMatches.has(receiver) && giver !== receiver
            );

            if (potentialReceiver) {
                matches.set(giver, potentialReceiver);
                available.delete(potentialReceiver);
            }
        });

        if (matches.size === graph.size) {
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

        matches.forEach((giver, index) => {
            const receiver = matches[(index + 1) % matches.length];
            console.log(`${giver.name} got ${receiver.name} for Secret Santa.`);
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
