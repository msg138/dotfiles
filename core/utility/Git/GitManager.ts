import DirectoryReader from '../File/DirectoryReader.ts';
import FSDirectoryReader from '../File/FSDirectoryReader.ts';

export interface GitConfiguration {
  repo: string;
  // Location will always be within cache directory
  location: string;
  repoFolder?: string;
  // Whether to be flat or not.
  flat?: boolean;
}

class GitManager {
  private directoryReader: DirectoryReader;

  constructor(private gitConfiguration: GitConfiguration) {
    this.directoryReader = new FSDirectoryReader();
  }

  writeGit(directory: string, update = false, flat = false) {
    let workingDirectory = `${directory}/${this.gitConfiguration.location}`;
    console.log('Git wd:', workingDirectory);
    let finalDirectory = workingDirectory;
    if (this.gitConfiguration.repoFolder) {
      finalDirectory += `/${this.gitConfiguration.repoFolder}`;
    }
    if (this.directoryReader.directoryExists(finalDirectory)) {
      console.log('Git directory already exists', finalDirectory);
      if (update) {
        console.log('Pulling changes');
        Bun.spawnSync(
          ['git', 'pull'],
          {
            cwd: finalDirectory,
          },
        );
      }
    } else {
      console.log('Cloning into', finalDirectory);
      Bun.spawnSync(
        [
          'git',
          'clone',
          ...(this.gitConfiguration.flat ? [this.gitConfiguration.repo, '.'] : [this.gitConfiguration.repo])
        ],
        {
          cwd: workingDirectory,
        },
      );
    }
  }
}

export default GitManager;
