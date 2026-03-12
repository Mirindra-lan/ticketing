const { spawn } = require("child_process")

dockerLogs = spawn("docker", ["logs", "-f", "--since=1s", "avr-core-google-10"])

function watchLogs() {
    dockerLogs.stdout.on("data", (data) => {
        console.log(data.toString());
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