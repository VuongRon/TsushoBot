const expect = require("chai").expect;
const { CommandThrottling } = require("../services/commandThrottlingService");
const commandThrottlingService = require("../services/commandThrottlingService").CommandThrottling;

// This will restore to the origibna
const env = Object.assign({}, process.env);

// We have to assume this key will exist in the .env
const testCommandThrottle = "COMMAND_THROTTLING_TEST";
const testCommandName = "TEST";
const testCommandCooldown = 3;
const testUsername = "TestUser";

/**
 * Shortcut for new Command Throttling instance
 *
 * @return  {CommandThrottling}
 */
const newService = () => {
  return new commandThrottlingService(testCommandName, testUsername);
}

/**
 * Adds a test command throttling key to the .env
 *
 * @param   {any}   value   Command Throttling cooldown. For testing purposes it can hold any value
 *
 * @return  {void}
 */
const injectTestThrottling = (value = testCommandCooldown) => {
  process.env[testCommandThrottle] = value;
}

describe("Channel Throttling Service", () => {
  afterEach("restore .env and the sandbox", () => {
    process.env = env;
  });

  describe("Throttling Setup", () => {
    it ("should fetch the existing command throttling key from the .env", () => {
      // Inject the test command
      injectTestThrottling();
  
      // Create a new instance with test command name and a username
      // Command throttling comes after the channel binding, and it yields
      // the processed command name as an UpperCase string
      const throttlingService = newService();
  
      // We will check if the test command has been fetched correctly
      const fetchedThrottles = Object.keys(throttlingService.commandsToThrottle);
  
      expect(fetchedThrottles.includes(testCommandThrottle)).to.be.deep.equal(true);
    });
  
    /**
     * This test implies the command throttling key is commented (undefined)
     */
    it ("should not find a test command in fetched throttles", () => {
      const throttlingService = newService();
      const fetchedThrottles = Object.keys(throttlingService.commandsToThrottle);
  
      expect(fetchedThrottles.includes(testCommandThrottle)).to.be.deep.equal(false);
    });
  
    /**
     * In this test the command throttling is defined, but with invalid values,
     * so those commands should not be included in the throttling
     */
    const invalidValues = ["", "test", [], {}];
    invalidValues.forEach((value) => {
      it (`should not find a test command in the fetched throttles with invalid value specified in the .env (${typeof value} / ${value})`, () => {
        // Inject the invalid value
        // This command should not be included when user specifies an invalid value
        injectTestThrottling(value);
  
        const throttlingService = newService();
        const fetchedThrottles = Object.keys(throttlingService.commandsToThrottle);
        
        expect(fetchedThrottles.includes(testCommandThrottle)).to.be.deep.equal(false);
      });
    });
  });

  describe("Throttling Application", () => {
    it ("should set a cooldown on executed command", () => {
      injectTestThrottling();

      const throttlingService = newService();

      // This assumes we executed the command since the allowed commands have
      // cooldown applied
      throttlingService.throttleCommand();

      // We have already tested against the absence of the throttled command
      // so we can jump right into checking the command cooldown.
      // At this point, the cooldown __should__ be positive.
      const remainingCooldown = CommandThrottling.getRemainingCooldown(testCommandName, testUsername);

      expect(remainingCooldown).to.be.greaterThan(0);
    });

    /**
     * Applies a fixed cooldown of 1 second and checks if the command was rejected
     */
    it ("should reject a command on cooldown", () => {
      injectTestThrottling(1);

      const throttlingService = newService();
      throttlingService.throttleCommand();

      // .canBeExecuted() should return false since we have applied a one second
      // cooldown on the test command
      expect(throttlingService.canBeExecuted()).to.be.deep.equal(false);
    });

    /**
     * This object contains the awaiting times and the expected test result
     * In this test we are applying a fixed cooldown of __one second__ and
     * after that time the command execution should be allowed.
     *
     * We also have to cover the attempt where the cooldown has not ended yet,
     * so after 900 milliseconds we should still not be able to execute this command.
     */
    const executions = {
      /* After this awaiting time the test should pass */
      allow: [1000, true],
      /* After this awaiting time the test should fail */
      disallow: [900, false],
    };

    /**
     * Applies a fixed cooldown of 1 second and waits until the cooldown has ended
    */
    for (const execution in executions) {
      const testCooldown = executions[execution][0];
      const expectedResult = executions[execution][1];

      it (`(async test) should ${execution} the command execution after ${testCooldown} milliseconds`, async () => {
        injectTestThrottling(1);

        const throttlingService = newService();
        throttlingService.throttleCommand();

        let cooldown = new Promise( (resolve, reject) => {
          setTimeout(() => {
            // After we applied one second cooldown, the service should return
            // true the next time we check if the command can be executed
            resolve(throttlingService.canBeExecuted());
          }, testCooldown);
        });

        const cooldownState = await cooldown;
        expect(cooldownState).to.be.deep.equal(expectedResult);
      });
   };
  });
});
