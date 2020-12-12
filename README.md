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
