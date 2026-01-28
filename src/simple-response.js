import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { stdin, stdout } from 'node:process';

const simpleGenerateContent = async(content) => {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });

    const response = await ai.models.generateContent({
        contents: content,
        model: process.env.GEMINI_MODEL,
        config: {
            temperature: 0.1,
        }
    });

    return response;
}

stdin.setEncoding('utf8');
stdout.write("Selamat datang di program Gemini AI Simple Response\n");
stdout.write("Silakan masukkan prompt anda. Ketik 'exit' untuk keluar:\n");

stdin.on("data", async (chunk) => {
    const input = chunk.toString().trim();

    if( input === 'exit' || input === '' ) {
        if( input === '' ) {
            stdout.write("Anda tidak memasukkan prompt\n");
        }

        console.log("Keluar dari program.\n");
        process.exit();
    }

    if( input !== '' ) {
        stdout.write(`Prompt: ${input}\n`);
        const response = await simpleGenerateContent(input);

        stdout.write("Memproses permintaan anda, mohon tunggu...\n");
        stdout.write("Jawaban: \n");
        console.log(response.text);
        stdout.write("\n");
        stdout.write(`Token yang digunakan: ${response.usageMetadata.totalTokens}\n`);
        stdout.write("Silakan masukkan prompt anda. Ketik 'exit' untuk keluar:\n");
    }
});