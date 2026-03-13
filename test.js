const LLM = require("./src/llm/llm")
const TicketManager = require("./src/ticket/ticketManager")
const {config} = require("dotenv");
const Ticket = require("./src/ticket/ticket")

config()

const llm = new LLM()
const disc = `2026-03-12 06:31:25 : Nouvelle discussion
Bot:"Bonjour"
User:salut
Bot:Salut !
Bot:Comment je peux t'aider aujourd'hui ?
User:mon ordinateur ne démarre plus
Bot:Ah, c’est embêtant ça !
Bot:Qu’est-ce qui se passe exactement quand tu essaies de démarrer ton ordinateur ?
Bot:Tu entends un bruit, le moniteur reste noir, ou il s’allume mais ne charge rien ?
User:il s'allume mais
Bot:Ah, il s'allume mais.
Bot:.
Bot:.
Bot:?
Bot:Peux-tu me dire ce qui se passe exactement ?
User:il a fait juste un texte sur un écran bleu
Bot:Ah, un écran bleu… C’est souvent un signe de problème de pilote, de logiciel ou même de matériel.
Bot:Peux-tu me dire exactement ce que dit le texte sur l’écran ?
Bot:Par exemple, un code comme “IRQL_NOT_LESS_OR_EQUAL” ou un message comme “Panne du disque dur” ?
Bot:Et si tu peux, prends une photo de l’écran et je te dirai comment l’envoyer à l’équipe technique.
User:panne de discute
Bot:Ah, une panne de disque… C’est pas rare, mais ça peut être bloquant.
Bot:Tu peux me dire ton prénom, comme ça je note directement dans le ticket ?
User:mon prénom est Alex
Bot:Ah, ok Alex.
Bot:Et dans quel service tu travailles, comme ça je note tout dans le ticket ?
User:je suis dans le service info
Bot:Ah, service informatique, c’est bien ça ?
Bot:Et sur quel site tu es basé, Alex ?
Bot:Setex1, Setex2, Montécristo, Latonelle ou GeoDek ?
User:c'est dans le deuxème site
Bot:Ah, ok, Setex2, c’est bien ça ?
Bot:Et tu es sur quel étage ou quel local, Alex ?
Bot:Garage, sous-sol, rez-de-chaussée, R1, R2, R3, ou DMZ ?
User:R + 3
Bot:Ok donc si je résume : ton ordinateur affiche un écran bleu avec un message de panne de disque, tu es Alex du service informatique sur le site de Setex2 au R3.
Bot:C’est bien ça ?
Bot:Je crée le ticket et quelqu’un te rappelle dans la journée.
User:oui c'est bien ça
Bot:Parfait, je note tout et je crée le ticket.
Bot:Un collègue va te rappeler dans la journée pour en savoir plus.
Bot:Merci, Alex, et à très vite !
`
const dixx = `
bot: Bonjour ! En quoi puis-je vous assister aujourd'hui ?
user: Bonjour, je travaille dans le site Setex1, au sous-sol, dans le service technique. Je m'appelle Luc.
bot: Enchanté Luc ! Merci pour ces informations.`

llm.sendChatLlm(disc).then((value) => {
    const dd = value;
    console.log(dd)
    // if(dd) {
    //     const manager = new TicketManager()
    //     manager.create(dd).then(value => {
    //         if(value) {
    //             manager.getTicket(value.id).then(valu => {
    //                 console.log(valu)
    //             })
    //             manager.delete(value.id).then(val=>{
    //                 console.log(val)
    //             })
    //         }
    //     }).catch((err) => {
    //         console.log("error: ", err)
    //     })
    // }
})