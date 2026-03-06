const axios = require("axios")
const {config} = require("dotenv");

config()

class TicketManager{
    constructor() {
        this.clientId = process.env.GLPI_OAUTH_CLIENTID;
        this.clientSecret = process.env.GLPI_OAUTH_CLIENTSECRET;
        this.userName = process.env.GLPI_OAUTH_USERNAME;
        this.password = process.env.GLPI_OAUTH_PASSWORD;
        this.scope = process.env.GLPI_SCOPE;
        this.api = axios.create({baseURL: process.env.GLPI_BASE_URL});
        this.token = null;
        this.tokenExpiration = null
    }

    async getToken() {
        try {
            const response = await this.api.post("/token", {
                client_id: this.clientId,
                client_secret: this.clientSecret,
                grant_type: 'password',
                username: this.userName,
                password: this.password,
                scope: this.scope
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            this.token = response.data.access_token;
            this.tokenExpiration = Date.now() + (response.data.expires_in * 1000)
            this.api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
            return this.token;
        
        } catch(err) {
            console.error("erreur: ", err)
            return null
        }
    }
    
    async verifyToken() {
        if (!this.token || Date.now() > this.tokenExpiration) {
            await this.getToken()
        }
    }
    async getTickets() {
        await this.verifyToken();
        try {
            const res = await this.api.get("/Assistance/Ticket")
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
    async getTicket(id) {
        await this.verifyToken();
        try {
            const res = await this.api.get(`/Assistance/Ticket/${id}`)
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
    
    async delete(id) {
        await this.verifyToken();
        try {
            const res = await this.api.delete(`/Assistance/Ticket/${id}`)
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
            return null
        }
    }

    
    async create(ticket) {
        await this.verifyToken();
        try {
            const res = await this.api.post("/Assistance/Ticket", ticket, {
				headers: {"Content-Type": "application/json"}
			})
            console.log(res.data)
            return res.data
        } catch (error) {
            console.log(error)
            return null
        }
    }
	async createWithFetch(ticket) {
		await this.verifyToken();
		try {
			const res = await fetch(`https://ticket.setex.pro/api.php/Assistance/Ticket`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.token}`
				},
				body: JSON.stringify(ticket)
			})
			const data = await res.json();
			console.log(data);
			return data;
		} catch(err) {
			console.log(err)
			return null
		}
	}
}

const ticket = {
	input: {name: "Problème de clavier",
	content: "certains touches ne fonctionnent pas depuis ce matin",
	user_recipient: {id: 1251},
	category: {id: 12},
	location: {id: 23},
	urgency: 2,
	impact: 3,
	type: 1,
	status: {id: 1}
}}

const manager = new TicketManager();
// manager.create(ticket).then((value) => {
// 	let id = value.id;
// 	manager.getTicket(id).then((value) => {
// 		console.log(value)
// 	}).catch((error) => {
// 		console.log(error)
// 	})
// 	manager.delete(id).then((value) => {
// 		console.log(value)
// 	}).catch((error) => {
// 		console.log(error)
// 	})
// 	console.log(value);
// }).catch((error) => {
// 	console.log(error);
// })
// manager.createWithFetch(ticket)
manager.getTicket(3639).then(value => {
	console.log(value)
})
manager.delete(3639).then(value => {
	console.log("deleted")
})