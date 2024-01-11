import mainConfig from '../config/main.json';
import ConfigurationManager from './utility/Configuration/ConfigurationManager.ts';
import DirectoryManager from './utility/File/DirectoryManager.ts';
import GitManager from './utility/Git/GitManager.ts';
import replaceStringVariables from './utility/replaceStringVariables.ts';
import FSFileReader from './utility/File/FSFileReader.ts';
import FSDirectoryWriter from './utility/File/FSDirectoryWriter.ts';
import FSDirectoryReader from './utility/File/FSDirectoryReader.ts';
import FSSymlinkWriter from './utility/File/FSSymlinkWriter.ts';
import createSSHKey from './utility/createSSHKey.ts';

const actions = {
  backup: process.env.ACTION_BACKUP === 'true',
  write: process.env.ACTION_WRITE === 'true',
  symlink: process.env.ACTION_SYMLINK === 'true',
  directory: process.env.ACTION_DIR === 'true',
  file: process.env.ACTION_FILE === 'true',
  git: process.env.ACTION_GIT === 'true',
};

const tempDirectory = replaceStringVariables(mainConfig.tempDirectory.location);
const cacheDirectory = replaceStringVariables(mainConfig.cacheDirectory);
const backupDirectory = replaceStringVariables(mainConfig.backupDirectory);

const directoryReader = new FSDirectoryReader();
const directoryWriter = new FSDirectoryWriter();

let shouldCreateTempDirectory = true;
if (directoryReader.directoryExists(tempDirectory)) {
  console.log('Temp Directory', tempDirectory, 'exists');
  if (mainConfig.tempDirectory.deleteIfExists) {
    console.log('Deleting');
    directoryWriter.deleteDirectory(tempDirectory);
  } else {
    shouldCreateTempDirectory = false;
  }
}
if (shouldCreateTempDirectory) {
  console.log('Creating Temp Directory', tempDirectory);
  directoryWriter.createDirectory(tempDirectory);
}

if (!directoryReader.directoryExists(cacheDirectory)) {
  directoryWriter.createDirectory(cacheDirectory);
}

if (actions.backup && !directoryReader.directoryExists(backupDirectory)) {
  directoryWriter.createDirectory(backupDirectory);
}

const fileReader = new FSFileReader();

// Create and link directories
if (actions.directory) {
  mainConfig.directories.forEach((directory) => {
    const directoryManager = new DirectoryManager(directory);
    if (actions.write) {
      console.log('Writing directory', directory.name);
      directoryManager.writeDirectory(cacheDirectory);
    }
    if (actions.symlink) {
      directoryManager.createSymlink();
    }
  });
}

// Create gits 
if (actions.git) {
  mainConfig.git.repos.forEach((gitRepo) => {
    const gitManager = new GitManager(gitRepo);
    if (actions.write) {
      console.log('Writing git', gitRepo.repo);
      gitManager.writeGit(cacheDirectory);
    }
  });
}

// Create and link dotfiles
if (actions.file) {
  mainConfig.dotfiles.forEach((dotfile) => {
    console.log('Processing dotfile', dotfile);
    const configurationContents = require(`../config/${dotfile}`);
    const configurationManager = new ConfigurationManager(configurationContents);
    if (actions.backup) {
      configurationManager.backupFile(backupDirectory, actions.symlink && actions.write);
    }
    if (actions.write) {
      console.log('Writing dotfile', dotfile, 'to cache directory');
      configurationManager.writeConfig(cacheDirectory);
    }
    if (actions.symlink) {
      console.log('Symlinking dotfile', dotfile, 'to destination directory');
      configurationManager.createSymlink();
    }
  });
}

// Create and write keys
if (actions.write) {
  Object.keys(mainConfig.keys).forEach((keyName) => {
    const finalPath = `${cacheDirectory}/${mainConfig.keys[keyName].private}`;
    if (!fileReader.fileExists(finalPath)) {
      createSSHKey({
        type: mainConfig.keys[keyName].type,
        keyLocation: finalPath,
        comment: keyName,
      });
    }
  });
}

// Symlink files
if (actions.symlink && (actions.file || actions.directory || actions.git)) {
  const symlinkWriter = new FSSymlinkWriter();
  mainConfig.symlinks.forEach((symlink) => {
    const finalPath = replaceStringVariables(symlink.destination);
    const finalSource = `${cacheDirectory}/${symlink.source}`
    if (!symlinkWriter.symlinkExists(finalPath)) {
      console.log('Creating symlink', finalPath, '->', finalSource);
      symlinkWriter.createSymlink(finalSource, finalPath);
    }
  });
}

// Clean up
if (mainConfig.tempDirectory.deleteOnFinish) {
  console.log('Deleting Temp Directory', tempDirectory);
  directoryWriter.deleteDirectory(tempDirectory);
} else {
  console.log('Not Deleting Temp Directory', tempDirectory);
}
