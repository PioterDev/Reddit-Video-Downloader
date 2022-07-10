import * as fs from 'fs'
import * as fetch from 'node-fetch'
import * as https from 'https'
import * as child from 'child_process'

let arg = process.argv.slice(2)[0]
if(!arg){
    console.log(`Make sure you provided a link.`)
    process.exit(0)
}

let url = `${arg}.json`

async function main(){
    if(!url.startsWith('https://www.reddit')){
        console.log(`This is not a link to a Reddit post.`)
        return process.exit(1)
    }
    const fetchPost = async (url) => {
        const res = await fetch.default(url)
        const data = await res.json()
        return data[0].data.children
    }
    try {
        var post = await fetchPost(url)
    }
    catch(e){
        console.log(e)
    }
    let data = post[0].data
    let id = data.url.slice(18)
    let baseUrl = `https://v.redd.it/${id}/DASH`
    var videoHeight = data.secure_media.reddit_video.height
    let heightCheck1 = data.secure_media.reddit_video.fallback_url.slice(37)
    function getResolution(input){
        let array = input.split('')
        let dotIndex = array.findIndex((x)=> x === ".")
        return input.slice(0,dotIndex)
    }
    heightCheck1 = getResolution(heightCheck1)
    let heightCheck = (heightCheck1 == videoHeight.toString() ? videoHeight : Number(heightCheck1))
    let videoUrl = `${baseUrl}_${heightCheck}.mp4`
    let audioUrl = `${baseUrl}_audio.mp4`
    try {
        let dir = fs.readdirSync('./downloads')
    }
    catch(e){
        console.log(`No downloads directory, creating one in current directory...`)
        fs.mkdirSync('./downloads')
    }
    https.get(videoUrl, (res)=> {
        const video = fs.createWriteStream("./downloads/video.mp4")
        res.pipe(video)
        video.on('finish', ()=> {
            video.close()
            console.log('Finished downloading video')
            https.get(audioUrl, (res)=> {
                const audio = fs.createWriteStream("./downloads/audio.mp3")
                res.pipe(audio)
                audio.on('finish', ()=> {
                    audio.close()
                    console.log("Finished downloading video")
                    const args = `-y -i "./downloads/video.mp4" -i "./downloads/audio.mp3" -c:v copy -c:a aac "./downloads/${id}.mp4"`.split(' ')
                    const ffmpeg = child.spawn("ffmpeg", args, {shell: true})
                    ffmpeg.stdout.on('data', (data)=> console.log(data.toString()))
                    ffmpeg.stderr.on('data', data => console.log(data.toString()))
                    ffmpeg.on('exit', (code, signal)=> {
                        try {
                            fs.unlinkSync(`${process.cwd()}/downloads/video.mp4`)
                            fs.unlinkSync(`${process.cwd()}/downloads/audio.mp3`)
                        }
                        catch(e){
                            console.log(e)
                            process.exit(1)
                        }
                    })
                })
            })
        })
    })
}
main()
