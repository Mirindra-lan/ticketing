const LLM = require("./src/llm/llm")

const llm = new LLM()
const disc = `2026-03-03 09:57:41 : Nouvelle discussion
Bot:"Bonjour"
User:bonjour
Bot:Bonjour et bienvenue au standard du service technique du groupe SETEX, je suis Alex.
Bot:Comment je peux t'aider ?
User:c'est un problème sur mon clavier
Bot:Ah, un problème de clavier, c’est embêtant.
Bot:Pourrais-tu me dire ce qui ne fonctionne pas exactement ?
Bot:Par exemple, certains touches ne répondent pas, ou le clavier ne s’allume pas du tout ?
User:ne répond plus
Bot:Ah, un clavier qui ne répond plus, c’est vraiment désagréable.
Bot:Tu as déjà essayé de le rebrancher ou de le connecter à un autre appareil pour voir si le problème persiste ?
Bot:Et c’est un clavier externe ou le clavier intégré de ton ordinateur ?
User:c'est un clavier externe d'autres touches fonctionne parfaitement
Bot:D’accord, donc tu as un clavier externe où certaines touches ne répondent plus, mais d’autres fonctionnent bien.
Bot:C’est bien ça ?
Bot:Pourrais-tu me donner ton prénom, s’il te plaît ?
User:mon nom est Luc
Bot:Super, merci Luc.
Bot:Pourrais-tu me dire dans quel service ou activité tu travailles, s’il te plaît ?
Bot:Et quel est ton site ou localisation ?
User:je suis dans le service de l'opérateur à Paris
Bot:Ok donc si je résume : ton clavier externe ne répond plus sur certaines touches, mais d’autres fonctionnent bien.
Bot:Tu es Luc, du service de l’opérateur à Paris.
Bot:C’est bien ça ?
Bot:Je crée le ticket et quelqu’un te rappelle dans la journée.
Bot:Tu as d’autres précisions à ajouter, ou je peux passer à la suite ?
User:tu peux passer à la suite car tout est correct
Bot:D’accord, je crée le ticket tout de suite.
Bot:Merci pour ton temps, Luc, et à bientôt !
Bot:Si tu as besoin de quelque chose d’autre, n’hésite pas à me le dire.
`
llm.sendChatLlm("Bonjour, comment allez-vous?").then((value) => {
    console.log(value)
})
