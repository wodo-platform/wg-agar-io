class GameEvent {
    constructor() {
        type = 0;
        event = "";
        createdAt = null;
    }
}

class GameScoreEvent {

    constructor(event, from, to, score) {
        this.event = event;
        this.from = from;
        this.to = to;
        this.score = score;
        this.createdAt = new Date();
        this.type = 1;
    }
}

class GamePlayer {
    constructor(id, name, score) {
        this.id = id;
        this.name = name;
        this.score = score;
    }

}

class GameLeaderBoard {
    constructor() {
        this.users = [];
    }
}

class GameServerLogEntry {

    constructor(type, log) {
        this.type = type;
        this.log = log;
        this.createdAt = new Date();
    }
}

class GameServerLog {

    constructor(gameServerId, type, assetId) {
        this.gameServerId = gameServerId;
        this.type = type;
        this.assetId = assetId;
        this.logEntries = [];
        this.gameEvents = [];
        this.leaderBoard = new GameLeaderBoard();
        this.totalAmount = 0;
        this.revenue = 0;
        this.createdAt = new Date();
    }
}

class GameLogUtil {

    constructor() {
        this.gameServerLog = null;
    }

    instantiateWith(gameServerLog) {
        this.gameServerLog = gameServerLog;
    }

    instantiate(gameServerId, type, assetId) {
        this.gameServerLog = new GameServerLog(gameServerId, type, assetId);
    }

    addGameServerBootstrapEvent() {
        this.addLogEntryGeneric("Game server has been instantiated.");
    }

    addGameServerShutDownEvent() {
        this.addLogEntryGeneric("Game server has been shut down.");
    }

    addLogEntryGeneric(log) {
        var logEntry = new GameServerLogEntry(1, log);
        this.gameServerLog.logEntries.push(logEntry);
    }

    addEventGameScore(event, from, to, score) {
        var gameScoreEvent = new GameScoreEvent(event, from, to, score);
        this.gameServerLog.gameEvents.push(gameScoreEvent);
    }

    setLeaderBoard(leaderBoard) {
        this.gameServerLog.leaderBoard = leaderBoard;
    }

    addUser2LeaderBoard(id, name, score) {
        var gamePlayer = new GamePlayer(id, name, score);
        if (!(this.gameServerLog.leaderBoard)) {
            this.gameServerLog.leaderBoard = new GameLeaderBoard();
        }
        console.log("---> adding player[" + JSON.stringify(gamePlayer) + "] to user board");
        this.gameServerLog.leaderBoard.users.push(gamePlayer);
    }

}

module.exports = GameLogUtil;