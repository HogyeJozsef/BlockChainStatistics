require('@babel/register');
const fs = require('fs');
const alchemy = require('./alchemy.js');
let { PythonShell } = require('python-shell');

var printData = true;
var pythonPath = ''; // C:\\Teljes\\Elérési\\Útvonal\\python.exe
var scriptPath = ''; // C:\\path\\to\\your\\python_script_directory

const contract = "0xF19308F923582A6f7c465e5CE7a9Dc1BEC6665B1";
var i = 0;
const dataToWrite = [];

async function AlchemyTransfer() {

    console.log('Adatok lekérése...')

    const data = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: contract,
        category: ["external"]
    });

    return data;
};

async function AlchemyTransferPage(pageKey) {

    if (pageKey !== undefined) {

        if (printData) {

            console.log('-----------------------------------------------')
            console.log("pageKey: " + pageKey)
        }

        const data = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            pageKey: pageKey,
            toAddress: contract,
            category: ["external"]
        });

        await UploadDataPage(data);

        return;
    }

    return;
}

console.log('Adatok lekérése a blokkláncról...')

async function UploadDataPage(result) {

    DataWrite(result, async function () {

        if (result['pageKey']) {

            let param;

            do {

                param = await AlchemyTransferPage(result['pageKey']);

            } while (param !== undefined);

            return;

        } else {

            RunPythonScript();

            return;
        }
    });
}

function RunPythonScript() {

    console.log('Adatok írása...')

    const arrayAsString = JSON.stringify(dataToWrite);

    fs.writeFileSync('TransactionDatas.txt', arrayAsString);

    console.log('Python szkript hívása...')

    const options = {
        mode: 'text',
        pythonPath: pythonPath,
        scriptPath: scriptPath,
        pythonOptions: ['-u'],
        args: []
    };

    PythonShell.run('test.py', options, function (err, results) {
        if (err) throw err;

        console.log('finished');
    });
}

async function DataWrite(result, callback) {

    for (const tx in result['transfers']) {

        i++;

        const transaction_item = {
            id: i,
            BlockHexadecimal: result['transfers'][tx]['blockNum'],
            BlockDecimal: parseInt(result['transfers'][tx]['blockNum'], 16),
            TransactionHash: result['transfers'][tx]['hash']
        };

        if (printData) {

            console.log(i, " T: ", result['transfers'][tx]['hash']);
        }

        dataToWrite.push(transaction_item);
    }

    callback();
}

function UploadData(result) {

    DataWrite(result, async function () {

        if (result['pageKey']) {

            await AlchemyTransferPage(result['pageKey']);

            return;

        } else {

            return;
        }

    });
}

AlchemyTransfer().then(async (result) => {

    console.log('Adatok feltöltése...');

    await UploadData(result);

}).catch(error => {
    console.error('Hiba:', error);
});

// npm install alchemy-sdk
// npm i python-shell
// https://docs.alchemy.com/reference/alchemy-getassettransfers