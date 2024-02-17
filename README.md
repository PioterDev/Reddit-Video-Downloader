# Reddit-Video-Downloader
Lets you download videos directly from Reddit with a shell command.

# Requirements
- Node.js
- ffmpeg

# Setup
If you don't want to set up this permanently or don't have admin permission on your computer, run `node portable.js`. This will install a portable version, meaning you can only run it from the folder with the files.

But for comfort, I recommend installing the script on your computer. To do this, run `setup.bat` with administrator permissions. Be careful though, if you forget to run the setup with admin permissions and choose a system directory (like C:\Windows\System32), the script will not run correctly, but won't give an error (node.js/javascript magic I guess...).

# How it works
After you've installed it, open your console and type `reddit-download [link to the reddit post with video]`.

The script operates in the console's directory, not in the directory where script files are located, meaning if you're in `/path/to/dir/`, it will create `/path/to/dir/downloads/` folder if there isn't one.

Currently, only Windows is supported. I will add support for Linux and MacOS later.
