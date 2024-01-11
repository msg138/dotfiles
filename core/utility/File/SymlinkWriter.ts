abstract class SymlinkWriter {
  abstract isSymlink(path: string): boolean;
  abstract symlinkExists(path: string): boolean;
  abstract createSymlink(source: string, destination: string): void;
}

export default SymlinkWriter;

