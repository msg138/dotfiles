abstract class FileReader {
    abstract readFileContents(path: string): string;
    abstract fileExists(path: string): boolean;
    abstract isFile(path: string): boolean;
}

export default FileReader;
