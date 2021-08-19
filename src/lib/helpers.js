const bcrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (pass) => {
    const salt = await bcrypt.genSalt(10); //patron 10 num de veces
    const hash = await bcrypt.hash(pass, salt);
    return hash;
};

helpers.matchPassword = async (pass, savePass) => {
    try{
        return await bcrypt.compare(pass, savePass);
    }catch(e){
        console.log(e);
    }
};

module.exports = helpers;