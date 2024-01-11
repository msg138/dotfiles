import replaceStringVariables from '../replaceStringVariables';
import FileReader from "../File/FileReader";
import FSFileReader from "../File/FSFileReader";
import GlobalConfiguration from "../GlobalConfiguration";
import FileWriter from "../File/FileWriter";
import FSFileWriter from "../File/FSFileWriter";
import SymlinkWriter from '../File/SymlinkWriter';
import FSSymlinkWriter from '../File/FSSymlinkWriter';

export interface ConfigurationContents {
  fileName: string;
  symlink: string;
  configValues: Array<{
    key: string;
    value: string;
    deliminator?: string;
  }>;
  // Used in the case of Record / object types
  // Will default to space
  deliminator?: string;
  lineCommentCharacter?: string;
}

class ConfigurationManager {
    protected fileReader: FileReader;
    protected fileWriter: FileWriter;
    protected symlinkWriter: SymlinkWriter;

    protected writtenLocation: string | null;

    constructor(protected configurationContents: ConfigurationContents) {
        this.fileReader = new FSFileReader();
        this.fileWriter = new FSFileWriter();
        this.symlinkWriter = new FSSymlinkWriter();
        this.writtenLocation = null;
    }

    backupFile(backupDirectory: string, deleteFile = false) {
      const finalReadPath = replaceStringVariables(this.configurationContents.symlink);
      const finalPath = `${backupDirectory}/${this.configurationContents.fileName}`;
      console.log('Backup');
      console.log('Reading', finalReadPath);
      console.log('Writing', finalPath);
      if (this.fileReader.fileExists(finalReadPath)) {
        console.log('Backing up', finalPath, 'to', finalPath);
        this.fileWriter.writeEntireFileContents(finalPath, this.fileReader.readFileContents(finalReadPath));
        if (deleteFile) {
          this.fileWriter.deleteFile(finalReadPath);
        }
      }
    }

    createSymlink() {
      const finalPath = replaceStringVariables(this.configurationContents.symlink);
      if (!this.symlinkWriter.symlinkExists(finalPath)) {
        if (this.fileReader.fileExists(finalPath) && this.fileReader.isFile(finalPath)) {
          console.log('File exists in place. Deleting');
          this.fileWriter.deleteFile(finalPath);
        }
        this.symlinkWriter.createSymlink(this.writtenLocation, finalPath);
      } else {
        console.log('Symlink exists');
      }
    }

    writeConfig(fileLocation: string) {
        const fullFileLocation = `${fileLocation}/${this.configurationContents.fileName}`;
        let fullFileContents = '';
        const deliminator = this.configurationContents.deliminator ?? ' ';
        const lineCommentCharacter = this.configurationContents.lineCommentCharacter ?? '#';
        this.configurationContents.configValues.forEach((configValue) => {
          if (configValue.comment) {
            fullFileContents += `${lineCommentCharacter} ${configValue.comment}\n`;
          }
          if (configValue.key && configValue.value) {
            let delim = configValue.deliminator ?? deliminator;
            fullFileContents += `${configValue.key}${delim}${configValue.value}\n`;
          }
        });
        this.fileWriter.writeEntireFileContents(
            fullFileLocation,
            fullFileContents,
        );
        this.writtenLocation = fullFileLocation;
    }
}

export default ConfigurationManager;
