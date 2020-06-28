import { PathLike } from 'fs';
import npm, { commands, load } from 'npm';

import { DependencyStringFormatter } from './dependencyStringFormatter';

export class NpmOperations {
  static callPatch(currentDependencyName: string, currentDependencyVersion: string, path: PathLike, /*path: PathLike, dependencyName: string, dependencyVersion: string, packCallback: (patchError?: Error, patchResult?: any, patchResultTwo?: any, patchResultThree?: any, patchResultFour?: any) => void*/) {
    return new Promise((resolve: (value?: any) => void) => {
      // https://stackoverflow.com/questions/38032047/how-to-execute-npm-run-command-programmatically
      const packCallback: (patchError?: Error, patchResult?: any, patchResultTwo?: any, patchResultThree?: any, patchResultFour?: any) => void = (patchError?: Error, patchResult?: any, patchResultTwo?: any, patchResultThree?: any, patchResultFour?: any) => {
        if (patchError) {
          console.error('error');
          resolve();
          return;
        }

        console.log('success');
        resolve();
      };

      // DEBUGGING
      console.log('current npm pack command:');
      console.log(DependencyStringFormatter.createNpmPackCommand(currentDependencyName, currentDependencyVersion));
      commands.pack([DependencyStringFormatter.createNpmPackCommand(currentDependencyName, currentDependencyVersion)], packCallback);
    });
  }

  static load(registry: string = 'https://registry.npmjs.org/', prefix: string = ''): Promise<any> {
    return new Promise((resolve: (value?: any) => void) => {
      const configOptions = {
        registry: registry,
        prefix: prefix,
        loglevel: 'silent'
      };
      const npmLoadCallback = () => {
        npm.prefix = prefix;
        console.log('set prefix again:' + prefix);
        resolve();
      };

      // DEBUGGING
      console.log(JSON.stringify(configOptions, null, 4));

      load(configOptions, npmLoadCallback);
    });
  }

  static callInstall(absoluteFileName: string) {
    return new Promise((resolve: (value?: any) => void) => {
      const installCallback = (installError?: Error) => {
        if (installError) {
          console.error(installError);
          resolve();
          return;
        }

        resolve();
      };
      commands.install([absoluteFileName], installCallback);
    });
  }

  static printConfig() {
    console.log(JSON.stringify(npm.prefix, null, 4));
  }

  static setTargetPath(targetPath: string) {
    // DEBUGGING:
    console.log('setting target path:' + targetPath);

    npm.prefix = targetPath;
  }
}
