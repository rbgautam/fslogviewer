import fs from 'fs'
import chalk from 'chalk'
import readline from 'readline'

//Get File list fomr directory
let logDirPath = '\\\\iaai.com\\EnterpriseServices\\IAATow\\QA\\IAATowMobilityWebService\\';
//Pick the latest File

let prevFileName = '';//'Application_IAATow_MobilityService-636885977630999551.log'; 
let currFileName = '';
let prevFileLineCount = 0;
let currFileLineCount = 0;




const ReadDirlist = () =>{
    let fileList= [];
    fs.readdir(logDirPath, (err, files) => {
    files.forEach(file => {
        fileList.push(file);
    });
    currFileName = getNewestFile(fileList,logDirPath);
    DisplayLogContent();
    });
}

//Store latest file name and # of lines
function getNewestFile(files, path) {
    var out = [];
    files.forEach(function(file) {
        var stats = fs.statSync(path + "/" +file);
        if(stats.isFile()) {
            out.push({"file":file, "mtime": stats.mtime.getTime()});
        }
    });
    out.sort(function(a,b) {
        return b.mtime - a.mtime;
    })
    return (out.length>0) ? out[0].file : "";
}


const ReadFileLength = (filePath) =>{
    var i;
    var count = 0;
    fs.createReadStream(filePath)
    .on('data', function(chunk) {
        for (i=0; i < chunk.length; ++i)
        if (chunk[i] == 10) count++;
    })
    .on('end', function() {
       // console.log(count);
        currFileLineCount = count;
        //readLinesFromLog();
        ReadFileLines();
        return count;
    });

};


const DisplayLogContent = ()=>{
    console.log( chalk.bgCyan(`Log file: ${currFileName}`));
    //if Lastest file not same as the prevfileName then read whole file
    if(prevFileName !== currFileName){
        readFullLog();
    }else{
        //Else if Latestfilename equals prevFileName then  currcount - lastcount
        ReadFileLength(logDirPath+currFileName);
    }
    
};

const readFullLog = () => {
    fs.readFile(logDirPath+currFileName, function(err,data)
    {
        if(err)
            console.log(err)
        else
            console.log(chalk.greenBright(data.toString()));
    });
    prevFileName = currFileName;
};

const  readLinesFromLog = async ()=>{
    console.log(currFileLineCount);
    let linesToRead = currFileLineCount - prevFileLineCount;
    linesToRead = 10;
    console.log('Lines from log');
    
    const fileStream = fs.createReadStream(logDirPath+currFileName);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    //Note: we use the crlfDelay option to recognize all instances of CR LF
    //('\r\n') in input.txt as a single line break.
    let lineCount  = 0;
    rl.on('line', (line) => {
        lineCount++; 
        console.log( chalk.redBright(`${line}`));
        if(lineCount === linesToRead){
            rl.close();
            
        }
    
    });

    rl.on('close', function() {
        //console.log(wantedLines);
        process.exit(0)
    });

};

const ReadFileLines = ()=>{
    fs.readFile(logDirPath+currFileName, "utf8", (err, data) => {
        if(err){
            console.log(err);
        }else{
            data = data.split("\r\n"); // split the document into lines
            let linesToRead = 0;
            if (currFileLineCount != prevFileLineCount){
                linesToRead = currFileLineCount - prevFileLineCount;
                prevFileLineCount = currFileLineCount;
            }
            else 
                linesToRead = 20;
            //data.length = linesToRead;    // set the total number of lines to 10
            let lastLines = data.slice(-1*linesToRead); 
            //TODO: Read last # of lines
            console.log(data); //Array containing the lines to read
        }
      });
}


let timerCount = 0;
function intervalFunc() {
    timerCount++;
    ReadDirlist();
    // if (timerCount == '5') {
    //   clearInterval(this);
    // }
}

setInterval(intervalFunc, 2000);

