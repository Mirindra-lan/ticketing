const http = require("http");
const { spawn } = require("child_process");
require("dotenv").config();

const port = process.env.PORT || 5500;
const dockerContainer = "avr-core-google-10";

// Les patterns à filtrer
const patterns = [
  "Received data from external asr service",
  "Sends text from LLM to TTS"
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
    lines.forEach(line => {
      if(patterns.some(p => line.includes(p))) {
        res.write(line + "\n"); // envoie ligne filtrée au client
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