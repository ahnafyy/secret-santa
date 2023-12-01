const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('../config.json');

/**
 * The function `createParticipants` takes in an array of participants, a list of pairs that should not
 * be paired together, and a list of pairs that should not be repeated, and returns an object
 * containing the participants, the pairs that should not be paired together, and the pairs that should
 * not be repeated.
 * @param PARTICIPANTS - An array of participant names, where each name is a string. Each participant's
 * full name is provided, but we only need to extract the first name for our purposes.
 * @param DONT_PAIR - DONT_PAIR is an array of strings representing pairs of participants who should
 * not be paired together. Each string in the array should be in the format "person1, person2", where
 * person1 and person2 are the names of the participants who should not be paired together.
 * @param DONT_REPEAT - The `DONT_REPEAT` parameter is an array of pairs of names that should not be
 * paired together again. Each pair is represented as a string separated by a comma and a space. 
 * @returns The function `createParticipants` returns an object with three properties: `participants`,
 * `dontPair`, and `dontRepeat`. The `participants` property is an array of participant names, where each
 * name is a string. The `dontPair` property is a Map object representing pairs of participants who should
 * not be paired together. The `dontRepeat` property is a Map object representing pairs of names that
 * should not be paired together again.
 */
const createParticipants = (PARTICIPANTS, DONT_PAIR, DONT_REPEAT) => {
    // Extract names from the PARTICIPANTS array
    const participants = PARTICIPANTS.map(item => item.split(' ')[0]);

    // Create a Map for DONT_PAIR constraints
    const dontPair = new Map();
    DONT_PAIR.forEach(pair => {
        const [person1, person2] = pair.split(', ');
        dontPair.set(person1, person2);
        dontPair.set(person2, person1); // Ensure two-way constraint
    });

    // Create a Map for DONT_REPEAT constraints
    const dontRepeat = new Map(DONT_REPEAT.map(pair => pair.split(', ')));

    return { participants, dontPair, dontRepeat };
}

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
 * The function calculates the fitness score of an individual solution based on given constraints.
 * @param individual - The `individual` parameter represents a solution to a pairing problem. It is an
 * array that contains the participants in a specific order. Each participant is represented by a
 * unique identifier.
 * @param dontPair - dontPair is a Map object that represents the "don't pair" constraints. The keys of
 * the map represent the participants, and the values represent the participants they cannot be paired
 * with. This constraint is a two-way restriction, meaning that if participant A cannot be paired with
 * participant B, then participant B
 * @param dontRepeat - The `dontRepeat` parameter is a Map object that represents the "DONT_REPEAT"
 * constraints. It contains the restrictions on which participants cannot be paired with each other.
 * The keys of the Map represent the givers, and the values represent the receivers that the givers
 * cannot be paired with.
 * @returns The calculated fitness score is being returned.
 */
const calculateFitness = (individual, dontPair, dontRepeat) => {
    let fitness = 0;

    // Iterate through each participant in the individual solution
    individual.forEach((giver, i) => {
        // Determine the receiver for the current giver
        let receiver = individual[(i + 1) % individual.length];
        // If giver is receiver then fitness decreases
        if (giver === receiver) {
            fitness--;
        } else {
            // Check DONT_PAIR constraints (two-way restriction)
            if (dontPair.get(giver) !== receiver && dontPair.get(receiver) !== giver) {
                fitness++; // Increase fitness if the pairing does not violate the DONT_PAIR constraint
            }

            // Check DONT_REPEAT constraints (one-way restriction)
            if (!dontRepeat.has(giver) || dontRepeat.get(giver) !== receiver) {
                fitness++; // Increase fitness if the giver is not restricted from giving to this receiver
            }
        }
    });

    return fitness; // Return the calculated fitness score
};


/**
 * The `mutate` function takes an individual as input and randomly swaps two elements in the
 * individual.
 * @param individual - The `individual` parameter represents an array of elements that we want to
 * mutate.
 */
const mutate = (individual) => {
    // Select two random indices for swapping
    const index1 = Math.floor(Math.random() * individual.length);
    let index2;
    do {
        index2 = Math.floor(Math.random() * individual.length);
    }
    // Ensure different indices are chosen
    while (index1 === index2);

    // Swap the elements at the selected indices
    [individual[index1], individual[index2]] = [individual[index2], individual[index1]];
};

/**
 * The function "selectParents" randomly selects two individuals from a given population array and
 * returns them as an array.
 * @param population - The `population` parameter is an array that represents a population of
 * individuals. Each individual in the population can be represented by an object, a number, or any
 * other data type that is appropriate for your specific use case.
 * @returns The function `selectParents` returns an array containing two randomly selected individuals
 * from the `population` array.
 */
const selectParents = (population) => {
    let parents = [];

    // Continue selecting parents until we have 2 unique parents
    while (parents.length < 2) {
        // Randomly select an index in the population array
        let randomIndex = Math.floor(Math.random() * population.length);
        // Add the individual at the random index to the parents array
        parents.push(population[randomIndex]);
    }

    // Debugging check: Ensure that two valid parents are selected
    if (!parents[0] || !parents[1]) {
        console.error('Invalid parents selected:', parents);
    }

    return parents;
};

