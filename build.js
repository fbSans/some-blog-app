import { exec} from "child_process";
import path from "path";
import { argv, exit } from "process";

const source_folder = "./src";
const source = ["./server.mts", "./common.mts", "./router.mts", "./database.mjs"]
               .map((p) => { return path.join(source_folder, p);});

const tsc_path = path.join(".", "node_modules", ".bin", "tsc");

function compile_source(srcpath){
    console.log(`building ${srcpath}...`)
    const tsc = exec(`${tsc_path} ${srcpath} --outDir ./build`);

    tsc.on("close", (code) => {
        if(code != 0) {
            console.error(`${srcpath} failed with code ${code}`);
            return;
        }
        console.log(`${srcpath} was compilled successfully`);
    })
}


const user_args = argv.slice(2);
if(user_args.length > 0){
    const paths = user_args.map((p) => { return path.join(source_folder, p);});
    paths.forEach((v) => {
        if(!source.find((e) => e === v)){
            console.warn(`${v} not in sources`)
            return;
        } 
        compile_source(v);
    })
} else {
    source.forEach((srcpath) => {compile_source(srcpath)});
}






