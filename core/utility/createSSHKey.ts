import FSFileReader from './File/FSFileReader.ts';

export interface SSHKeyOptions {
  type: 'rsa' | 'rsa-pss' | 'dsa' | 'ec' | 'ed25519' | 'ed448' | 'x25519' | 'x448' | 'dh';
  keyLocation: string;
  bits?: number;
  comment?: string;
}

const createSSHKey = (options: SSHKeyOptions): string => {
  const bits = options.bits ?? 4096;

  Bun.spawnSync(
    [
      'ssh-keygen',
      '-t',
      options.type,
      '-f',
      options.keyLocation,
      '-N',
      ''
    ],
  );
  const fileReader = new FSFileReader();

  const publicKey = fileReader.readFileContents(options.keyLocation + '.pub');

  if (options.comment) {
    console.log('Generated key', options.comment);
    console.log(publicKey);
  }

  return publicKey;
};

export default createSSHKey;

