import app from './app.mjs';
import { config } from './config/index.mjs';

app.listen(config.port, () => {
  console.log(`🚀 Blog running on port ${config.port}`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${config.port}/health`);
});
