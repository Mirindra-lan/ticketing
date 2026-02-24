const http = require("http")

const serveur = http.createServer()

serveur.on("request", (req, res) => {
    res.write("hello from server")
    res.end()
})

serveur.listen(3003, () => {
    console.log("server run on : http://localhost:3003")
})