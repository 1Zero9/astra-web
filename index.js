#!/usr/bin/env node
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const readline = require('readline');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateContent(prompt) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function chat() {
  try {
    while (true) {
      const prompt = await new Promise(resolve => {
        rl.question('\n🤖 Enter your prompt (or "exit" to quit): ', resolve);
      });

      if (prompt.toLowerCase() === 'exit') {
        console.log('👋 Goodbye!');
        rl.close();
        break;
      }

      console.log('📝 Response:', await generateContent(prompt));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    rl.close();
  }
}

chat();