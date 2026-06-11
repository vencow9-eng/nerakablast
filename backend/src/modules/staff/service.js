const prisma =
require("../../config/database");

async function getMembers(userId){

return await prisma.user.findMany({
where:{
parentId:userId
}
});

}

module.exports={
getMembers
};