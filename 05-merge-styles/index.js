const fs = require('fs');
const path = require('path');

const createBundleCss = async (stylesPath, bundle) => {
    try {
        const writeStream = fs.createWriteStream(path.join(bundle), 'utf-8');
        const styles = await fs.promises.readdir(stylesPath, { withFileTypes: true });

        for (const style of styles) {
            if (style.isFile() && style.name.split('.')[1] === 'css') {
                const readStream = fs.createReadStream(path.join(stylesPath, style.name), 'utf-8');
                readStream.pipe(writeStream);
            }
        }

    } catch (e) {
        console.log(e);
    }
};

createBundleCss(path.join(__dirname, 'styles'), path.join(__dirname, 'project-dist', 'bundle.css'));
