const numbers = require("numbers");
const talkedRecently = new Set();

const getRandomValue = (mean, stdev, method) => {
  return method(1, mean, stdev);
};

  const checkArgsLength = (args) => {
  args = args.join(" ");
  let maxLength = 100;
  return args.length > maxLength ? args.substring(0, maxLength - 3) + '...' : args;
}

const cheems = ['https://static.wikia.nocookie.net/dogelore/images/8/87/411.png/revision/latest/top-crop/width/360/height/450?cb=20200330152532',
                'https://i.pinimg.com/736x/76/83/11/7683113f776316042147d0996432b97c.jpg'
              ];
cheems.push("https://i.pinimg.com/originals/3c/4a/43/3c4a4364dfa8127f5e44d97af8738b79.jpg");
cheems.push("https://preview.redd.it/8msvzfdwda341.png?auto=webp&s=e0c82c7019db4aca5c477e6fa7a730db5f514521");
cheems.push("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSWi532p_16R8peZqxMsbCFmVYznxvvfWd_3w&usqp=CAU");
cheems.push("https://cdn140.picsart.com/330832974036201.jpg");
cheems.push("https://m.media-amazon.com/images/I/61Cn7DCHFjL._SS500_.jpg");
cheems.push("https://qph.fs.quoracdn.net/main-qimg-9a391fb01378a7a5ed417a799dd7a63f");
cheems.push("https://www.youtube.com/watch?v=YWOZtGMer48");
cheems.push("https://i.imgflip.com/49ckev.jpg");
cheems.push("https://i.imgflip.com/49ciql.jpg");
cheems.push("https://static.wikia.nocookie.net/dogelore/images/3/30/Sherlock_Cheems.png/revision/latest?cb=20200603165036");
cheems.push("https://fiverr-res.cloudinary.com/images/q_auto,f_auto/gigs/152138743/original/1271f35e3cec40458ac6689d0d076693556b7beb/make-any-custom-doge-or-cheems-of-your-choice.jpg");
cheems.push("https://i.redd.it/9pzpe8al6rc51.png");
cheems.push("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTwrsiafmfI_zD2ryrJALkF2m8IYmOKJp5SKA&usqp=CAU");
cheems.push("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ8OuoCBuQ1hvV-yeqgAjVved-8k52lcYBDUQ&usqp=CAU");
cheems.push("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRL-eN9MBnwqPVYmRl8abdaniBp4DWju-r27w&usqp=CAU");
cheems.push("https://img-9gag-fun.9cache.com/photo/aGdGBVw_460s.jpg");
cheems.push("https://cdn131.picsart.com/314921733231211.png");
cheems.push("https://www.meme-arsenal.com/memes/c4c9a7aba00b17d8424db867050d2087.jpg");
cheems.push("https://cdn131.picsart.com/326966243021211.png?type=webp&to=min&r=640");
cheems.push("https://preview.redd.it/rfi44rqhf2541.png?auto=webp&s=8a69bc0c60215772cadd40d0c35ba15f722c51e5");
cheems.push("https://cdn140.picsart.com/325173214010211.png?type=webp&to=min&r=640");
cheems.push("https://pbs.twimg.com/media/EeArhaJXgAA2aRv.png");
cheems.push("https://www.kindpng.com/picc/m/767-7675667_hatsunemiku-hatsune-miku-cheems-doge-meme-freetoedit-cheems.png");
cheems.push("https://www.youtube.com/watch?v=nL-7QjJkkbw");
cheems.push("https://pbs.twimg.com/profile_images/1276300106615025666/YuFyHVTD_400x400.jpg");
cheems.push("https://i.kym-cdn.com/photos/images/newsfeed/001/871/884/be7.jpg");
cheems.push("https://preview.redd.it/omzzb4cdlna41.png?width=640&auto=webp&s=83cd98ed7d78707556aa509381e029587dbc2786");
cheems.push("https://i.imgur.com/U7N8k72.jpg");
cheems.push("https://i.pinimg.com/236x/39/28/3e/39283e5654e5557c91355b155be9f2cf.jpg");
cheems.push("https://preview.redd.it/0yau02m8ke941.png?auto=webp&s=1b4309cd7c6706c0cf1e073bfe22d6ab3c8baac7");
cheems.push("https://cdn.discordapp.com/attachments/776858248611364865/776886020741791795/american_pie.mp4");



const generateRoll = () => {
  return Math.floor(Math.random() * Math.floor(cheems.length));
};


const embedMessage = (msg, args) => {
  let roll = generateRoll();
  return msg.channel.send(`${cheems[roll]}`);
}

module.exports = {
  name: "!cheems",
  description: "cheemsburgber",
  execute(msg, args) {

    if (talkedRecently.has(msg.author.id)) {
          
    } else {

           // the user can type the command ... your command code goes here :)
           embedMessage(msg, args);
        // Adds the user to the set so that they can't talk for a minute
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
          // Removes the user from the set after a minute
          talkedRecently.delete(msg.author.id);
        }, 20000);
    }

  },
};
