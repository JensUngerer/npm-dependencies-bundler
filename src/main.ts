import path from 'path';
import { argv, exit } from 'process';
import { NpmDependenciesBundler } from './npmDependenciesBundler';
import { Logger } from './app/common/logger';

if (!argv || argv.length < 4) {
  Logger.log('Usage:');
  // console.error('Usage:');
} else {
  const npmDependencyBundler = new NpmDependenciesBundler();

  const absolutePathToExecutable = argv[1];
  const command = argv[2];
  const relativePathToDependenciesFolder = '.\\.' + argv[3];
  const currentDirRelativePath = '.\\..\\..\\';
  // DEBUGGING
  // console.log(relativePathToDependenciesFolder);

  const prepareDownload = async () => {
    const absolutePathToDependencies = path.resolve(absolutePathToExecutable, relativePathToDependenciesFolder);
    await npmDependencyBundler.prepareDownload(absolutePathToDependencies);
  };

  const download = async () => {
    const currentDirAbsolutePath = path.resolve(absolutePathToExecutable, currentDirRelativePath);
    await npmDependencyBundler.download(currentDirAbsolutePath);
  };

  const prepareInstall = async () => {

  };

  const install = async () => {

  };

  const startCommand = async (cliCommand: string) => {
    switch (cliCommand) {
      case 'download': {
        await prepareDownload();
        await download();
        break;
      }
      case 'install': {
        await prepareInstall();
        await install();
        break;
      }
      default: {
        break;
      }
    }
  };

  startCommand(command);

  exit();
}
