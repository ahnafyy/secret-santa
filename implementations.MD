# Implementation Explanations

## Randomized Constraint-Aware Matching Algorithm 🌟

The **Randomized Constraint-Aware Matching Algorithm** shuffles the array and keep trying to find a match and is a brute force implementation where we keep going until we find a match. This is defined in `index.js`

### 1. Prepare Participants (`prepareParticipants`) 👥
- Parses participant data into objects, each with a name, phone number, and a set of invalid matches.
- Applies `DONT_PAIR` 🚫 and `DONT_REPEAT` 🔄 constraints to each participant, ensuring some pairings are avoided.

### 2. Randomize Participant Order (`shuffleArray`) 🎲
- Randomly shuffles the array of participants to ensure variability and fairness in pairings.

### 3. Create Matches (`createMatches`) 💑
- Iteratively assigns each participant a Secret Santa from the shuffled list.
- Checks for constraint violations in the pairings.
- If a violation occurs, reshuffles and retries until a valid set of pairings is established.
- The end array has everyone matched where person at index `i` is matched with `i+1` and the last person gets the first person.

### Key Characteristics 🔑

- **Randomized Matching**: Ensures every run is fair and different 🔄.
- **Constraint Handling**: Respects `DONT_PAIR` and `DONT_REPEAT` rules to avoid certain pairings 🚫.
- **Iterative and Recursive**: Continually reshuffles and reassigns until all constraints are met ✅.
- **Efficiency**: Optimized for small to medium-sized groups, though may require several iterations for larger groups with numerous constraints

## Graph-Based Secret Santa Algorithm 🌐

The **Graph-Based Secret Santa Algorithm** utilizes graph theory and backtracking to find suitable matches for a Secret Santa event, while accounting for participant constraints. 

### 1. Create Participant Graph (`createGraph`) 📊
- Converts participant data into a graph structure, where each node represents a participant.
- Each node is linked to other nodes (participants) they can potentially give gifts to.
- Applies `DONT_PAIR` 🚫 and `DONT_REPEAT` 🔄 constraints to restrict certain links between nodes.

### 2. Find Matching (`findMatching`) 🔍
- Utilizes a backtracking approach to explore possible gift-giving cycles in the graph.
- Randomly selects a starting node and attempts to find a Hamiltonian cycle, ensuring each participant receives and gives exactly one gift.
- If a valid cycle is not found, it retries up to a predefined limit (`retryLimit`).

### 3. Backtracking Search (`backtrack`) 🔄
- A recursive function that explores paths in the graph.
- Ensures no participant is visited more than once, and checks for cycle completion.
- Backtracks if a dead-end is reached, trying alternative paths until a valid solution is found.

### Key Characteristics 🔑

- **Graph Theory Application**: Leverages graph data structures for efficient match finding 🌐.
- **Constraint Respectful**: Adheres to `DONT_PAIR` and `DONT_REPEAT` constraints, ensuring certain pairings are avoided 🚫.
- **Backtracking Algorithm**: Employs depth-first search with backtracking to explore all potential solutions ✅.
- **Scalability and Efficiency**: Effective for various group sizes, with performance dependent on the number of constraints and participants 📈.