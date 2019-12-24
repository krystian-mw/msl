#!/usr/bin/env node
const path = require('path');
const fs = require('fs')
const http = require('http')

const schema = process.argv[2]
const dir = path.join(process.cwd(), process.argv[3] || './')
const file_path = path.join(dir, schema + '.model.js')

try {
    if (!schema) throw new Error('Schema name is not passed')
    if (!fs.existsSync(dir)) throw new Error(`${dir} does not exist`)
    // if (fs.existsSync(file_path)) throw new Error(`${file_path} already exists!`)
    console.log("\x1b[42m", (fs.existsSync(file_path) ? 'Updating' : 'Downloading'), "\x1b[0m")
    console.log("\x1b[36m", `${schema}`)
    console.log("\x1b[0m", 'Into')
    console.log("\x1b[36m", dir, "\x1b[0m", `\n\n`)

    function err (message) {
        console.log("\x1b[31m", 'Big Fat Fail', "\x1b[0m", 'becuase:', "\x1b[31m", message, "\x1b[0m")
    }

    const request = http.request({
        host: 'msl.mwebdesign.co.uk',
        port: 80,
        path: `/schema/${schema}`,
        headers: {
            'user-agent': 'mslcli'
        }
    }, res => {

        console.log('Getting data ...')

        if (res.statusCode >= 400) return err(`Server returned code: ${res.statusCode}`)

        fs.writeFileSync(file_path, '')

        res.on('data', chunk => {
            console.log('Writing data ...')
            fs.appendFileSync(file_path, chunk.toString())
        })

        res.on('end', () => {
            console.log('Finished!\n')
            console.log("\x1b[32m", 'Success', "\x1b[0m")
        })
    })
    
    request.end(() => {
        console.log(`Establishing connection ...`)
    })

    request.on('finish', () => {
        console.log(`Established connection ...`)
    })
    
    request.on('error', (e) => {
        throw new Error(e.message)
    })
} catch (e) {
    console.log("\x1b[31m", 'Big Fat Fail', "\x1b[0m", 'becuase:', "\x1b[31m", e.message, "\x1b[0m")
}
