var bcrypt = require('bcrypt');

function getSalt(userId)
{
    return bcrypt.genSaltSync(userId);
}

function generateHash(password, salt)
{
    return bcrypt.hashSync(password, salt);
}

function validate(password, hash)
{
    return bcrypt.compareSync(password, hash);
}

module.exports = {
    salt: getSalt,
    hash: generateHash,
    validate: validate
}