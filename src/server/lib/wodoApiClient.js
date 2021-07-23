var axios = require('axios');

class WodoApiClient {

    constructor() {
        this.bastApiURL = 'http://localhost:3001/api';
        this.instance = axios.create({
            baseURL: this.bastApiURL, //process.env.VUE_APP_REAL_WORLD_API_URL,
            timeout: 50000
        });
        this.instance.defaults.headers.get.Accepts = "application/json";
        this.instance.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

        //this.instance.interceptors.response.use(this.OnResponseSuccess, this.OnResponseFailure);
    }

    setGamerServerId(id) {
        this.gameServerId = id;
    }

    get(url) {
        axios.get('http://localhost:3001/api/' + url).then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data;
        }).catch((error) => {
            console.log(JSON.stringify(error));
            throw new Error(error);
        });
    }

    getGameServers() {
        this.instance.get('/game-servers' + url).then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data;
        }).catch((error) => {
            console.log(JSON.stringify(error));
            throw new Error(error);
        });
    }

    createGameServer(gameLogUtil) {
        try {
            this.instance.post('/game-servers', {
                    type: 1,
                    assetId: 1,
                    data: JSON.stringify(gameLogUtil.gameServerLog),
                    totalAmount: 0,
                    revenue: 0
                })
                .then((response) => {
                    console.log(response.data);
                    this.gameServerId = response.data.id;
                    var gameServerLog = JSON.parse(response.data.data);
                    gameServerLog.gameServerId = this.gameServerId;
                    gameLogUtil.instantiateWith(gameServerLog);
                    console.log("gameServerLog:" + JSON.stringify(gameLogUtil.gameServerLog));
                }, (error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    updateGameServer(gameLogUtil) {
        try {
            this.instance.put('/game-servers', {
                    id: this.gameServerId,
                    data: JSON.stringify(gameLogUtil.gameServerLog),
                    totalAmount: 456,
                    revenue: 56
                })
                .then((response) => {
                    console.log(response.data);
                }, (error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    joinGame(userName, userId, bid, gameLogUtil) {
        try {
            this.instance.post('/game-servers/join', {
                    userId: userId,
                    gameServerId: this.gameServerId,
                    gameType: 1,
                    assetId: 1,
                    amount: Number.parseInt(bid)
                })
                .then((response) => {
                    console.log(response.data);
                    gameLogUtil.addLogEntryGeneric(`User[id=${userId}, name=${userName}] has joined the game server[${this.gameServerId}]`);
                }, (error) => {
                    console.log(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    OnResponseSuccess(response) {
        console.log(JSON.stringify(response.data));
        return response;
    }

    OnResponseFailure(error) {
        console.log("rest error:" + error.response);
        const httpStatus = error.response.status;



        switch (httpStatus) {
            case 401:
                console.log("You are not logged in, please login first.");
                break;
            case 404:
                console.log(["Requested resource was not found."]);
                break;
            case 422:
                console.log(["Access to this resource is forbidden"]);
                break;
            default:
                console.log(["Unknown error occurred, please try again later."]);
                break;
        }
        return errors;
    }
}


module.exports = WodoApiClient;