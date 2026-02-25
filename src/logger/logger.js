const fs = require("fs");
const path = require("path");
const winston = require("winston");

const { combine, timestamp, printf, errors } = winston.format;

// Crée le dossier logs s'il n'existe pas
const logDir = path.resolve(__dirname, "../../logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const discussionFile = path.join(logDir, "discussion.log");
const errorFile = path.join(logDir, "error.log");

// Vider le fichier une fois par semaine (ici lundi)
const now = new Date();
const dayOfWeek = now.getDay(); // 0 = dimanche, 1 = lundi ...
if (dayOfWeek === 1) { // lundi
  fs.writeFileSync(discussionFile, "", "utf8");
}

// Format personnalisé
const logFormat = printf(({ level, message, timestamp, stack }) => {
  if (level.toLowerCase() === "info") {
    return `[${timestamp}] : Nouveau discussion\n${message}\n`;
  } else if (level.toLowerCase() === "error") {
    return `[${timestamp}] 🚨 ERROR\n${stack || message}\n`;
  } else {
    return `[${timestamp}] ${level.toUpperCase()} : ${stack || message}\n`;
  }
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
    // Fichier discussion unique (append par défaut)
    new winston.transports.File({
      filename: discussionFile,
      level: "info",
    }),

    // Fichier pour erreurs critiques
    new winston.transports.File({
      filename: errorFile,
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