const fs = require("fs");
const path = require("path");
const winston = require("winston");

const { combine, timestamp, printf, errors } = winston.format;

// Crée le dossier logs s'il n'existe pas
const logDir = path.resolve(__dirname,"../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const discussionFile = path.join(logDir, "discussion.log");

// Vider le fichier chaque semaine (ici lundi)
const now = new Date();
const dayOfWeek = now.getDay(); // 0 = dimanche, 1 = lundi...
if (dayOfWeek === 1) { // lundi
    fs.writeFileSync(discussionFile, "", "utf8");
}

// Format personnalisé
const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `
        [${timestamp}] : Nouveau discussion
        ${message}\n
    `;
});

// Création du logger
const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        logFormat
    ),
    transports: [
        // Fichier discussion unique
        new winston.transports.File({
            filename: discussionFile,
            level: "info",
        }),

        // Fichier pour erreurs critiques
        new winston.transports.File({
            filename: path.join(logDir, "error.log"),
            level: "error",
        }),

        // Console pour dev
        new winston.transports.Console({
            format: combine(
                timestamp({ format: "HH:mm:ss" }),
                winston.format.colorize(),
                logFormat
            ),
        }),
    ],
});

module.exports = logger;