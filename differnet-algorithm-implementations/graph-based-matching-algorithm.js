const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('../config.json');

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
 * The function `createGraph` creates a graph representation of participants and their potential
 * receivers, taking into account constraints on pairing and repeating.
 * @param participantsData - The `participantsData` parameter is an array that contains information
 * about each participant. Each element in the array represents a participant and should be in the
 * following format:
 * @param dontPair - The `dontPair` parameter is an array of pairs of participants who should not be
 * paired together. Each pair is represented as a string with the names of the two participants
 * separated by a comma and a space. 
 * @param dontRepeat - The `dontRepeat` parameter is an array of pairs of names. Each pair represents a
 * constraint that specifies that the first person in the pair should not be assigned as a giver to the
 * second person in the pair.
 * @returns The function `createGraph` returns a Map object representing the graph of potential gift
 * receivers for each participant.
 */
const createGraph = (participantsData, dontPair, dontRepeat) => {
    let graph = new Map();
    const participants = createParticipant(participantsData);

    // Initialize the graph with potential receivers for each participant
    participants.forEach(participant => {
        let potentialReceivers = new Set(participants.map(p => p.name));
        potentialReceivers.delete(participant.name); // Remove self
        graph.set(participant.name, potentialReceivers);
    });

    // Apply 'dontPair' constraints
    dontPair.forEach(pair => {
        const [nameOfFirstPerson, nameOfSecondPerson] = pair.split(', ');
        graph.get(nameOfFirstPerson).delete(nameOfSecondPerson);
        graph.get(nameOfSecondPerson).delete(nameOfFirstPerson);
    });

    // Apply 'dontRepeat' constraints
    dontRepeat.forEach(pair => {
        const [nameOfGiver, nameOfReceiver] = pair.split(', ');
        graph.get(nameOfGiver).delete(nameOfReceiver);
    });

    return graph;
};

/**
 * The function `backtrack` is a recursive algorithm that checks if a given graph contains a cycle that
 * includes all nodes and forms a cycle back to the start node.
 * @param node - The current node being visited in the graph.
 * @param startNode - The startNode parameter is the node from which the cycle search starts. It is the
 * initial node in the path.
 * @param path - The `path` parameter is an array that represents the current path being explored in
 * the graph. It starts with the `startNode` and is updated as the algorithm explores different nodes
 * in the graph.
 * @param visited - The `visited` parameter is a Set data structure that keeps track of the nodes that
 * have been visited during the backtracking process. It is used to prevent revisiting the same node
 * and getting stuck in an infinite loop.
 * @param graph - The `graph` parameter is a Map object that represents the graph. Each key in the map
 * represents a node in the graph, and the corresponding value is a Set object that contains the
 * neighbors of that node.
 * @returns a boolean value indicating whether a cycle has been found in the graph.
 */
const backtrack = (node, startNode, path, visited, graph) => {
    // Check if the current path includes all nodes and can form a cycle back to the start node
    if (path.length === graph.size && graph.get(node).has(startNode)) {
        // Complete the cycle by adding the start node at the end of the path
        path.push(startNode); 
        // A valid cycle is found
        return true; 
    }

    let foundCycle = false; 

    // Iterate over each neighbor of the current node
    graph.get(node).forEach(neighbor => {
        // Check if the neighbor has not been visited and no cycle has been found yet
        if (!visited.has(neighbor) && !foundCycle) {
            // Mark the neighbor as visited
            visited.add(neighbor); 
            // Add the neighbor to the current path
            path.push(neighbor); 

            // Recursively call backtrack with the neighbor as the new current node
            if (backtrack(neighbor, startNode, path, visited, graph)) {
                 // A cycle is found, set the flag to true
                foundCycle = true;
            } else {
                // If no cycle found, backtrack by removing the neighbor from visited and path
                // Remove the neighbor from the visited set
                visited.delete(neighbor);
                // Remove the neighbor from the current path
                path.pop(); 
            }
        }
    });

    return foundCycle; 
};


/**
 * The `findMatching` function generates Secret Santa matches for a given graph of participants,
 * ensuring that each participant is matched with another participant and that no participant is
 * matched with themselves.
 * @param graph - The `graph` parameter is a Map object that represents the connections between
 * participants in a Secret Santa game. Each key in the map represents a participant, and the
 * corresponding value is an array of participants that the key participant can give a gift to.
 * @param [retryLimit=100] - The `retryLimit` parameter is the maximum number of attempts the algorithm
 * will make to find suitable matches for all participants. If the algorithm is unable to find matches
 * within the specified number of attempts, it will throw an error.
 * @returns The function `findMatching` returns a `Map` object that represents the Secret Santa
 * matches.
 */
const findMatching = (graph, retryLimit = 10) => {
    let matches = null; 

    // Create an array from 0 to retryLimit and iterate over it
    Array.from({ length: retryLimit }, (_, i) => i).forEach(() => {
        // If matches have been found, exit the loop early
        if (matches) return; 

        // Select a random start node from the graph
        const startNode = Array.from(graph.keys())[Math.floor(Math.random() * graph.size)];
        // Initialize the path with the start node
        const path = [startNode]; 
        // Create a set to keep track of visited nodes
        const visited = new Set([startNode]); 

        // Use the backtrack function to try to find a complete cycle
        if (backtrack(startNode, startNode, path, visited, graph)) {
            // If a cycle is found, initialize matches as a new Map
            matches = new Map(); 

            // Iterate over the path to set up the Secret Santa matches
            path.forEach((node, i) => {
                if (i < path.length - 1) {
                    matches.set(node, path[i + 1]);
                }
            });
        }
    });

    // If no matches are found after retryLimit attempts, throw an error
    if (!matches) {
        throw new Error('Unable to find suitable matches for all participants.');
    }

    return matches; 
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
