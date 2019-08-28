const dgram = require('dgram');

const EventEmmiter = require('events').EventEmitter;

const PacketParser = require('./PacketParser');

const Errors = require('./Errors');

class Server extends EventEmmiter {

    constructor(opts) {
        super();

        this.opts = opts || {};

        this.servers = {};

        (this.opts.sources || []).forEach((source) => this.registerSource(source));

        this.opts.port = this.opts.port || 9871;
        this.opts.host = this.opts.host || '0.0.0.0';

        this.parser = new PacketParser(this);

        this.createSocket();

    }

    getSource(serverInfo) {
        if (typeof (serverInfo) === "string") return this.__getSource(serverInfo);

        return this.__getSource(this.stringifyServerId(serverInfo));
    }

    __getSource(serverId) {
        if (!serverId) return undefined;

        return this.servers[serverId];
    }

    registerSource(serverInfo) {
        let serverId = this.stringifyServerId(serverInfo);

        if (!serverId) return false;

        this.servers[serverId] = serverInfo;

        return true;
    }

    stringifyServerId(serverInfo) {
        if (!serverInfo.address || !serverInfo.port) return undefined;

        return `${serverInfo.address}:${serverInfo.port}`;
    }

    createSocket() {
        this.socket = dgram.createSocket('udp4', this.handler.bind(this));
        this.socket.bind(this.opts.port, this.opts.host);
    }

    handler(message, senderInfo) {
        if (!this.getSource(senderInfo)) return;

        let parsedMessage = this.parser.parse(message, senderInfo);

        if (parsedMessage.error)
            return this.emit('err', {
                server: senderInfo,
                error: parsedMessage.error
            });


        this.emit('log', {
            server: senderInfo,
            message: parsedMessage
        });
    }

};

module.exports = Server;