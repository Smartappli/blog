import dotenv from 'dotenv';
dotenv.config({ quiet: true });

export const config = {
  appName: 'wes-app-blog',
  proxySecret: process.env.PROXY_SECRET || 'dev-secret',
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'https://wallesmart.be'
  ],
  port: process.env.PORT || 3000,
  graphqlUrl: process.env.GRAPHQL_URL || 'https://wallesmart.be/graphql',
  graphqlToken: process.env.GRAPHQL_TOKEN || 'Bearer your-token-here',
  graphqlTimeout: parseInt(process.env.GRAPHQL_TIMEOUT) || 30000
};
