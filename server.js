require('@babel/register');
const mysql = require('mysql');
const alchemy = require('./alchemy.js');

const contract = "0xF19308F923582A6f7c465e5CE7a9Dc1BEC6665B1";
const all_transactions = [];

let insert_transactions = "INSERT INTO transactions (BlockHexadecimal, BlockDecimal, TransactionHash) VALUES ?;";

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'titanx',
});

async function AlchemyTransfer() {

    const data = await alchemy.core
        .getAssetTransfers({
            fromBlock: "0x0",
            toBlock: "latest",
            withMetadata: false,
            excludeZeroValue: true,
            maxCount: "0x3e8",
            fromAddress: contract,
            category: ["internal"]
        });

    return data;
};

async function AlchemyTransferPage(pageKey) {

    if (pageKey !== undefined) {
        
        console.log('-------------')
        console.log("pageKey: " + pageKey)

        const data = await alchemy.core
            .getAssetTransfers({
                fromBlock: "0x0",
                toBlock: "latest",
                withMetadata: false,
                excludeZeroValue: true,
                maxCount: "0x3e8",
                pageKey: pageKey,
                fromAddress: contract,
                category: ["internal"]
            });

        await UploadDataPage(data);

    } 

    return;
}

function insertDatas(item, callback) {

    console.log('Csatlakozás az adatbázishoz...')

    db.connect((err) => {
        if (err) {
            callback(err);
        }
        console.log('Csatlakozva...');
    });

    console.log('Adatok beszúrása az adatbázisba...')

    db.query(insert_transactions, [all_transactions.map(item => [item.BlockHexadecimal, item.BlockDecimal, item.TransactionHash])], (err, rows) => {

        if (err) {
            callback(err);
        } else {
            console.log('Adatok beszúrása sikeresen megtörtént! Beszúrt sorok: ' + rows['affectedRows']);
            callback();
        }

    });
};

console.log('Adatok lekérése a blokkláncról...')

async function UploadDataPage(result) {

    for (const tx in result['transfers']) {

        const transaction_item = {
            BlockHexadecimal: result['transfers'][tx]['blockNum'],
            BlockDecimal: parseInt(result['transfers'][tx]['blockNum'], 16),
            TransactionHash: result['transfers'][tx]['hash']
        };

        all_transactions.push(transaction_item);
    }

    if (result['pageKey']) {

        let param;

        do {

            param = await AlchemyTransferPage(result['pageKey']);

        } while (param !== undefined) {
            AlchemyTransferPage(param)
        };

        /*insertDatas(all_transactions, function (err) {

            if (err) {
                console.log("Hiba: " + err)
            }

            process.exit(0);
        });*/

    } else {

        return;
    }
}

async function UploadData(result) {

    for (const tx in result['transfers']) {

        const transaction_item = {
            BlockHexadecimal: result['transfers'][tx]['blockNum'],
            BlockDecimal: parseInt(result['transfers'][tx]['blockNum'], 16),
            TransactionHash: result['transfers'][tx]['hash']
        };

        all_transactions.push(transaction_item);
    }

    if (result['pageKey']) {

        await AlchemyTransferPage(result['pageKey']);

        return;

    } else {

        return;
    }
}

AlchemyTransfer().then(result => {

    console.log('Adatok lekérése SIKERES, adatok feltöltése...')

    UploadData(result)

}).catch(error => {
    console.error('Hiba:', error);
});

//https://docs.alchemy.com/reference/alchemy-getassettransfers