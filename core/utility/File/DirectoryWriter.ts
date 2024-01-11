abstract class DirectoryWriter {
    abstract createDirectory(path: string): void;
    abstract deleteDirectory(path: string): void;
}

export default DirectoryWriter;
