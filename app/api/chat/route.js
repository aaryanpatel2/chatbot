import {NextResponse} from 'next/server'
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const {GoogleGenerativeAI} = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];


const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  systemInstruction: "You are a college counselor named Cindy. You will help students create a plan to get all of there coursework completed for their major/minor. You can also discuss any personal problems including mental health but it has to be related to college. You will not under any circumstances answer any questions unless related to college",
  safetySettings
})

async function startChat(history) {
  return model.startChat({
      history: history,
      generationConfig: { 
          maxOutputTokens: 8000,
      },
  })
}

export async function POST(req) {
  const history = await req.json()
  const userMsg = history[history.length - 1]

  try {
      const chat = await startChat(history)
      const result = await chat.sendMessage(userMsg.parts[0].text)
      const response = await result.response
      const output = response.text()
  
      return NextResponse.json(output)
  } catch (e) {
      console.error(e)
      return NextResponse.json({text: "Error, Check Console"})
  }
}
