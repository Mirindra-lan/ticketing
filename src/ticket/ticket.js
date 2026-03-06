class Ticket {
    constructor(name, content, userid) {
        this._name = name || "";
        this._content = content || "";
        this._userid = userid || "";
        this._type = "ticket";
    }

    get name() {
        return this._name;
    }

    get content() {
        return this._content;
    }

    get userid() {
        return this._userid;
    }

    get type() {
        return this._type;
    }

    set name(value) {
        this._name = value;
    }

    set content(value) {
        this._content = value;
    }

    set userid(value) {
        this._userid = value;
    }

    toJSON() {
        return {
            input: {
                name: this._name,
                content: this._content,
                type: this._type,
                users_id_requester: this._userid.toString()
            }
        };
    }

    fromJSON(json) {
        if (json.input) {
            this._name = json.input.name || "";
            this._content = json.input.content || "";
            this._userid = json.input.users_id_requester || "";
            this._type = json.input.type || "ticket";
        }
    }
}

module.exports = Ticket;