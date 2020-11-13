const getHelp = (msg, args, commands) => {
    const embed = {
        "color": 16750462,
        "author": {
            "name": `${msg.author.username}`,
            "icon_url": `${msg.author.avatarURL()}`
        },
    "fields" : []
    }
    commands.forEach(command => {
        command.name && command.description ? embed.fields.push({name: command.name, value: command.description}) : '';
    });
    return msg.channel.send({embed: embed});
}

module.exports = {
    name: "!help",
    description: "The command to show all other commands.",
    execute(msg, args, commands) {
        getHelp(msg, args, commands);
    }
}