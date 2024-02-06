/**
 * Test API:
 * npx apig-test \  --username admin@example.com --password Passw0rd! --user-pool-id us-east-1_djp9wn5ny --app-client-id 4t62bmnsi8p85i1lr7a0ado29o --cognito-region us-east-1 --identity-pool-id us-east-1:80618ff1-30fe-44f4-b04a-d590e1605c52 --invoke-url https://4xhkh8mtcl.execute-api.us-east-1.amazonaws.com --api-gateway-region us-east-1 --path-template /synthesize-speech --method POST --body '{""content\":\"hello world\"}'   
 */

import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';


const polly = new PollyClient({ region: 'us-east-1' }); // Replace with your AWS region

export const main = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('START OF LAMBDA FUNCTION'); 
  let data = {
    content: "",
  }; 
  
  if (event.body != null) {
    data = JSON.parse(event.body);
  }

  const params = {
    Text: data.content,
    VoiceId: 'Joanna',
    OutputFormat: 'mp3',
  };

  let audioData: Buffer[] = [];
  let base64Audio: string | null = null;
  try {
    const data = await polly.send(new SynthesizeSpeechCommand(params));

    
    data.AudioStream?.on('data', (chunk: Buffer) => {
      audioData.push(chunk);
    });

    // Log when the stream ends
    data.AudioStream?.on('end', () => {
      
      // Convert the concatenated audio data to Base64
      base64Audio = Buffer.concat(audioData).toString('base64');

      // Now you can use `base64Audio` as needed (e.g., send it to the frontend)
      console.log('Base64 Audio:', base64Audio);
    });

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
