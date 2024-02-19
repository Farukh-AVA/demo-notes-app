

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import handler from "@notes/core/handler";

const polly = new PollyClient({ region: 'us-east-1' }); // Replace with your AWS region


export const main = handler(async (event) => {
 
  let inputData = {
    content: "",
  }; 
  
  if (event.body != null) {
    inputData = JSON.parse(event.body);
  }

  const params = {
    Text: inputData.content,
    VoiceId: 'Danielle',
    OutputFormat: 'mp3',
    Engine: 'long-form'
  };

  let audioData: Buffer[] = [];
  
    const data = await polly.send(new SynthesizeSpeechCommand(params));

    
    data.AudioStream?.on('data', (chunk: Buffer) => {
      audioData.push(chunk);
    });

    await new Promise<void>((resolve, reject) => {
      data.AudioStream?.on('end', () => {
        resolve();
      });
      data.AudioStream?.on('error', (error: Error) => {
        console.error('Error streaming audio:', error);
        reject(error);
      });
    });

    // Convert the concatenated audio data to Base64
    const base64Audio = Buffer.concat(audioData).toString('base64');
    
    return JSON.stringify({audioData: base64Audio})
     
});

