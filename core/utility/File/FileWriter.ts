abstract class FileWriter {
    abstract writeEntireFileContents(path: string, contents: string): void;
    abstract deleteFile(path: string): void;
    abstract makeFileExecutable(path: string): void;
}

export default FileWriter;
