#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
//arguments : command arguments
var arguments = process.argv.slice(2);
//command = arguments[1];
//directory_path = arguments[2]
let folder = {
    media: ["mkv", "mp4", "mp3"],
    archives: ["rar", "zip", "tar", "iso", "xz", "7z"],
    documents: ["docx", "doc", "pdf", "odt", "xls", "txt", "xlxs", "odp", "odf", "ps", "tex"],
    app_setups: ["exe", "pkg", "deb", "dmg"],
    code: ["cpp", "c", "java", "rust", "py", "js", "html", "css", "pascal","json"]
};
switch (arguments[0]){
    case '-help':
        help();
        break;
    case "-organize":
        organize(arguments[1]);
        break;
    case "-tree":
        tree(arguments[1]);
        break;
    default:
        console.log("Enter correct command");
        break;
}
function check(ext) {
    for (var t in folder) {
        let sub_f = folder[t];
        for (let i = 0; i < t.length; i++) {
            if (ext == sub_f[i]) {
                return t;
            } 
        }
    }
    return "miscellaneous";
}
function help() {
    console.log(`List of all commands:
    wacky -help : to show all commands
    wacky -organize : to organize the directory you specify through path
    wacky -tree : to display the tree structure of files of the specified directory
    `);
}
function organize(sp) {//sp == source_path
    if (sp == undefined) {
        sp = process.cwd();
    } 
    if(!fs.existsSync(sp)) {
        console.log("Kindly enter correct path");
        return;
    }
   
    var ofpath = path.join(sp, "organized");
    if (fs.existsSync(ofpath)) {
    }
    else {
        fs.mkdirSync(ofpath);
    }
    readdirectory(sp, ofpath);

}
function readdirectory(current_path, destination_path) {
    console.log("Transferring files...");
    var files = fs.readdirSync(current_path);
    for (let i = 0; i < files.length; i++) {
        if (path.extname(path.join(current_path, files[i])) != '') {
            var sub_folder = check(path.extname(path.join(current_path, files[i])).slice(1));
            var sfpath = path.join(destination_path, sub_folder);
            if (fs.existsSync(sfpath) == false) {
                fs.mkdirSync(sfpath);
            }
            let from = path.join(current_path, files[i]);
            let to = path.join(sfpath,files[i]);
            fs.copyFileSync(from, to);
            console.log(files[i] + " ---> " + sub_folder);
            fs.unlinkSync(from);
        } 
    }  
}
function tree(sp){
    if (sp == undefined) {
        sp = process.cwd();
    } 
    if(!path.isAbsolute(sp)) {
        console.log("Kindly enter correct path");
        return;
    }
    console.log("Dsiplaying tree...");
    var dir = path.basename(sp);
    console.log(dir);
    dfs(sp, "\t");
}
function dfs(start,indent) {
    var files = fs.readdirSync(start);
    for (let i = 0; i < files.length; i++) {
        stats = fs.statSync(path.join(start, files[i]));
        if(stats.isFile()){
            console.log(indent + "|----- " + files[i]);
        }
        else if(stats.isDirectory()){
            console.log(indent + "|_____ " + files[i]);
            dfs(path.join(start,files[i]), indent + '\t');
        }
        else {
            continue;
        }
    }
}
