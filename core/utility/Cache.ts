import path from 'node:path';
import DirectoryCreator from "./File/DirectoryCreator";
import FileReader from "./File/FileReader";
import FSDirectoryCreator from "./File/FSDirectoryCreator";
import FSFileReader from "./File/FSFileReader";
import DirectoryReader from "./File/DirectoryReader";
import FSDirectoryReader from "./File/FSDirectoryReader";
import FileWriter from "./File/FileWriter";
import FSFileWriter from "./File/FSFileWriter";

export interface CachedFile {
    baseName: string;
}

class Cache {
    private readonly cacheLocation: string;
    private directoryCreator: DirectoryCreator;
    private directoryReader: DirectoryReader;
    private fileReader: FileReader;
    private fileWriter: FileWriter;

    constructor(cacheFolderName: string) {
        this.cacheLocation = path.resolve(__dirname, `../${cacheFolderName}`);
        // TODO Should move this to be injected? Maybe?
        this.directoryCreator = new FSDirectoryCreator();
        this.directoryReader = new FSDirectoryReader();
        this.fileReader = new FSFileReader();
        this.fileWriter = new FSFileWriter();
    }

    isCached(resource: string): boolean {
        this.ensureCacheDirectoryExists();
        return this.fileReader.fileExists(this.generateCachedFileLocation(resource));
    }

    private ensureCacheDirectoryExists() {
        if (!this.directoryReader.directoryExists(this.cacheLocation)) {
            this.directoryCreator.createDirectory(this.cacheLocation);
        }
    }

    getCachedFileObject<DataType extends object>(resource: string): DataType {
        this.ensureCacheDirectoryExists();
        const fileContents = this.getCachedFileContents(resource);
        return JSON.parse(fileContents) as DataType;
    }

    private getCachedFileContents(resource: string): string {
        return this.fileReader.readFileContents(this.generateCachedFileLocation(resource));
    }

    generateCachedFileLocation(resource: string): string {
        return path.join(this.cacheLocation, resource);
    }

    createCachedFile(resource: string) {
        this.ensureCacheDirectoryExists();
        this.fileWriter.writeEntireFileContents(this.generateCachedFileLocation(resource), '');
    }
    writeCache(resource: string, contents: object) {
        this.ensureCacheDirectoryExists();
        this.fileWriter.writeEntireFileContents(this.generateCachedFileLocation(resource), JSON.stringify(contents));
    }

    deleteCachedFile(resource: string) {
        this.ensureCacheDirectoryExists();
        this.fileWriter.deleteFile(resource);
    }

    deleteAllCachedFiles() {
        const allCachedFiles = this.getCachedFiles();
        allCachedFiles.forEach((cachedFile) => {
            this.deleteCachedFile(cachedFile.baseName);
        });
    }

    getCachedFiles(directory?: string): Array<CachedFile> {
        this.ensureCacheDirectoryExists();
        return this.directoryReader.readDirectoryContents(directory ? this.generateCachedFileLocation(directory) : this.cacheLocation).map((file) => ({
            baseName: directory ? `${directory}/${file}` : file,
        }));
    }
}

export default Cache;