/**
 * The `crossover` function takes two parent arrays and a list of participants, and creates a child
 * array by combining parts of the parents at a random crossover point, while ensuring that no
 * participant is assigned to themselves and all participants are included in the child array.
 * @param parent1 - The `parent1` parameter represents the first parent array. It is an array that
 * contains the assignments of participants in a crossover operation.
 * @param parent2 - The `parent2` parameter in the `crossover` function represents one of the parent
 * arrays that will be used for crossover. It is an array that contains the participants or elements
 * that will be combined with the elements from `parent1` to create a child array.
 * @param participants - An array of participants. Each participant is represented by a unique
 * identifier (e.g., a string or number).
 * @returns The function `crossover` returns the modified child array.
 */
const crossover = (parent1, parent2, participants) => {
    // Calculate a random crossover point in the parent arrays
    const crossoverPoint = Math.floor(Math.random() * parent1.length);

    // Create a child array by combining parts of the two parents at the crossover point
    let child = [...parent1.slice(0, crossoverPoint), ...parent2.slice(crossoverPoint)];

    // Iterate through the child array to correct any self-assignments
    child = child.map((assigned, index) => {
        // Check if a participant is assigned to themselves
        if (assigned === participants[index]) {
            // Find a replacement participant that is not assigned to themselves and not duplicating another assignment
            const replacementIndex = child.findIndex((x, i) => i !== index && x !== participants[i] && x !== participants[index]);
            // Replace with the found participant or leave as is if no replacement is found
            return replacementIndex !== -1 ? child[replacementIndex] : assigned;
        }
        return assigned; // Return the participant if no self-assignment is found
    });

    // Identify any missing participants who are not in the child array
    const missingParticipants = participants.filter(p => !child.includes(p));

    // Replace incorrect assignments with missing participants
    missingParticipants.forEach(missing => {
        // Find an index in the child array where a replacement can be made
        const replaceIndex = child.findIndex((x, i) => x !== participants[i] && !missingParticipants.includes(x));
        // Perform the replacement if a suitable index is found
        if (replaceIndex !== -1) {
            child[replaceIndex] = missing;
        }
    });

    return child; // Return the modified child array
};

/**
 * The `runSecretSanta` function takes in the number of participants and generations, and generates
 * Secret Santa assignments for the participants while considering any constraints specified.
 * @param populationSize - The `populationSize` parameter represents the number of individuals in each
 * generation of the genetic algorithm. It determines the size of the population that will be used to
 * search for the best solution.
 * @param generations - The `generations` parameter represents the number of generations or iterations
 * that the genetic algorithm will run for. Each generation involves creating a new population,
 * selecting parents, performing crossover and mutation, and evaluating the fitness of the individuals
 * in the population. The algorithm will repeat this process for the specified number of generations
 * @returns The function `runSecretSanta` returns the best solution found, which is an array
 * representing the Secret Santa assignments.
 */
const runSecretSanta = (populationSize, generations) => {
    // Extract the participant names and constraints from the input data
    const { participants, dontPair, dontRepeat } = createParticipants(PARTICIPANTS, DONT_PAIR, DONT_REPEAT);

    // Initialize the population with randomly shuffled individuals
    let population = Array.from({ length: populationSize }, () => {
        // Create a copy of the participants array for each individual
        let individual = [...participants];
        // Shuffle this individual's array to randomize the Secret Santa assignments
        shuffleArray(individual);
        // Add the shuffled individual to the initial population
        return individual;
    });

    // Initialize variables to track the best solution found and its fitness score
    let bestSolution;
    let bestFitness = -Infinity;

    // Iterate through the specified number of generations
    Array.from({ length: generations }).forEach(() => {
        let newPopulation = []; // Create a new population for the next generation

        // Generate new individuals for the new population
        population.forEach(() => {
            // Select two parents from the current population
            const [parent1, parent2] = selectParents(population);
            // Create a child through crossover of the parents 
            const child = crossover(parent1, parent2, participants);
            // Apply mutation to introduce randomness
            mutate(child);
            // Add the new child to the new population
            newPopulation.push(child);
        });

        // Replace the old population with the new population
        population = newPopulation;

        // Evaluate the fitness of each individual in the new population
        population.forEach(individual => {
            // Calculate the fitness score for this individual
            const fitness = calculateFitness(individual, dontPair, dontRepeat);
            // Update the best solution if the current individual has a higher fitness score
            if (fitness > bestFitness) {
                bestFitness = fitness;
                bestSolution = individual;
            }
        });
    });

    bestSolution.forEach((giver, index) => {
        const receiver = bestSolution[(index + 1) % bestSolution.length];
        console.log(`${giver} got ${receiver} for Secret Santa.`);
    });
    console.log("Fitness Score:", calculateFitness(bestSolution, dontPair, dontRepeat));
    return bestSolution;
};

runSecretSanta(50, 100);
