import UserModel from '../model/user.js';
import low from 'lowdb';
import uuidV4 from 'uuid/v4';

class Database{
    constructor(){
        this.db = low('db.json');
        this.db.defaults({ users: []})
            .write()
    }

    createUser(data){
        if(!data.username || !data.password || !data.role || !data.info){
            return {"status": 1};
        }

        let existingCheck = this.db
            .get('users')
            .find({username: data.username})
            .value();

        if(existingCheck){
            return {"status": 2};
        }

        let user = new UserModel();
        user.id = uuidV4();
        user.username = data.username;
        user.password = data.password;
        user.role = data.role;
        user.info = data.info;
        this.db
            .get('users')
            .push(user)
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