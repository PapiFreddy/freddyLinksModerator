//constants
const tmi= require("tmi.js")
    ,Discord=require("tmi.js"),
    discordClient=new Discord.Client()
    ,{discord,twitch}=require("./settings.json")
    , twitchClient = new tmi.Client(twitch);

//discord
var links=[]
discordClient.on("ready",()=>{
    console.log("yeah , el bot funciona");
})
// twitch
twitchClient.connect();
discordClient.on("message",msg=>{
    if(msg.content==="$start"){
        setInterval(()=>{
            twitchClient.on("message",(channel,tags,message,self)=>{
                for( let x in message.split(" ")){
                    // repasa el contenido del mensaje
                    if(x.slice(0,5)==="http."||x.slice(0,6)==="https."){
                        discordClient.channels.get("id channel after verification").send(`el usuario ${self} a enviado ${x}`);
                        links.push({name:self,link:x})
                        // debe de enviar al mensaje de verificacion
                        break;   
                    }
                }
            });
        },200)
    }
});
discordClient.on("messageReactionAdd",(reaction,user)=>{
    if(reaction.emoji.name===":thumbsup:"){
        discordClient.channels.get("").send(`mensaje verificado de ${links[links.length-1].name} : ${links[links.length].link} `)
    }
})
discordClient.login(discord.token)