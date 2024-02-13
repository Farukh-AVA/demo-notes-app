/**
 * Test API:
 * npx apig-test \  --username admin@example.com --password Passw0rd! --user-pool-id us-east-1_djp9wn5ny --app-client-id 4t62bmnsi8p85i1lr7a0ado29o --cognito-region us-east-1 --identity-pool-id us-east-1:80618ff1-30fe-44f4-b04a-d590e1605c52 --invoke-url https://4xhkh8mtcl.execute-api.us-east-1.amazonaws.com --api-gateway-region us-east-1 --path-template /synthesize-speech --method POST --body '{""content\":\"hello world\"}'   
 */
const config = {
    STRIPE_KEY: "pk_test_51O1WL9C9ZF1XHuJ2ecF6JOpHgWiiuKYY5QlwCiOSk0bkEPRGfbaxyqXKdKn5cglr9oThXkBoijrmDQkL0IlquFIy0010rWqsZR",
    // Frontend config
    MAX_ATTACHMENT_SIZE: 5000000,
    // Backend config
    s3: {
      REGION: import.meta.env.VITE_REGION,
      BUCKET: import.meta.env.VITE_BUCKET,
    },
    apiGateway: {
      REGION: import.meta.env.VITE_REGION,
      URL: import.meta.env.VITE_API_URL,
    },
    cognito: {
      REGION: import.meta.env.VITE_REGION,
      USER_POOL_ID: import.meta.env.VITE_USER_POOL_ID,
      APP_CLIENT_ID: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      IDENTITY_POOL_ID: import.meta.env.VITE_IDENTITY_POOL_ID,
    },
    
  };
  
  
  
  export default config;