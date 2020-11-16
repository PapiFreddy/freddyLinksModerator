//constants
const tmi = require("tmi.js"),
  discord = require("discord.js"),
  client = new discord.Client(),
  settings = require("./settings.json"),
  tClient = new tmi.Client(settings.twitch);
//discord
client.on("ready", () => {
  console.log("yeah , el bot funciona");
});
// twitch
var links = [];
tClient.connect();
var diference = {
  after: 0,
  before: 0
};
tClient.on("message", async (channel, tags, message, self) => {
  let LinkReview = message.split(" ");

  for (let x in LinkReview) {
    // repasa el contenido del mensaje

    if (
      LinkReview[x].slice(0, 5) === "http:" ||
      LinkReview[x].slice(0, 6) === "https:"
    ) {
      links.push(JSON.stringify({ name: tags.username, link: LinkReview[x] }));
      diference.after = links.length;
      console.log("es un link");
      // debe de enviar al mensaje de verificacion
      break;
    }
  }
});

client.on("message", async msg => {
  if (msg.content === "$start") {
    setInterval(() => {
      if (diference.after != diference.before) {
        client.channels.cache
          .get("canal de links antes de verificar")
          .send(links[links.length - 1]);
      }
      diference.before = links.length;
    }, 200);
  }
  if (msg.author.id == "bot id") {
    msg.react("👍");
    msg.react("👎");
  }
});
client.on("messageReactionAdd", (reaction, user) => {
  console.log(reaction.count);
  if ((reaction.emoji.name === ":thumbsup:"&&reaction.count>3){
    let content = JSON.parse(reaction.message);
    client.channels.cache
      .get("canal de links verificados")
      .send(`mensaje verificado de ${content.name} : ${content.link} `);
  }
});

client.login(settings.token);
