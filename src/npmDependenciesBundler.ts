import fs, { PathLike } from 'fs';
import * as pathHelper from 'path';
import { exit } from 'process';

import { FileSystemOperations } from './fileSystemOperations';
import { LogicHelper } from './logicHelper';
import { NpmOperations } from './npmOperations';

export class NpmDependenciesBundler {
    private static package_json_name = 'package.json';
    private static dependencies_property_name = 'dependencies';
    private static dev_dependencies_property_name = 'devDependencies';
    private static node_modules_folder_name = 'node_modules';

    private absolutePathToTargetFolderDependencies: string = '';
    private absolutePathToTargetFolderDevDependencies: string = '';

    async prepareDownload(absolutePathToDependenciesFolder: string) {
        // DEBUGGING
        // console.log(absolutePathToDependenciesFolder);
        await FileSystemOperations.makeDirectoryIfNecessary(absolutePathToDependenciesFolder);

        this.absolutePathToTargetFolderDependencies = pathHelper.resolve(absolutePathToDependenciesFolder, '.\\' + NpmDependenciesBundler.dependencies_property_name);
        // DEBUGGING
        // console.log(absolutePathToTargetFolderOne);
        await FileSystemOperations.makeDirectoryIfNecessary(this.absolutePathToTargetFolderDependencies);


        this.absolutePathToTargetFolderDevDependencies = pathHelper.resolve(absolutePathToDependenciesFolder, '.\\' + NpmDependenciesBundler.dev_dependencies_property_name);
        // DEBUGGING
        // console.log(absolutePathToTargetFolderTwo);
        await FileSystemOperations.makeDirectoryIfNecessary(this.absolutePathToTargetFolderDevDependencies);


    }

    private get currentDir() {
        const currentDir = '.';
        return currentDir;
    }

    private get targetDir() {
        const targetDir = 'ng-test-project';
        return targetDir;
    }

    private get pathDevDependencies(): PathLike {
        const pathDevDependencies: PathLike = this.currentDir + '/../' + NpmDependenciesBundler.dev_dependencies_property_name;
        return pathDevDependencies;
    }

    private get pathDependencies() {
        const pathDependencies: PathLike = this.currentDir + '/../' + NpmDependenciesBundler.dependencies_property_name;
        return pathDependencies;
    }

    private dependencies: { [key: string]: string } = {};

    private devDependencies: { [key: string]: string } = {};

    async download(absolutePathCurrentDir: string) {
        return new Promise<any>((resolve: (value?: any) => void) => {
            const pathToJsonFile = absolutePathCurrentDir + '/' + NpmDependenciesBundler.package_json_name;

            // DEBUGGING
            console.log(pathToJsonFile);

            const absolutePathToJsonFile = pathHelper.resolve(pathToJsonFile);

            // DEBUGGING
            console.log(absolutePathToJsonFile);


            const registry = 'https://registry.npmjs.org/';
            // const prefix = pathHelper.resolve('./../' + NpmDependenciesBundler.dependencies_property_name);
            const prepareDownloadFolderPromise = NpmOperations.load(registry, absolutePathCurrentDir); //.then(() => {

            // console.log('pathDepencency:' + this.pathDependencies);

            // const mkdirFirstPromise = FileSystemOperations.makeDirectoryIfNecessary(this.pathDependencies);
            // mkdirFirstPromise.then(() => {

            //     // DEBUGGING
            //     console.log('devPaht:' + this.pathDevDependencies);

            //     const mkdirSecondPromise = FileSystemOperations.makeDirectoryIfNecessary(this.pathDevDependencies);
            //     mkdirSecondPromise.then(() => {
            // https://stackoverflow.com/questions/10011011/using-node-js-how-do-i-read-a-json-file-into-server-memory
            // const pathToJsonFile = this.currentDir + '/../' + this.targetDir + '/' + NpmDependenciesBundler.package_json_name;

            prepareDownloadFolderPromise.then(()=>{
                fs.readFile(absolutePathToJsonFile, 'utf8', (err, data) => {
                    if (err) { throw err };
                    const obj = JSON.parse(data);
                    this.dependencies = obj[NpmDependenciesBundler.dependencies_property_name];
                    this.devDependencies = obj[NpmDependenciesBundler.dev_dependencies_property_name];

                    LogicHelper.executeSeveralPack(this.absolutePathToTargetFolderDependencies, this.dependencies).then(() => {
                        LogicHelper.executeSeveralPack(this.absolutePathToTargetFolderDevDependencies, this.devDependencies).then(() => {

                            resolve();

                        });
                    });
                });
            });
            prepareDownloadFolderPromise.catch((err: any) => {
                console.error(err);
            });
        });
        //             mkdirSecondPromise.catch(() => {
        //                 console.error('mkdir second failed');
        //             });
        //         });
        //         mkdirFirstPromise.catch(() => {
        //             console.error('mkdkir fist failed');
        //         });
        //     });
        // });
        //     });
        // });
    }

    async prepareInstall() {
        return Promise.resolve();
    }

    async install() {
        return new Promise<any>((resolve: (value?: any) => void) => {
            const node_modules_in_target_dir: PathLike = this.currentDir + '/../' + this.targetDir + '/' + NpmDependenciesBundler.node_modules_folder_name;

            console.log('remove node modules in:' + node_modules_in_target_dir);
            LogicHelper.removeNodeModules(node_modules_in_target_dir).then(() => {
                // DEBUGGING
                console.log('node_modules removed');

                const absolutePathToTargetDir = pathHelper.resolve('./../ng-test-project');

                NpmOperations.setTargetPath(absolutePathToTargetDir);
                NpmOperations.printConfig();

                // DEBUGGING
                console.log('installing dependencies');
                LogicHelper.executeSeveralInstall(this.pathDevDependencies, this.devDependencies).then(() => {
                    // DEBUGGING
                    console.log('dependencies have just been installed');


                    // DEBUGGING
                    console.log('installing dev-dependencies');
                    LogicHelper.executeSeveralInstall(this.pathDependencies, this.dependencies).then(() => {
                        // DEBUGGING
                        console.log('dev-dependencies have just been installed');

                        resolve();
                    });
                });
            });
        });
    }

    async performBoth() {
        // await this.prepareDownload();
        // await this.download();
        // await this.prepareInstall();
        // await this.install();
        exit();
    }
}
