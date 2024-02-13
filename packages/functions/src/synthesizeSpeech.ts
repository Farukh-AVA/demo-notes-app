

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


const polly = new PollyClient({ region: 'us-east-1' }); // Replace with your AWS region

export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
 
  let data = {
    content: "",
  }; 
  
  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    Text: data.content,
    VoiceId: 'Danielle',
    OutputFormat: 'mp3',
    Engine: 'long-form'
  };

  let audioData: Buffer[] = [];
  let base64Audio: string | null = null;
  try {
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
    return {
      statusCode: 200,
      body: JSON.stringify({
        audioData: base64Audio,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
};
