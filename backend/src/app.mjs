import express from 'express';
import cors from 'cors';
import { createWalleSmartSDK } from '@wallesmart/sdk-node';
import { config } from './config/index.mjs';
import * as taskRoutes from './routes/tasks.mjs';
import * as userRoutes from './routes/users.mjs';

// ============================================================================
// Express App Setup
// ============================================================================

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: config.corsOrigins, credentials: true }));

// Initialize WALLeSmart SDK
const sdk = createWalleSmartSDK({
  config: {
    appName: config.appName,
    proxySecret: config.proxySecret,
    nodeEnv: config.nodeEnv,
    graphqlUrl: config.graphqlUrl,
    graphqlToken: config.graphqlToken,
    graphqlTimeout: 30000,
    devUserContext: {
      profileId: 'dev-profile-123',
      userId: 'dev-user-456',
      appId: 'task-management-789',
      memberReferenceId: 'dev-member-abc',
      profileName: 'John Developer',
      profileRole: 'farmer',
      appName: config.appName,
      csrfToken: 'dev-csrf-token-xyz'
    }
  },
  app,
  autoSetup: true // Adds /health, /user-info, auth middleware
});

// Development request logging
if (config.nodeEnv === 'development') {
  app.use(sdk.requestLogger());
}

// ============================================================================
// Make SDK available in routes
// ============================================================================

// Store SDK instance in app.locals for access in routes
app.locals.sdk = sdk;

// Or create middleware to attach GraphQL client to request
app.use((req, res, next) => {
  req.graphql = sdk.getGraphQLClient();
  req.executeGraphQL = (query, variables) => sdk.executeGraphQL(query, variables, req);
  next();
});

// ============================================================================
// Main App Routes
// ============================================================================

// Tasks API
app.get('/api/tasks', sdk.requireAuth(), taskRoutes.getAllTasks);
app.post('/api/tasks', sdk.requireAuth(), taskRoutes.createTask);
app.put('/api/tasks/:id', sdk.requireAuth(), taskRoutes.updateTask);
app.delete('/api/tasks/:id', sdk.requireAuth(), taskRoutes.deleteTask);

// User API
app.get('/api/user/profile', sdk.requireAuth(), userRoutes.getProfile);
app.put('/api/user/profile', sdk.requireAuth(), userRoutes.updateProfile);

// Admin only routes
app.get('/api/admin/stats', sdk.requireRole('admin'), taskRoutes.getStats);

// ============================================================================
// Widget Routes
// ============================================================================

// Task Summary Widget
app.get('/widgets/blog', taskRoutes.getTaskSummary);

// ============================================================================
// Error Handling
// ============================================================================

app.use(sdk.notFound());
app.use(sdk.errorHandler());

export default app;
export { sdk };
