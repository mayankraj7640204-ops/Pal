import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // load from project root
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function run() {
  // wait, the google/generative-ai SDK doesn't have a listModels method publicly in all versions.
  // let's try fetch directly.
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
  const data = await response.json();
  console.log(data.models.map(m => m.name).join('\n'));
}
run();
