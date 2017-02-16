import low from 'lowdb';

class Database{
    constructor(){
        this.db = low('db.json');
        this.db.defaults({ users: []})
            .write()
    }

    createUser(data){
        this.db
            .get('users')
            .push(data)
            .write();
        return {"status": 0};
    }

    getUserById(id){
        return this.db
            .get('users')
            .find({id: id})
            .value();
    }

    getUserByUsername(username){
        return this.db
            .get('users')
            .find({username: username})
            .value();
    }

    getAllUsers(){
        return this.db
            .get('users')
            .value();
    }
}

export default Database;