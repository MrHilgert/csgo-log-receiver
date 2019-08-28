const Errors = require('./Errors');

const MAGIC = {
    header: Buffer.alloc(4, 255),
    bytePassword: 0x53,
    byteNoPassword: 0x52,
    strHeaderEnd: 'L '
};

class PacketParser {

    constructor(server) {
        this.server = server;
    }

    parse(message, senderInfo) {

        if (message.length < 16)
            return { error: Errors.tooShort };

        if (!this.validateHeader(message))
            return { error: Errors.badHeader };

        if (!this.validatePassword(message, senderInfo))
            return { error: Errors.invalidPassword };

        let payload = this.extractMessage(message);

        return payload || { error: Errors.invalidPayload };
    }

    validateHeader(message) {
        return message.slice(0, MAGIC.header.length).compare(MAGIC.header) === 0;
    }

    validatePassword(message, senderInfo) {

        let packetType = message[4];

        if (packetType === MAGIC.bytePassword) {
            
            let serverOpts = this.server.getSource(senderInfo);

            if(!serverOpts) return false;

            let receivedPassword = this.extractPassword(message);

            if(!receivedPassword) return false;

            if(serverOpts.password !== receivedPassword) return false;

            return true;

        }

        return false;
    }

    extractMessage(message) {

        let start = message.indexOf(MAGIC.strHeaderEnd);

        if(start < 0) return undefined;

        return message.slice(start + MAGIC.strHeaderEnd.length, message.length -2).toString();
    }

    extractPassword(message) {
        let end = message.indexOf(MAGIC.strHeaderEnd);

        if(end < 0) return undefined;

        return message.slice(MAGIC.header.length + 1, end).toString();
    }

}

module.exports = PacketParser;