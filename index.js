
import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from "fs";
import process from "process";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import cliMd from "cli-markdown";
console.clear();
const profile = fs.readFileSync("profile.json", "utf-8");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? '');
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `eres un asistente virtual que te ayudará a responder preguntas y a realizar tareas. 
algunos datos a tener en cuenta  ${JSON.stringify(profile)}`,

});
async function urlToGenerativePart(url, mimeType) {
    const arrayBuffer = await fetch(url).then((response) => response.arrayBuffer());
    return {
        inlineData: {
            data: Buffer.from(arrayBuffer).toString("base64"),
            mimeType,
        },
    };
}
async function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}
const chat = model.startChat();

let url = null
let image = null
process.stdin.on('data', async (data) => {
    const message = data.toString().trim();
    process.stdin.pause();
    if (message === '\u0010') {
        exec("npm run electron", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            const stdoutArr = stdout.toString().trim().split("\n")
            stdoutArr.forEach((line) => {
                try {
                    new URL(line)
                    url = line
                } catch {
                    url = null
                }
            });
            url && console.log("image: " + url);
            process.stdin.resume();
        })
        return
    }
    if (url) {
        if (url.toString().startsWith("file://")) {
            image = await fileToGenerativePart(fileURLToPath(url), "image/jpeg");
        } else {
            image = await urlToGenerativePart(url, "image/jpeg");
        }
    }
    const part = image ? [message, image] : message;
    chat.sendMessage(part).then((result) => {
        const response = result.response.text();
        console.log(cliMd(response));
        process.stdin.resume();
    });
})
