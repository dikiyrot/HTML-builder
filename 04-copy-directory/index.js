
const fs = require('fs');
const path = require('path');

const createCopyDir = async (curDir, nextDir) => {
    try {
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
    } catch (e) {
        console.log(e);
    }
};

createCopyDir(path.join(__dirname, 'files'), path.join(__dirname, 'files-copy'));


