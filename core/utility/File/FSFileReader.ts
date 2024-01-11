import fs from 'node:fs';
import FileReader from "./FileReader";

class FSFileReader extends FileReader {
    readFileContents(path: string): string {
        return fs.readFileSync(path, 'utf8');
    }

    fileExists(path: string): boolean {
        return fs.existsSync(path);
    }

    isFile(path: string): boolean {
      const fileStats = fs.statSync(path);
      return fileStats.isFile();
    }
}

export default FSFileReader;
