const generateMessage = (text, username) => {
    if(username===undefined){
        username = "Admin"
    }
    return {
        username,
        text : text,
        createdAt : new Date().getTime()
    }
}

const generateLocationMessage = (url, username) => {
    return {
        username,
        url ,
        createdAt : new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}