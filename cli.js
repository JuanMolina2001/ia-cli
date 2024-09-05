import { GoogleGenerativeAI } from "@google/generative-ai"
import fs from "fs";
const profile = fs.readFileSync("profile.json", "utf-8");
const stdin = process.openStdin();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: `eres un asistente virtual que te ayudará a responder preguntas y a realizar tareas. 
algunos datos a tener en cuenta  ${JSON.stringify(profile)}`,

});

const chat = model.startChat();
stdin.addListener("data", function (d) {
    const data = d.toString().trim();
    chat.sendMessage(data).then((result) => {
        console.log(result.response.text());
    });
});


