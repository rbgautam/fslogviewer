import fs from 'fs'
import chalk from 'chalk'
//console.log('Hello fslogger');

//Get File list fomr directory
let logDirPath = '\\\\iaai.com\\EnterpriseServices\\IAATow\\QA\\IAATowMobilityWebService\\';
//Pick the latest File

let prevFileName = 'Application_IAATow_MobilityService-636885977630999551.log'; 
let currFileName = '';
let prevFileLineCount = 0;
let currFileLineCount = 0;

fs.readFileSync(logDirPath+prevFileName,'utf-8');

//const testFolder = './tests/';
let fileList= [];
fs.readdir(logDirPath, (err, files) => {
  files.forEach(file => {
     fileList.push(file);
  });
  currFileName = getNewestFile(fileList,logDirPath);
  currFileLineCount = ReadFileLength(logDirPath+currFileName);
  DisplayLogContent();
});

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
        console.log(count);
        return count;
    });

};


const DisplayLogContent = ()=>{
    console.log(currFileName);
    //if Lastest file not same as the prevfileName then read whole file
    if(prevFileName !== currFileName){
        readFullLog();
    }else{
        //Else if Latestfilename equals prevFileName then  currcount - lastcount
        readLinesFromLog();
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
};

const readLinesFromLog = ()=>{
    console.log('Lines from log');
};