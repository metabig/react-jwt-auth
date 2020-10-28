const url = "http://" + process.env.REACT_APP_HOST_API
    + ":" + process.env.REACT_APP_PORT_API
    + "/api/hbase/upload"

const data_table = {
    name: process.env.REACT_APP_DATA_TABLE,
    cf: process.env.REACT_APP_DATA_CF,
    col: process.env.REACT_APP_DATA_COL
}

const metadata_table = {
    name: process.env.REACT_APP_METADATA_TABLE,
    cf: process.env.REACT_APP_METADATA_CF,
    col: process.env.REACT_APP_METADATA_COL
}



const converter = require('base64-arraybuffer')

var success;

async function addToTable(table, key, value, validation) {

    const options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ table: table, key: key, value: value, validation: validation })
    }
    return fetch(url, options)
        .then((res) => success = res.ok)
}

function getKey(metadata, file) {
    return metadata["Data Source Name"] + "$" +
        metadata["Data Type"].split(" ")[0] + "$" +
        file.name + "$" +
        process.env.REACT_APP_VERSION + "$" +
        Date.now()
}


async function addValues(metadata, file, data) {
    return new Promise(async resolve => {
        const key = getKey(metadata, file)
        await addToTable(metadata_table, key, JSON.stringify(metadata), false)
        await addToTable(data_table, key, new TextEncoder("utf-8").encode(converter.encode(data)))
        resolve()
    })
}


async function getFileData(file) {
    return new Promise(resolve => {
        const reader = new FileReader()

        reader.onabort = () => console.error('file reading was aborted')
        reader.onerror = () => console.error('file reading has failed')
        reader.onload = () => {
            resolve(reader.result)
        }


        reader.readAsArrayBuffer(file)
    }
    );
}

async function iterateFiles(files, metadata) {
    return new Promise(async resolve => {
        for (const file of files) {
            metadata["filename"] = file.name
            await addValues(metadata, file, await getFileData(file))

        }
        resolve()
    })
}

export async function sendToServer(files, metadata) {
    return new Promise(async resolve => {
        await iterateFiles(files, metadata)
        resolve(success)
    })

}
