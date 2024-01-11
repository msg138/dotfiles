import fs from 'node:fs';
import SymlinkWriter from './SymlinkWriter';

class FSSymlinkWriter extends SymlinkWriter {
  isSymlink(path: string) {
    const fileStats = fs.lstatSync(path);
    return fileStats.isSymbolicLink();
  }

  symlinkExists(path: string) {
    return fs.existsSync(path) && this.isSymlink(path);
  }

  createSymlink(source: string, destination: string) {
    fs.symlinkSync(source, destination);
  }
}

export default FSSymlinkWriter;

