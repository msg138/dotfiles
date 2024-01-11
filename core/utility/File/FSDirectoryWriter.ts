import fs from 'node:fs';
import DirectoryWriter from "./DirectoryWriter";

class FSDirectoryCreator extends DirectoryWriter {
    createDirectory(path: string) {
        fs.mkdirSync(path, { recursive: true });
    }

    deleteDirectory(path: string) {
        fs.rmSync(path, { recursive: true });
    }
}

export default FSDirectoryCreator;
