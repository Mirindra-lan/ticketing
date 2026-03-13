require("dotenv").config()
const axios = require("axios")

class LLM {
    constructor(){
        this.api = axios.create({
            baseURL: process.env.BASE_URL,
            timeout: 100000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPEN_WEBUI_API_KEY}`
            }
        })
        this.conversation = []
    }
    async sendChatLlm(chat) {
        this.conversation = [
            {role: "user", content: `${chat}`}
        ]
        try {
            const res = await this.api.post('/api/chat/completions', {
                model: `${process.env.LLM_MODEL}`,
                messages: this.conversation,
                temperature: 0.1
            });
            return res.data.choices[0].message["content"]
        } catch(error) {
            if(error.response) {
                console.log("Erreur API: ", error.response.data);
            } else if (error.request) {
                console.log("Aucune reponse serveur");
            } else  {
                console.log("Erreur: ", error.response.message)
            }
        }
    }
}

module.exports = LLM