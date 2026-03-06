const axios = require("axios")
const Ticket = require("./ticket")


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
            const res = await this.api.get("/Assistance/Ticket", {
                params: {
                    limit: 3
                }
            })
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

        const tic = new Ticket(ticket);
        
        const data = new FormData();
        data.append("name", tic.getName());
        data.append("content", tic.getContent());
        data.append("urgency", tic.getUrgency());
        data.append("impact", tic.getImpact());
        data.append("type", 1);
        data.append("category", tic.getCategory());
        data.append("location", tic.getLocation());
        data.append("request_type", 1);
        
        try {
            const res = await this.api.post("/Assistance/Ticket", data, {
				headers: {"Content-Type": "multipart/formdata"}
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

module.exports = TicketManager