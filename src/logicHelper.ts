import { PathLike } from 'fs';

import { DependencyStringFormatter } from './dependencyStringFormatter';
import { FileSystemOperations } from './fileSystemOperations';
import { NpmOperations } from './npmOperations';

export class LogicHelper {
    static executeServalDependencies(dependencies: { [key: string]: string }, callback: (currentDependencyName: string, currentDependencyVersion: string) => Promise<any>) {
        return new Promise((resolve: (value?: any) => void) => {
            const dependencyNamesArr = Object.keys(dependencies);
            let dependenciesIndex = 0;
            const callbackLoop = () => {
                if (dependenciesIndex >= dependencyNamesArr.length) {
                    //exit();
                    resolve();
                    return;
                }

                const currentDependencyName = dependencyNamesArr[dependenciesIndex];
                const currentDependencyVersion = dependencies[currentDependencyName];
                const promise = callback(currentDependencyName, currentDependencyVersion);

                promise.then(() => {
                    console.log('then:' + dependenciesIndex);
                    dependenciesIndex++;
                    callbackLoop();
                });
                promise.catch(() => {
                    console.log('catch:' + dependenciesIndex);
                    dependenciesIndex++;
                    callbackLoop();
                });
            };
            // initial call
            callbackLoop();
        });
    }

    static executeSeveralPack(targetPath: PathLike, dependencies: { [key: string]: string }) {
        // DEBUGGING:
        console.log(targetPath);

        const theCallback = (currentDependencyName: string, currentDependencyVersion: string) => {
            return new Promise((resolve: (value?: any) => void) => {
                const packPromise = NpmOperations.callPatch(currentDependencyName, currentDependencyVersion, targetPath);
                packPromise.then(() => {
                    const fileNameSearch = DependencyStringFormatter.extractRawDependencyFileName(currentDependencyName);
                    const realFileNamePromise = FileSystemOperations.move(fileNameSearch, targetPath);
                    realFileNamePromise.then(resolve);
                });
            });
        }
        return LogicHelper.executeServalDependencies(dependencies, theCallback);
    }

    static executeSeveralInstall(path: PathLike, dependencies: { [key: string]: string }) {
        return new Promise((resolve: (value?: any) => void) => {
            const fileListPromise = FileSystemOperations.getFileList(path);
            fileListPromise.then((fileListObj) => {
                const installCallback = (dependencyPath: string, emptyString: string) => {
                    // DEBUGGING
                    console.log(dependencyPath);

                    const installPromise = NpmOperations.callInstall(dependencyPath);
                    return installPromise;
                };
                LogicHelper.executeServalDependencies(fileListObj, installCallback).then(resolve);
            });
        });
    }

    static removeNodeModules(path: PathLike) {
        const removeNpmModulesPromise = FileSystemOperations.removeNpmModules(path);
        return removeNpmModulesPromise;
    }
}
