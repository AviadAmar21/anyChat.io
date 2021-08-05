const users = [];

const addUser = ({ id, name}) => {
    name = name.trim().toLowerCase();

    const exsitingUser = users.find(user => user.name === name);

    if (exsitingUser) {
        return { error: 'Username is taken' }
    }

    const user = { id, name };

    users.push(user);

    return { user }; // to indicate last user created 
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = () => { return users; }

module.exports = { addUser, removeUser, getUser, getUsersInRoom };