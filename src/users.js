const users = []

// addUser , removeUser , getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error : 'Username and room are required'
        }
    }

    //Check the existing user
    const existingUser =  users.find((user) => {
        return username === user.username && room === user.room
    })

    //Validate username
    if(existingUser){
        return {
            error : 'Username is in use!'
        }
    }

    //Store user
    const user = {id, username, room}
    users.push(user)
    return {user}

}


const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    
    if(index !== -1)
    {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const oldUser = users.find((user) => {
        return user.id === id
    })

    return oldUser
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    const roomUsers = users.filter((user) => {
        return user.room === room
    })

    return roomUsers
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}