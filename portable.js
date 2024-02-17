import * as fs from 'fs'

async function main() {
    console.log(`Running in portable mode now...`)

    let ffmpegCheck = fs.existsSync(`./ffmpeg.exe`)
    if(!ffmpegCheck){
        console.log(`Please download ffmpeg first.`)
    }
    var stream = fs.createWriteStream(`./reddit-download.bat`)
    stream.once('open', (fd)=> {
    	stream.write(`@echo off\nnode index.js %*`)
    	stream.end()
    })

    console.log(`The script is ready to use, you can now run the command from the terminal.`)
    process.exit(0)
}

main()
