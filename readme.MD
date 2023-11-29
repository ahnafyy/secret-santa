# Secret Santa 🎅🎁

Link: https://ahnafyy.github.io/secret-santa/

## Overview 🌟

Secret Santa is a Node.js application designed to randomly assign participants their Secret Santa while respecting specific constraints like non-repeating pairs and exclusive pairings. Perfect for holiday fun!

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

2. Update the config.json for what you would like it to be

Edit `config.json` to add participant details and set constraints:

```json
{
  "PARTICIPANTS": [
    "Ahnaf <+12345689000>",
    "Jubair <+12345689000>"
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

3. Run the script

```bash
node index.js
```

Or

Go to `http://localhost:8080/secret-santa`
