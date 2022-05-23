const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const componentsHtml = path.join(__dirname, 'components');
const templateHtml = path.join(__dirname, 'template.html');
const projectDistHtml = path.join(__dirname, 'project-dist', 'index.html');
const projectDistCss = path.join(__dirname, 'project-dist', 'style.css');
const stylesCss = path.join(__dirname, 'styles');
const projectDistAssets = path.join(__dirname, 'project-dist', 'assets');
const assets = path.join(__dirname, 'assets');

const createBundleHtml = async (template, components, bundle) => {
    let templatesData = {};
    const files = await fs.promises.readdir(components, { withFileTypes: true });

    for (const file of files) {
        const [fileName, filePermission] = file.name.split('.');
        if (file.isFile() && filePermission === 'html') {
            const readStream = fs.createReadStream(path.join(components, file.name), 'utf8');
            readStream.on('data', (chunk) => {
                templatesData[fileName] = templatesData[fileName]
                    ? templatesData[fileName] += chunk
                    : chunk;
            });
        }
    }

    let data = await fs.promises.readFile(template, 'utf8');
    for (let part in templatesData) {
        data = data.replace(`{{${part}}}`, templatesData[part]);
    }

    const writeStream = fs.createWriteStream(bundle);
    writeStream.write(data);
}

const createBundleCss = async (stylesPath, bundle) => {
    const writeStream = fs.createWriteStream(path.join(bundle), 'utf-8');
    const styles = await fs.promises.readdir(stylesPath, { withFileTypes: true });

    for (const style of styles) {
        if (style.isFile() && style.name.split('.')[1] === 'css') {
            const readStream = fs.createReadStream(path.join(stylesPath, style.name), 'utf-8');
            readStream.pipe(writeStream);
        }
    }
}

const createCopyDir = async (curDir, nextDir) => {
    await fs.promises.rm(nextDir, { recursive: true, force: true });
    await fs.promises.mkdir(nextDir, { recursive: true });

    const files = await fs.promises.readdir(curDir, { withFileTypes: true });

    for (const file of files) {
        if (file.isFile()) {
            await fs.promises.copyFile(path.join(curDir, file.name), path.join(nextDir, file.name));
        } else {
            await createCopyDir(path.join(curDir, file.name), path.join(nextDir, file.name));
        }
    }
}

const buildProject = async () => {
    try {
        await fs.promises.rm(projectDist, { recursive: true, force: true });
        await fs.promises.mkdir(projectDist, { recursive: true });

        await createBundleHtml(templateHtml, componentsHtml, projectDistHtml);
        await createBundleCss(stylesCss, projectDistCss);
        await createCopyDir(assets, projectDistAssets);
    } catch (e) {
        console.log(e);
    }
}

buildProject();
