module.exports = function(req, res, next) {
  // Check if a session exists and if it contains a user object
  if (req.session && req.session.user) {
    // If the user is logged in, allow the request to proceed
    // to the next function in the chain (the route handler).
    return next();
  } else {
    // If there's no user in the session, they are not authorized.
    // Send back a 401 Unauthorized error.
    return res.status(401).json({ msg: 'Unauthorized: No user is logged in' });
  }
};