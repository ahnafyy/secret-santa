# Secret Santa 🎅🎁

Link to the webapp: https://ahnafyy.github.io/secret-santa/

## Overview 🌟

Secret Santa is a Node.js application / some algorithmic solutions designed to randomly assign participants their Secret Santa while respecting specific constraints like non-repeating pairs and exclusive pairings. Perfect for holiday fun!

## Features 🎉

- **Randomized Pairing**: Each participant is randomly assigned a Secret Santa.
- **Constraint Handling**: Respects `DONT_PAIR` and `DONT_REPEAT` constraints to avoid certain pairings.
- **SMS Integration**: Option to send out pairing information via SMS (functionality to be implemented).
- **Customizable Budget**: Set a budget for your Secret Santa event.

## Setup and Installation 🛠️

Make sure you have node installed on your box!

1. Clone the repository:

```bash
git clone https://github.com/ahnafyy/secret-santa.git
```
2. Run the script

```bash
npm install && npm run start
```
and go to `http://localhost:8080/secret-santa`

## SMS Integration (NOT INTEGRATED IN WEBAPP YET!) 📱💬

To send out SMS notifications, you'll need to add a new file named `apikey.json` in the project root with your [Textbelt](https://textbelt.com/) API key. Here's how:

1. Create a file named `apikey.json` in the project root.

2. Add your Textbelt API key as follows:

   ```json
   {
     "key": "YOUR_TEXTBELT_KEY"
   }
   ```

3. run 

```bash
node run.js
```
The matching algorithm will use this key to send SMS notifications to participants. 📤🎄

Note: Get your API key from [Textbelt](https://textbelt.com/).

## Implementation 🚀

Explore a variety of algorithmic approaches to the Secret Santa challenge! Check out the `different-algorithm-implementation` folder, where you'll find multiple implementations, each offering a unique take on solving the Secret Santa puzzle. Just run `node` on the JavaScript files and see the matches pop up in your console. It's a great way to compare methods and have some coding fun! 🎲

For a detailed overview of each approach, including the logic and intricacies behind them, visit our [Implementation Details](https://github.com/ahnafyy/secret-santa/blob/main/implementations.MD) page. 🔍

You can update the `config.json` for what you would like the algorithms to run on.

```json
{
  "PARTICIPANTS": [
    "Ahnaf 12345689000",
    "Jubair +12345689000"
    // Add more participants here
  ],
  "DONT_PAIR": [
    "Ahnaf, Jubair"
    // Add pair constraints here
  ],
  "DONT_REPEAT": [
    // Add last year's participants
  ],
  "BUDGET": 20
}
```
