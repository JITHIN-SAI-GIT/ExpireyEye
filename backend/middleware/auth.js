module.exports = function(req, res, next) {
  // Check if the user is authenticated via Passport
  if (req.isAuthenticated()) {
    // If the user is logged in, allow the request to proceed
    return next();
  } else {
    // If there's no user in the session, they are not authorized.
    return res.status(401).json({ msg: 'Unauthorized: No user is logged in' });
  }
};