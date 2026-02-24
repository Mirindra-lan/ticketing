const http = require("http")
const {spawn} = require("child_process")

const cmd = 'docker'
const args = ["logs", "-f", "avr-core-google-7"]
const patterns = [
    "Received data from external asr service",
    "Sends text from LLM to TTS"
] 
const serveur = http.createServer();

serveur.on("request", (req, res) => {
    const pythonVersion = spawn(cmd, args);
    pythonVersion.stdout.on("data", (data) => {
        res.write(data.toString())
        res.end()
    })
    pythonVersion.stderr.on("data", (data) => {
        res.end(data.toString())
    })
})

serveur.listen(5500, () => {
    console.log("server run on : http://localhost:5500")
})