# TsushoBot
A Discord.js based Discord chat bot. 🤖

## Contents

* [Setting up a Test Environment](###-Setting-up-a-Test-Environment)
* [Adding a new command](###-Adding-a-new-command)
* [Available Features](###-Available-Features)
* [Available commands](###-Available-commands)

---

### Setting up a Test Environment
1. Create a Discord server which will serve as your test server
    * Click Add a Server at the very bottom of your Discord server list panel  
    ![Add a Server](https://i.imgur.com/s9qjR44.png)
    * Click on Create My Own  
    ![Create My Own](https://i.imgur.com/jhpu1mr.png)
    * Give it a name and press Create
2. Generate an Auth Token for your bot user
    * Go to the [Discord Developer Portal](https://discord.com/developers/applications/) and press New Application  
    ![New Application](https://i.imgur.com/2154sWK.png)
    * Give it a name and press Create
    * Go to the Bot tab in the Side Panel, press Add Bot and confirm by clicking on Yes, do it!  
    ![Add Bot](https://i.imgur.com/zqc2Gd1.png)
    * Navigate to the OAuth2 tab in the Side Panel and select bot in the Scopes section. Scroll down and select the desired permissions for the bot user - the example ones as shown on the picture attached below should suffice.  
    ![Scopes and Permissions](https://i.imgur.com/vd6DCzt.png)
    * Copy the generated link from the Scopes section and paste it in your browser of choice. Select your test server as the server you want to add the bot user to and press Continue.  
    ![Adding the bot to a server](https://i.imgur.com/vj2hqu9.png)
    * Go back to the Bot tab in the Side Panel and click Copy under the Token section - this is needed in the next step.  
    ![Copying the Token](https://i.imgur.com/veMUjWk.png)
3. Set up the project locally
    * Fork this repository on GitHub and clone it to somewhere on your computer
    * Navigate to the project's folder in the command line
    * Check out to a new branch
    * Install the required dependencies by running ```npm i```
    * Create an ```.env``` file in the root folder
    * Inside of the ```.env``` file, create a ```TOKEN``` variable and set it to the Token you copied from your Bot page, e.g. ```TOKEN=YOURTOKENGOESHERE```
    * The project should be functional at this point. Try running ```npm start``` - if you get any errors, you probably skipped a step.

---

### Adding a new command

1. Create a new file under the `commands` directory:

```
/ commands
  |- your_command.js
```

2. Add a command template

```js
const embedService = require("../services/embedService");

const embedMessage = (msg, args, options) => {
  /*
  |--------------------------------------------------------------------------
  | Command logic
  |--------------------------------------------------------------------------
  | 
  | Use this template if your command embeds a message
  | 
  */

  // @see: https://leovoel.github.io/embed-visualizer/
  // You can change the color accent by passing:
  //  color: your_color_value_decimal
  // @see: https://convertingcolors.com/
  return embedService.embed(msg, args, {
    description:  "Embed description contents",
  });
};

module.exports = {
  name: "!your_command",
  description: "Your command description",
  execute(msg, args, options = {}) {
    // You can also pass constants only as options.constants
    embedMessage(msg, args, options);
  },
};

```

---

### Available Features

* [RNG Service](##-RNG-Service)
* [Channel Binding](##-Channel-Binding)
* [Global Constants](##-Global-Constants)

---

### Available commands

* !8ball - Answers questions.
* !alk - Posts a random Alkaizer (approved link resource from the database).
* !cheems - Cheemsburger.
* !coinflip - Decide your fate by flipping a coin.
* !count - Incrementally increases your saved counter, with a chance to hit a critical increment.
* !dice - Dice 1000(0) game. Roll 5 dice, collect points. Player contributing the most points wins.
* !fish - Fisherman simulator.
* !help - The command to show all other commands.
* !patch_notes - Shows the patch notes. Accepts a version as an argument to show a specific release.
* !resource - Add a resource for approval.
* !stats - Shows your randomized stats. Each stat is normally distributed.
* !version - Shows the current TsushoBot version.
* !whitelist - Adds or removes the `whitelisted` flag from a user. Only executable by moderators in a server's text channel.

---

## RNG Service

A collection of various randomizer functions:

```js
/**
 * Return a random integer between <min> and <max>
 * Right-inclusive by default
 */
getRandomInt(min, max, maxInclusive = true) ...

const number = getRandomInt(0, 100);
```

```js
/**
 * Returns a random object from a weighted list
 *
 * Requires each object in the array to have a `.weight` property
 * @param   {array}     arr   Array of objects, e.g. [{ value: '1', weight: 10 }, { value: '2', weight: 2 }, ...]
 * 
 * @return  {abject}    A random `object` from the passed array
 */
getWeightedRandom(array) ...

// Objects with the biggest weight have the most chances to be picked
// Object's structure does not matter as long as it's an (object) type containing __weight__ property
const objects = [
    { name: "Apple",    weight: 1000    },
    { name: "Banana",   weight: 200     },
    { name: "Pizza",    weight: 50      },
];

const result = getWeightedRandom(objects);

/**
 * Result of 10 calls:
 * { name: 'Banana',    weight: 200     }
 * { name: 'Apple',     weight: 1000    }
 * { name: 'Apple',     weight: 1000    }
 * { name: 'Apple',     weight: 1000    }
 * { name: 'Apple',     weight: 1000    }
 * { name: 'Banana',    weight: 200     }
 * { name: 'Apple',     weight: 1000    }
 * { name: 'Pizza',     weight: 50      }
 * { name: 'Apple',     weight: 1000    }
 * { name: 'Apple',     weight: 1000    }
 */
```

```js
normalDistribution(mean, stdev)
```

```js
logNormalDistribution(mean, stdev)
```
