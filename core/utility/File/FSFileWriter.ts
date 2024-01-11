import fs from 'node:fs';
import ChildProcess from "node:child_process";
import FileWriter from "./FileWriter";

class FSFileWriter extends FileWriter {
    writeEntireFileContents(path: string, contents: string) {
        fs.writeFileSync(path, contents);
    }

    deleteFile(path: string) {
        fs.rmSync(path);
    }

    makeFileExecutable(path: string) {
        ChildProcess.execSync(`chmod +x ${path}`);
    }
}

export default FSFileWriter;
