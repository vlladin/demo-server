import uuidV4 from 'uuid/v4';

class Authentication {
    constructor(database) {
        this.db = database;
        this.sessions = {};
    }

    authenticate(data) {
        if(!data || !data.username || !data.password){
            return {status: 1};
        }

        let user = this.db.getUserByUsername(data.username);
        if (!user) {
            return {status: 1};
        }

        if (user.password !== data.password) {
            return {status: 1};
        }

        //already has a session, so return it
        if (this.sessions[data.username]) {
            return {
                status: 0, session: this.sessions[data.username]
            }
        }

        let session = user.username + "." +  uuidV4() + "." + user.role;
        this.sessions[data.username] = session;

        return {status: 0, session: session}

    }

    logout(req) {
        delete this.sessions[req.get('auth').split(".")[0]];
    }

    canAccess(req, res, level) {
        res.status(200);
        return true;
        let session = req.get('auth');

        if(!session){
            res.status(401);
            return false;
        }

        let sessionData = session.split(".");
        if(sessionData.length < 3){
            res.status(401);
            return false;
        }

        let username = sessionData[0];
        let role = sessionData[2];

        if(!this.sessions[username]){
            res.status(401);
            return false;
        }
        if(this.sessions[username] !== session){
            res.status(401);
            return false;
        }

        if(level === "*"){
            res.status(200);
            return true;
        }

        if(level !== role){
            res.status(403);
            return false;
        }

        res.status(200);
        return true;
    }


}

export default Authentication;