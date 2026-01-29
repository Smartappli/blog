/**
 * GET /api/user/profile
 * Get user profile
 */
export async function getProfile(req, res, next) {
  try {
    const { profileId, profileName, profileRole } = req.userContext;

    // In production, fetch from database
    const profile = {
      id: profileId,
      name: profileName,
      role: profileRole,
      email: 'user@example.com',
      avatar: '👤'
    };

    res.json(profile);
  } catch (error) {
    next(error);
  }
}

/**
 * PUT /api/user/profile
 * Update user profile
 */
export async function updateProfile(req, res, next) {
  try {
    const { name, email } = req.body;
    const { profileId } = req.userContext;

    // In production, update in database
    const updatedProfile = {
      id: profileId,
      name: name || req.userContext.profileName,
      email: email || 'user@example.com'
    };

    res.json(updatedProfile);
  } catch (error) {
    next(error);
  }
}
