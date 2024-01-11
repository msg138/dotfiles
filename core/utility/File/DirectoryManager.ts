import replaceStringVariables from '../replaceStringVariables.ts';
import DirectoryReader from './DirectoryReader.ts';
import DirectoryWriter from './DirectoryWriter.ts';
import SymlinkWriter from './SymlinkWriter.ts';
import FSDirectoryReader from './FSDirectoryReader.ts';
import FSDirectoryWriter from './FSDirectoryWriter.ts';
import FSSymlinkWriter from './FSSymlinkWriter.ts';

export interface DirectoryConfiguration {
  name: string;
  symlink: string;
  deleteIfPresent: boolean;
  sub: Array<string>;
}

class DirectoryManager {
  private directoryReader: DirectoryReader;
  private directoryWriter: DirectoryWriter;
  private symlinkWriter: SymlinkWriter;

  private writtenLocation: string | null;

  constructor(private directoryConfiguration: DirectoryConfiguration) {
    this.directoryReader = new FSDirectoryReader();
    this.directoryWriter = new FSDirectoryWriter();
    this.symlinkWriter = new FSSymlinkWriter();
    this.writtenLocation = null;
  }

  createSymlink() {
    const finalPath = replaceStringVariables(this.directoryConfiguration.symlink);
    if (!this.symlinkWriter.symlinkExists(finalPath)) {
      if (this.directoryReader.directoryExists(finalPath) && this.directoryReader.isDirectory(finalPath)) {
        console.log('File exists in place. Deleting');
        this.directoryWriter.deleteDirectory(finalPath);
      }
      this.symlinkWriter.createSymlink(this.writtenLocation, finalPath);
    } else {
      console.log('Symlink exists');
    }
  }

  writeDirectory(location: string) {
    console.log('Processing directory', this.directoryConfiguration.name);
    const finalDirectory = replaceStringVariables(`${location}/${this.directoryConfiguration.name}`);
    let directoryExists = this.directoryReader.directoryExists(finalDirectory);
    if (directoryExists) {
      console.log('Already Exists.');
      if (this.directoryConfiguration.deleteIfPresent) {
        console.log('Deleting.');
        this.directoryWriter.deleteDirectory(finalDirectory);
        directoryExists = false;
      }
    }
    if (!directoryExists) {
      console.log('Creating.');
      this.directoryWriter.createDirectory(finalDirectory);
    }

    this.directoryConfiguration.sub?.forEach((subDir) => {
      const finalSubDirectory = replaceStringVariables(`${finalDirectory}${subDir}`);
      if (!this.directoryReader.directoryExists(finalSubDirectory)) {
        console.log('Creating sub', subDir);
        this.directoryWriter.createDirectory(finalSubDirectory);
      } else {
        console.log('Sub already exists', subDir);
      }
    });
    this.writtenLocation = finalDirectory;
  }
}

export default DirectoryManager;

