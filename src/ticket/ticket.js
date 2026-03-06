class Ticket {
    constructor(ticketJson) {
        this.name = ticketJson.name;
        this.content = ticketJson.content;
        this.impact = ticketJson.impact;
        this.urgency = ticketJson.urgency;
        this.location = ticketJson.location;
        this.category = ticketJson.category;
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
}

module.exports = Ticket;