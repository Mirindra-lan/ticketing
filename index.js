const http = require("http");
const { spawn } = require("child_process");
require("dotenv").config();
const logger = require("./src/logger/logger");
const TicketManager = require("./src/ticket/ticketManager");
const Llm = require("./src/llm/llm")

const port = process.env.PORT || 5500;
const dockerContainer = "avr-core-google-10";

const discussions = {}

// Les patterns à filtrer
const patterns = [
    " [INFO]: UUID packet received: ",
    " Sends text from LLM to TTS: ",
    " Received data from external asr service: ",
    "Socket Client disconnected",
];

// On crée le serveur HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked" // permet le streaming
    });

  // On spawn docker logs en streaming pour ce client
    const dockerLogs = spawn("docker", ["logs", "-f", dockerContainer]);
    const manager = new TicketManager();
    const llm = new Llm();

    dockerLogs.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");
        lines.forEach( line => {
            if(line.includes([patterns[0]])){
                let cleanData = line.split(patterns[0])
                let uuidd = cleanData[1]
                let date = cleanData[0]
                discussions[uuidd] = ""
                cleanData = date + " : Nouvelle discussion"
                discussions[uuidd] += cleanData + "\n"
                res.write(cleanData + "\n")
            }
            if(line.includes([patterns[1]])){
                let cleanData = line.split(patterns[1])
                let uuidd = cleanData[0].slice(29, 29+36)
                let mes = cleanData[1]
                cleanData = "Bot:" + mes
                if(discussions[uuidd]) {
                    discussions[uuidd] += cleanData + "\n"
                }
                res.write(cleanData + "\n")
            }
            if(line.includes([patterns[2]])){
                let cleanData = line.split(patterns[2])
                let uuidd = cleanData[0].slice(29, 29+36)
                let mes = cleanData[1]
                cleanData = "User:" + mes
                if(discussions[uuidd]) {
                    discussions[uuidd] += cleanData + "\n"
                }
                res.write(cleanData + "\n")
            }
            if(line.includes(patterns[3])){
                let uuidd = line.slice(29, 29+36)
                console.log(discussions[uuidd])
                logger.info(discussions[uuidd])
                llm.sendChatLlm(discussions[uuid]).then((v) => {
                    const dd = v;
                    if(dd) {
                        const manager = new TicketManager()
                        manager.create(dd).then(value => {
                            manager.getTicket(value.id).then(valu => {
                                console.log(valu)
                            })
                            manager.delete(value.id).then(val=>{
                                console.log(val)
                            })
                        }).catch((err) => {
                            console.log("error: ", err)
                        })
                    }
                })
                res.write("Fin de la discussion\n\n")
            }
        });
    });
    dockerLogs.stdout.on("end", ()=>{
        res.end()
    })
  
    dockerLogs.stderr.on("data", (data) => {
        res.write(`ERROR: ${data.toString()}\n`);
    });
    dockerLogs.stderr.on("end", ()=>{
        res.end()
    })
    
  // Si le client ferme la connexion, on tue le processus docker logs pour éviter fuite de ressources
    req.on("close", () => {
        dockerLogs.kill();
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

//2026-03-03 08:18:59 [INFO]: [550e8400-e29b-41d4-a716-446655440000]