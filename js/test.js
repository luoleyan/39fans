const fs = require('fs')
const path = require('path')

function progress(percent) {
    const count = Math.round(percent * 20)
    return '[' + new Array(count).fill(`\x1b[47m `).join('') +
        new Array(20 - count).fill(`\x1b[40m `).join('') + ']\n'
}

async function handle() {
    const arg = process.argv[2]
    const filePath = path.resolve(process.cwd(), arg)

    const ws = fs.createWriteStream(filePath + '.mp4')
    const rs = fs.createReadStream(filePath)

    console.log('writing...')
    let writed = 0
    rs.on('data', c => {
        /**
         * @type {ArrayBuffer}
         */
        const rawBuf = c.buffer
        ws.write(new Uint8Array(
            writed ? rawBuf : rawBuf.slice(2)
        ))

        writed += rawBuf.byteLength
    })

    rs.on('end', () => {
        console.log('done')
    })
}

handle()