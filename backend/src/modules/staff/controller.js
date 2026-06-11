const service = require("./service");

async function members(req,res){
  const data =
  await service.getMembers(
    req.user.id
  );

  res.json({
    success:true,
    data
  });
}

module.exports={
  members
};