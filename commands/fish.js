const numbers = require("numbers");

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

  const checkArgsLength = (args) => {
  args = args.join(" ");
  let maxLength = 100;
  return args.length > maxLength ? args.substring(0, maxLength - 3) + '...' : args;
}



const generateRoll = () => {
  return Math.floor(
    parseInt(
      getRandomValue(50, 25, numbers.random.distribution.normal),
      10
    )
  );
};

function getFish(roll){
  if(roll<-5){
    return "You caught a :motorized_wheelchair:!"
  }else if(roll<0){
    return "You caught a :manual_wheelchair:!"
  }else if(roll<10){
    return "You caught my :heart:!"
  }else if(roll<25){
    return "You caught nothing!"
  }else if (roll>=100) {
    return "You caught a :blowfish:!"
  }else if (roll>=90) {
    return "You caught a :tropical_fish:!"
  }else if (roll>=75) {
    return "You caught a :fish:!"
  }else if (roll>=50) {
    return "You caught a :boot:!"
  }else if (roll>=25) {
    return "You caught a :wrench:!"
  }
}

function getComment(roll){
  if(roll<-5){
    return "2fast2furious"
  }else if(roll<0){
    return ":fire:"
  }else if(roll<10){
    return ":flushed:"
  }else if(roll<25){
    return "Unlucky"
  }else if (roll>=100) {
    return "INSANE!"
  }else if (roll>=90) {
    return "Pog!"
  }else if (roll>=75) {
    return "nice"
  }else if (roll>=50) {
    return "It's brand new"
  }else if (roll>=25) {
    return "Maybe someone else can use it"
  }
}

const embedMessage = (msg, args) => {
  let roll = generateRoll();
  const stats = {
    "title": `${args ? checkArgsLength(args) : ''}`,
    "color": 5214975,
    "author": {
      "name": `${msg.author.username} is fishing...`,
      "icon_url": `${msg.author.avatarURL()}`
    },
    "fields": [
      {
        "name": `${getFish(roll)}`,
        "value": `${getComment(roll)}`,
        "inline": true
      }
    ]
  };
  return msg.channel.send({ embed: stats });
}

module.exports = {
  name: "!fish",
  description: "Yeah, I fish.",
  execute(msg, args) {
    embedMessage(msg, args);
  },
};
