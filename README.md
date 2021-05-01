# TsushoBot

A Discord.js based Discord chat bot. 🤖

---

- [Setting up a Test Environment](#setting-up-a-test-environment)
- [Running/Debugging the project](#running-debugging-the-project)
- [Adding a new command](#adding-a-new-command)
- [Testing](#testing)

---

## Setting Up A Test Environment

1. Create a Discord server which will serve as your test server
   - Click Add a Server at the very bottom of your Discord server list panel  
     ![Add a Server](https://i.imgur.com/s9qjR44.png)
   - Click on Create My Own  
     ![Create My Own](https://i.imgur.com/jhpu1mr.png)
   - Give it a name and press Create
2. Generate an Auth Token for your bot user
   - Go to the [Discord Developer Portal](https://discord.com/developers/applications/) and press New Application  
     ![New Application](https://i.imgur.com/2154sWK.png)
   - Give it a name and press Create
   - Go to the Bot tab in the Side Panel, press Add Bot and confirm by clicking on Yes, do it!  
     ![Add Bot](https://i.imgur.com/zqc2Gd1.png)
   - Navigate to the OAuth2 tab in the Side Panel and select bot in the Scopes section. Scroll down and select the desired permissions for the bot user - the example ones as shown on the picture attached below should suffice.  
     ![Scopes and Permissions](https://i.imgur.com/vd6DCzt.png)
   - Copy the generated link from the Scopes section and paste it in your browser of choice. Select your test server as the server you want to add the bot user to and press Continue.  
     ![Adding the bot to a server](https://i.imgur.com/vj2hqu9.png)
   - Go back to the Bot tab in the Side Panel and click Copy under the Token section - this is needed in the next step.  
     ![Copying the Token](https://i.imgur.com/veMUjWk.png)
3. Set up the project locally
   - Fork this repository on GitHub and clone it to somewhere on your computer
   - Navigate to the project's folder in the command line
   - Check out to a new branch
   - Install the required dependencies by running `npm i`
   - This will automatically run the `db:migrate` task for you upon finishing the installation, or you can run it manually:
     - To setup a local sqlite3 database file, run `npm run db:migrate`
   - Execute `npm run cloneEnv` - this will create a new `.env` file
   - If you wish to overwrite the existing `.env` (**not recommended**), execute `npm run cloneEnv -- --force`
   - Check the contents of `.env` for more details on feature configuration
   - Inside of the `.env` file, update the `TOKEN` variable and set it to the Token you copied from your Bot page, e.g. `TOKEN=YOURTOKENGOESHERE`
   - Before the project is ready to be used, it needs to be compiled, please refer to [this steps](#running-debugging-the-project).
   The project should be functional at this point - if you get any errors, you probably skipped a step.

---

## <a id="running-debugging-the-project"></a> Running/Debugging the project

In order to run the project, it requires getting compiled first from Typescript to Javascript.

Run `npm run build:src` in order to compile the src Typescript project.
To then run the project, you can run `npm start`.

In order to debug the project, in VS code go to Run (Default keyboard shortcut: Ctrl+Shift+D), then at the top choose "Launch Program" and click the green triangle (Start Debugging).
You need to place your breakpoints in your source code (Typescript/Javascript) in the `src` folder, and **not** in the `dist` folder.

---

## Adding A New Command

1. Create a new file under the `commands` directory:

```
/ commands
  |- [command_name].ts
```

2. Add a command template TODO update adding command templates

```ts
import { Message } from "discord.js";

import { CommandTemplate } from "../types/command.type";
import { embed } from "../services/embedService";

const executionLogic = (msg: Message, args: string[], options: any) => {
  /**
   * Command logic goes here
   */

  // @see: https://leovoel.github.io/embed-visualizer/
  // You can change the color accent by passing:
  //  color: your_color_value_decimal
  // @see: https://convertingcolors.com/
  return embed(msg, args, {
    argsTitle: "Embed title",
    description: "Embed description contents",
    color: [optional: decimal encoded color, white by default]
  });
};

const execute = (msg: Message, args: string[], options: any) => {
  executionLogic(msg, args, options);
};

const commandTemplate: CommandTemplate = {
  name: "command name (without !)",
  description: "command description",
  execute: execute,
};

export { 
  commandTemplate
};
```

3. Add additional command json configuration by adding a file under:
```
/ commands/config
  |- [command_name].json
```
and then consume the configuration inside your command file:
```ts
// ...

import data from "./config/[command_name].json";

// ...
```

---

## Testing

The project is using [jest-ts](https://github.com/kulshekhar/ts-jest) which is a Typescript preprocessor for [jest](https://jestjs.io/), for testing.

To run the tests, run `npm test`, which compiles the `jest` test files in-memory and runs them.

To understand more about how `jest-ts` works, refer to their [jest-ts's documentation](https://kulshekhar.github.io/ts-jest/docs/installation) or [jest's documentation](https://jestjs.io/docs/en/getting-started).
