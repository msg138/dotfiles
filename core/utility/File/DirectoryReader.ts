abstract class DirectoryReader {
    abstract readDirectoryContents(path: string): Array<string>;
    abstract directoryExists(path: string): boolean;
    abstract isDirectory(path: string): boolean;
}

export default DirectoryReader;
