const fs = require('fs');
const path = require('path');

const getFileStats =  async (pathFiles) => {
    try {
        const data = await fs.promises.readdir(pathFiles, { withFileTypes: true });

        for (const item of data) {
            const stats = await fs.promises.stat(path.join(pathFiles, item.name));

            if (stats.isFile()) {
                const [itemName, itemPermission] = item.name.split('.');
                const itemSize = (stats.size / 1024).toFixed(3);
                console.log(`${itemName} - ${itemPermission} - ${itemSize}kb`);
            }
        }
    } catch (err) {
        console.log(err);
    }
}

getFileStats(path.join(__dirname, 'secret-folder'));