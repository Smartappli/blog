/**
 * Example: Query user profile from GraphQL API
 */
export async function getUserProfile(req, res, next) {
  try {
    const { profileId } = req.userContext;

    const query = `
      query GetUserProfile($profileId: ID!) {
        profile(id: $profileId) {
          id
          name
          email
          role
          preferences {
            theme
            language
          }
        }
      }
    `;

    // Method 1: Using SDK's executeGraphQL helper
    const data = await req.app.locals.sdk.executeGraphQL(query, { profileId }, req);

    res.json(data.profile);
  } catch (error) {
    next(error);
  }
}

/**
 * Example: Query data with pagination
 */
export async function getDataList(req, res, next) {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = `
      query GetDataList($page: Int!, $limit: Int!) {
        dataList(page: $page, limit: $limit) {
          items {
            id
            name
            createdAt
          }
          total
          hasMore
        }
      }
    `;

    const graphqlClient = req.app.locals.sdk.getGraphQLClient();
    const data = await graphqlClient.query(
      query,
      { page: parseInt(page), limit: parseInt(limit) },
      req.userContext
    );

    res.json(data.dataList);
  } catch (error) {
    next(error);
  }
}

/**
 * Example: Create data with mutation
 */
export async function createData(req, res, next) {
  try {
    const { name, description } = req.body;

    const mutation = `
      mutation CreateData($input: DataInput!) {
        createData(input: $input) {
          id
          name
          description
          createdAt
        }
      }
    `;

    const graphqlClient = req.app.locals.sdk.getGraphQLClient();
    const data = await graphqlClient.mutate(
      mutation,
      { input: { name, description } },
      req.userContext
    );

    res.status(201).json(data.createData);
  } catch (error) {
    next(error);
  }
}
