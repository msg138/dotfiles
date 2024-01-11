import fs from 'node:fs';
import DirectoryReader from "./DirectoryReader";

class FSDirectoryReader extends DirectoryReader {
    readDirectoryContents(path: string): Array<string> {
        return fs.readdirSync(path);
    }

    directoryExists(path: string): boolean {
        return fs.existsSync(path);
    }

    isDirectory(path: string): boolean {
        return fs.statSync(path).isDirectory();
    }
}

export default FSDirectoryReader;
