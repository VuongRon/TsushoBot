const fs = require("fs");
const db = require("../models").sequelize;
const userModel = db.models.User;
const userFileLocation = "users";

const mergeUsers = async () => {
  let users = fs.readdirSync(userFileLocation);
  users = users.filter((e) => e.match(/.*\.json/gi));
  for (const user of users) {
    const filePath = `${userFileLocation}/${user}`;
    const data = fs.readFileSync(filePath);
    const count = JSON.parse(data);
    const userInstance = await userModel
      .create({
        discordId: user.split(".")[0],
        count: Object.values(count),
      })
      .then(() => {
        console.log(
          `inserted - id: ${userInstance.discordId}, count: ${userInstance.count}`
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

mergeUsers();
