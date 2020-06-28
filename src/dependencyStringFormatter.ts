import { PathLike } from 'fs';

export class DependencyStringFormatter {
    static extractRawDependencyVersion(dependencyVersion: string) {
        if (dependencyVersion.includes('^')) {
            return dependencyVersion.substr(1, dependencyVersion.length - 1);
        }
        if(dependencyVersion.includes('~')) {
            const specialCharFreeDependencyName = dependencyVersion.substr(1, dependencyVersion.length -1);

            console.log('special char free:' + specialCharFreeDependencyName);

            return specialCharFreeDependencyName;
        }
        return dependencyVersion;
    }

    static extractRawDependencyFileName(dependencyName: string) {
        if(dependencyName.includes('@')) {
            let atFreeDependencyName = dependencyName.substr(1, dependencyName.length -1);
            atFreeDependencyName = atFreeDependencyName.replace('/', '-');

            console.log('@free-dependency-name:' + atFreeDependencyName);

            return atFreeDependencyName;
        }

        return dependencyName;
    }

    static createNpmPackCommand(dependencyName: string, dependencyVersion: string) {
        return dependencyName + '@' + dependencyVersion;
    }

    static createNewFileName(currentDependencyName: string, currentDependencyVersion: string) {
        const rawVersion = DependencyStringFormatter.extractRawDependencyVersion(currentDependencyVersion);
        const rawFileName = DependencyStringFormatter.extractRawDependencyFileName(currentDependencyName);
        const fileName = rawFileName + '-' + rawVersion + '.tgz';

        return fileName;
    }

    static createFileNameInCurrentDir(fileName: string)  {
        const fileNameInCurrentPath = './' + fileName;
        return fileNameInCurrentPath;
    }

    static createFileNameInTargetDir(path: PathLike, fileName: string) {
        const fileNameInTargetPath = path.toString() + '/' + fileName;
        return fileNameInTargetPath;
    }
}
