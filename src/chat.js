import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { stdin, stdout } from 'node:process';

let session = null;

const chatSession = () => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    session = ai.chats.create({
        model: process.env.GEMINI_MODEL,
        config: {
            temperature: 0.1,
            systemInstruction: "Kamu adalah asisten AI yang ramah dan membantu. Jawablah pertanyaan dengan santai, tetapi singkat, padat dan jelas.",
        },
        history: [
            {
                role: "user",
                parts: [{
                    text: "Halo"
                }]
            },
            {
                role: "model",
                parts: [{
                    text: "Halo! Bagaimana saya bisa membantu Anda hari ini?",
                }]
            }
        ]
    });

    return session;
}

stdin.setEncoding('utf8');
stdout.write("Selamat datang di program Gemini AI Chat\n");
stdout.write("Membuat percakapan\n");
session = chatSession();
stdout.write("Percakapan berhasil dibuat!\n");
stdout.write("Silakan masukkan pesan anda. Ketik 'exit' untuk keluar:\n");

stdin.on("data", async(chunk) => {
    const input = chunk.toString().trim();

    if( input === 'exit' || input === '' ) {
        if( input === '' ) {
            stdout.write("Anda tidak memasukkan pesan apapun!\n");
        }

        console.log("Keluar dari program.\n");
        process.exit();
    }

    if( input !== '' ) {
        stdout.write(`Pesan: ${input}\n`);
        stdout.write("Balasan: \n");

        if( ! session ) {
            stdout.write("Sesi chat tidak ditemukan!\n");
            process.exit();
        }

        const response = await session.sendMessageStream({
            message: input,
        });

        for await(const chunk of response) {
            stdout.write(chunk.text);
        }
        
        stdout.write("\n\n");
        stdout.write("Balas pesan:\n");
    }
});