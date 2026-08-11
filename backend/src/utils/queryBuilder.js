exports.formatUserQuery = (userId) => {
  return {
    text: 'SELECT * FROM notes WHERE user_id = $1',
    values: [userId]
  };
};