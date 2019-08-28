const logReceiver = require('./index');

const receiver = new logReceiver({
    host: '192.168.1.5',
    port: 9871
});

receiver.registerSource({
    address: '192.168.1.5',
    port: 27015,
    password: '12345'
});

receiver.on('error', ({server, error}) => {
    console.error('Error on server', receiver.stringifyServerId(server), '#' + error);
});

receiver.on('log', ({server, message}) => {
    console.log(receiver.stringifyServerId(server), message);
});