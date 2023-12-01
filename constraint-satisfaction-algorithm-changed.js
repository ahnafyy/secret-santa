const { PARTICIPANTS, DONT_PAIR, DONT_REPEAT, BUDGET } = require('../config.json');

/**
 * The function `runSecretSanta` assigns participants to each other for a Secret Santa gift exchange,
 * while considering any restrictions on pairings and a specified budget.
 */
const runSecretSanta = () => {
    try {
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
