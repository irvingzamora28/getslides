import fs from 'fs';
import { join, dirname } from 'path';

class Logger {
  private logFilePath: string;

  constructor() {
    // Define the log file path relative to the project root
    this.logFilePath = join(process.cwd(), 'storage/logs/app.log');
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    const dir = dirname(this.logFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  public log(message: string) {
    const timestamp = this.getCurrentTimestamp();
    const logMessage = `${timestamp} - ${message}\n`;
    fs.appendFileSync(this.logFilePath, logMessage);
  }

  public error(message: string) {
    this.log(`ERROR: ${message}`);
  }

  public info(message: string) {
    this.log(`INFO: ${message}`);
  }
}

export default new Logger();
