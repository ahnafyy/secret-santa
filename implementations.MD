# Implementation Explanations

## Randomized Constraint-Aware Matching Algorithm 🌟

The **Randomized Constraint-Aware Matching Algorithm** shuffles the array and keep trying to find a match and is a brute force implementation where we keep going until we find a match. This is defined in `index.js`

## How It Works 🛠️

### 1. Prepare Participants (`prepareParticipants`) 👥
- Parses participant data into objects, each with a name, phone number, and a set of invalid matches.
- Applies `DONT_PAIR` 🚫 and `DONT_REPEAT` 🔄 constraints to each participant, ensuring some pairings are avoided.

### 2. Randomize Participant Order (`shuffleArray`) 🎲
- Randomly shuffles the array of participants to ensure variability and fairness in pairings.

### 3. Create Matches (`createMatches`) 💑
- Iteratively assigns each participant a Secret Santa from the shuffled list.
- Checks for constraint violations in the pairings.
- If a violation occurs, reshuffles and retries until a valid set of pairings is established.

## Key Characteristics 🔑

- **Randomized Matching**: Ensures every run is fair and different 🔄.
- **Constraint Handling**: Respects `DONT_PAIR` and `DONT_REPEAT` rules to avoid certain pairings 🚫.
- **Iterative and Recursive**: Continually reshuffles and reassigns until all constraints are met ✅.
- **Efficiency**: Optimized for small to medium-sized groups, though may require several iterations for larger groups with for larger groups with numerous constraints

## Final Notes
Ideal for Secret Santa events and other scenarios where random yet rule-bound pairings are required. Balances randomness with the adherence to pre-set rules, providing an effective and engaging participant experience.