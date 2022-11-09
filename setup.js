import * as fs from 'fs'
import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import * as fse from 'fs-extra'

const rl = readline.createInterface({input, output})

async function main() {
    var srcDir = await rl.question(`Where do you want the script files to be located? (${process.cwd()}) `)
    if(srcDir === undefined || srcDir === process.cwd() || srcDir === '')srcDir = process.cwd()
    else {
    	console.log(srcDir)
      	try {
        	fse.copy(process.cwd(), srcDir)
      	}
      	catch(e){
        	console.log(e)
      	}
    }    
    var batchDir = await rl.question('Where do you want the batch file to be located? (C:\\Windows\\System32) ')
    if(batchDir !== undefined)batchDir = "C:/Windows/System32"
    fs.writeFileSync('./reddit-download.bat', `@echo off\nnode "${srcDir}\\index.js" %*`)
    fs.rename('./reddit-download.bat', `${batchDir}\\reddit-download.bat`, (err)=> {
    	if(err)throw err;
    })
    console.log('The installation is done, the installator will close now.')
    process.exit(0)
}

main()