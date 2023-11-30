import { createMatches } from './../index';

// Here we can try to test out different algorithms for matching
export const finalizeMatching = (participants) => {
    const matches = createMatches(participants);
    matches.forEach((giver, index) => {
      const receiver = matches[(index + 1) % matches.length];
      console.log(`${giver.name} got ${receiver.name} for Secret Santa.`);
    });
    return matches;
}

export default finalizeMatching;