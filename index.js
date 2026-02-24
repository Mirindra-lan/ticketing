const http = require("http")
const {spawn} = require("child_process")

require("dotenv").config()
const port = process.env.PORT || 5500
const cmd = 'docker'
const args = ["logs", "-f", "avr-core-google-10"]
const patterns = [
    "Received data from external asr service",
    "Sends text from LLM to TTS"
] 
const serveur = http.createServer((req, res) => {
    const pythonVersion = spawn(cmd, args);
    pythonVersion.stdout.on("data", (data) => {
        const lines = data.toString().split("\n")
        lines.forEach(element => {
            if(lines.includes(patterns[0]) || lines.includes(patterns[1])){
                res.write(element+"\n")
            }
        });
        // res.write(data.toString())
        res.end()
    })
    pythonVersion.stderr.on("data", (data) => {
        res.end(data.toString())
    })
});

serveur.listen(port, () => {
    console.log(`server run on : http://localhost:${port}`)
})