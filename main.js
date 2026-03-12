const { spawn } = require("child_process")
const logger = require("./src/logger/logger")
const Llm = require("./src/llm/llm")
const TicketManager = require("./src/ticket/ticketManager")

const dockerContainer = "avr-core-google-10";
const discussions = {}
const patterns = [
    " [INFO]: UUID packet received: ",
    " Sends text from LLM to TTS: ",
    " Received data from external asr service: ",
    "Socket Client disconnected",
];
const llm = new Llm()
const manager = new TicketManager()

function createTicket(discussion) {
    llm.sendChatLlm(discussion).then(v => {
        if(dd) {
            manager.create(dd).then(value =>{
                if(value?.id) {
                    manager.getTicket(value.id).then(val => {
                        console.log("\nNew ticket created:\n", val)
                    })
                }
            }).catch((reason) => {
                console.log("Ticket not created")
            })
        }
    }).catch((reason) => {
        console.log("Maybe LLM service is not avalaible")
    })
}
function filterLogs(data) {
    const lines = data.toString().split("\n");
    lines.forEach( line => {
        if(line.includes([patterns[0]])){
            let cleanData = line.split(patterns[0])
            let uuidd = cleanData[1]
            let date = cleanData[0]
            discussions[uuidd] = ""
            cleanData = date + " : Nouvelle discussion"
            discussions[uuidd] += cleanData + "\n"
            console.log(cleanData + "\n")
        }
        if(line.includes([patterns[1]])){
            let cleanData = line.split(patterns[1])
            let uuidd = cleanData[0].slice(29, 29+36)
            let mes = cleanData[1]
            cleanData = "Bot:" + mes
            if(discussions[uuidd]) {
                discussions[uuidd] += cleanData + "\n"
            }
            console.log(cleanData + "\n")
        }
        if(line.includes([patterns[2]])){
            let cleanData = line.split(patterns[2])
            let uuidd = cleanData[0].slice(29, 29+36)
            let mes = cleanData[1]
            cleanData = "User:" + mes
            if(discussions[uuidd]) {
                discussions[uuidd] += cleanData + "\n"
            }
            console.log(cleanData + "\n")
        }
        if(line.includes(patterns[3])){
            let uuidd = line.slice(29, 29+36)
            logger.info(discussions[uuidd])
            createTicket(discussions[uuidd])
            console.log("Fin de la discussion\n\n")
        }
    });
}
function watchLogs() {
    const dockerLogs = spawn("docker", ["logs", "-f", "--since=1s", dockerContainer])
    
    dockerLogs.stdout.on("data", (data) => {
        filterLogs(data)
    });
    dockerLogs.stdout.on("end", () => {
        console.log("Terminate task");
    });
    
    dockerLogs.stderr.on("data", (data) => {
        console.log(data.toString());
    });
    
    dockerLogs.stderr.on("end", () => {
        console.log("Error terminate");
    });
}

watchLogs()