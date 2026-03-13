class Ticket {
    constructor(ticket) {
        const ticketJson = this.jsonParser(ticket)
        if(ticketJson) {
            this.name = ticketJson.name;
            this.content = ticketJson.content;
            this.impact = ticketJson.impact;
            this.urgency = ticketJson.urgency;
            this.location = ticketJson.location;
            this.category = ticketJson.category;
        }
    }
    getName() {
        return this.name;
    }
    getContent() {
        return this.content;
    }
    getImpact() {
        return this.impact;
    }
    getUrgency() {
        return this.urgency;
    }
    getLocation() {
        return this.location;
    }
    getCategory() {
        return this.category;
    }
    jsonParser(str) {
        const openIndex = str.lastIndexOf("{")
        const closeIndex = str.indexOf("}")
        let cleanJson = ""
        if(openIndex != -1 && closeIndex != -1) {
            cleanJson = str.slice(openIndex, closeIndex + 1)
        }
        if(!cleanJson) {
            return null
        }
        try {
            const data = JSON.parse(cleanJson)
            return data
        } catch(er) {
            return null
        }
    }
}

module.exports = Ticket;