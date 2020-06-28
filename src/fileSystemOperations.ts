import fs, { mkdir, NoParamCallback, PathLike, rename, Stats } from 'fs';
import path, { resolve } from 'path';
import rimraf from 'rimraf';

export class FileSystemOperations {
    // create output-folders (if necessary)
    // https://stackoverflow.com/questions/35733684/how-to-create-a-tmp-dir-in-node-without-collisions
    static makeDirectoryIfNecessary(path: PathLike) {
        return new Promise((resolve: (resolveValue?: any) => void, reject: (rejectValue?: any) => void) => {
            fs.stat(path, (outerError: NodeJS.ErrnoException | null, stats: Stats) => {
                if (outerError) {
                    const mkdirCallback: NoParamCallback = (innerError: NodeJS.ErrnoException | null) => {
                        if (innerError) {
                            reject();
                            throw innerError;
                        }
                        resolve();
                    };
                    mkdir(path, mkdirCallback);
                } else {
                    resolve();
                }
            });
        });
    }

    static rename(fileNameInCurrentPath: string, fileNameInTargetPath: string) {
        return new Promise((resolve: (value?: any) => void, reject: (value?: any) => void) => {
            const renameCallback = (renameError: any) => {
                if (renameError) {
                    console.error(renameError);
                    reject(renameError);
                    return;
                }
                resolve();
            };

            rename(fileNameInCurrentPath, fileNameInTargetPath, renameCallback);
        });
    }

    static removeNpmModules(path: PathLike) {
        return new Promise((resolve: (value?: any) => void, reject: (value?: any) => void) => {
            rimraf(path.toString(), (error: Error) => {
                if (error) {
                    console.error(error);
                    reject();
                    return;
                }
                resolve();
            });
        });
    }

    static async getFileList(path: PathLike): Promise<{[key:string]: string}> {
        const absoluteDependenciesDirPath = resolve(path.toString());

        // DEBUGGING
        console.log(absoluteDependenciesDirPath);

        try {
            const pathOfFilesMap:{[key:string]: string} = {};
            const files = await fs.promises.readdir(absoluteDependenciesDirPath);
            for (const file of files) {
                const oneRelativePath = path.toLocaleString() + '/' + file;
                pathOfFilesMap[oneRelativePath] = '';
            } // End for...of
            return pathOfFilesMap;
        } catch(e) {
            console.error(e);
            return {};
        }
    }

    static async move(fileNameSearch: string, targetDir: PathLike) {
        const moveFrom = "./";
        const moveTo = targetDir.toString();
        // https://stackoverflow.com/questions/32511789/looping-through-files-in-a-folder-node-js
        try {
            // Get the files as an array
            const files = await fs.promises.readdir(moveFrom);

            // Loop them all with the new for...of
            for (const file of files) {
                // Get the full paths
                const fromPath = path.join(moveFrom, file);
                const toPath = path.join(moveTo, file);

                // Stat the file to see if we have a file or dir
                const stat = await fs.promises.stat(fromPath);

                if (stat.isFile() && file.includes(fileNameSearch)) {
                    console.log("'%s' is a file.", fromPath);

                    // Now move async
                    await fs.promises.rename(fromPath, toPath);

                    // Log because we're crazy
                    console.log("Moved '%s'->'%s'", fromPath, toPath);
                }
            } // End for...of
        }
        catch (e) {
            console.error("We've thrown! Whoops!", e);
        }
    }
}
