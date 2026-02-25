const http = require("http");
const { spawn } = require("child_process");
require("dotenv").config();

const port = process.env.PORT || 5500;
const dockerContainer = "avr-core-google-10";


// Les patterns à filtrer
const patterns = [
    "UUID packet received:",
    "Sends text from LLM to TTS:",
    "Received data from external asr service:",
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

    dockerLogs.stdout.on("data", (data) => {
        const lines = data.toString().split("\n");
        let discussion = ""
        lines.forEach(line => {
            if(line.includes([patterns[0]])){
                let cleanData = line.split(patterns[0])[1]
                cleanData = "Nouveau discussion"
                res.write(cleanData + "\n")
            }
            if(line.includes([patterns[1]])){
                let cleanData = line.split(patterns[1])[1]
                cleanData = "Bot:" + cleanData
                discussion = discussion + cleanData + "\n"
                res.write(cleanData + "\n")
            }
            if(line.includes([patterns[2]])){
                let cleanData = line.split(patterns[2])[1]
                cleanData = "User:" + cleanData
                discussion = discussion + cleanData + "\n"
                res.write(cleanData + "\n")
            }
            if(line.includes(patterns[3])){
                console.log("\n\n" + discussion)
                discussion = ""
            }
    //   if(patterns.some(p => line.includes(p))) {
    //     res.write(line + "\n"); // envoie ligne filtrée au client
    //   }
            // res.end()
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