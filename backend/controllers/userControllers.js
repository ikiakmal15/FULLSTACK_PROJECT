const getUsers= (req,res) => {
res.json({
    message:"Get all users",
    data: []
  });
};

module.exports = { getUsers };