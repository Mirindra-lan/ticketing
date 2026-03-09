const LLM = require("./src/llm/llm")
const TicketManager = require("./src/ticket/ticketManager")
const {config} = require("dotenv");
const Ticket = require("./src/ticket/ticket")

config()

const llm = new LLM()
const disc = `2026-03-06 11:02:45 : Nouvelle discussion
Bot:"Bonjour"
User:salut
Bot:Salut !
Bot:Comment je peux t'aider ?
User:mon ordinateur mal fonctionné
Bot:Ah ouais, c’est chiant quand un ordi décide de faire des caprices.
Bot:Tu peux me décrire un peu ce qui se passe exactement ?
Bot:Par exemple, il ne s’allume pas, il plante tout le temps, ou il fait un truc bizarre que tu ne comprends pas ?
User:il ne s'allume plus
Bot:Ok, donc le PC ne s’allume plus.
Bot:C’est pas simple, mais on va y arriver.
Bot:Tu peux me dire ton prénom ?
Bot:Et dans quel service tu travailles, juste pour que je note bien ?
User:mon nom est Luc
Bot:C’est bien noté, Luc.
Bot:Et dans quel service tu travailles, juste pour que je note bien ?
User:je travaille dans le domaine d'informatique
Bot:C’est noté, Luc, tu es dans le domaine de l’informatique.
Bot:Et dans quel service précisément tu travailles ?
Bot:Par exemple, maintenance, développement, support… ?
Bot:Et aussi, sur quel site tu es basé : SETEX1, SETEX2, MONTECRISTO, LATONELLE ou GEODEK ?
User: je suis passé dans le site
Bot:Ah, tu es passé sur un site, mais je ne sais pas lequel.
Bot:Tu peux me préciser le nom du site : SETEX1, SETEX2, MONTECRISTO, LATONELLE ou GEODEK ?
Bot:Et si tu veux, tu peux aussi me dire où tu es exactement : garage, sous-sol, rez-de-chaussée… ?
User:DX 1 sous sol
Bot:Ah, tu es au sous-sol.
Bot:Et pour le site, tu as dit DX1, mais je ne suis pas sûr.
Bot:Tu peux confirmer si c'est SETEX1, SETEX2, MONTECRISTO, LATONELLE ou GEODEK ?
User:salut DX1
Bot:Ah, tu es au DX1, mais je ne suis pas sûr si c'est SETEX1, SETEX2, MONTECRISTO, LATONELLE ou GEODEK.
Bot:Pourrais-tu confirmer le nom exact du site ?
Bot:Et si tu veux, tu peux aussi me dire si tu es au sous-sol, garage, rez-de-chaussée… pour que je note tout précisément.
User:mont Cristo
Bot:Ah, Monte Cristo !
Bot:C’est bien noté, Luc.
Bot:Et tu es au sous-sol, c’est ça ?
Bot:Je résume : ton ordinateur ne s’allume plus, tu es Luc, dans le domaine de l’informatique, sur le site de Monte Cristo, au sous-sol.
Bot:C’est bien ça ?
Bot:Je crée le ticket et quelqu’un te rappelle dans la journée.
User:oui c'est bien ça
Bot:Ok, parfait !
Bot:Je crée le ticket immédiatement.
Bot:Un technicien va te rappeler dans la journée, et je te tiens au courant si besoin.
Bot:À très vite, Luc !
Fin de la discussion
`
const dixx = `
bot: Bonjour ! En quoi puis-je vous assister aujourd'hui ?
user: Bonjour, je travaille dans le site Setex1, au sous-sol, dans le service technique. Je m'appelle Luc.
bot: Enchanté Luc ! Merci pour ces informations.`

llm.sendChatLlm(dixx).then((value) => {
    const dd = value;
    if(dd) {
        const manager = new TicketManager()
        manager.create(dd).then(value => {
            if(value) {
                manager.getTicket(value.id).then(valu => {
                    console.log(valu)
                })
                manager.delete(value.id).then(val=>{
                    console.log(val)
                })
            }
        }).catch((err) => {
            console.log("error: ", err)
        })
    }
})