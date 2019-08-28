# csgo-log-receiver

The simple `SRCDS` log receiver on `Node.js`

---
## Usage

### Connect the package

```js
const CSGOLogReceiver = require('csgo-log-receiver');

const receiver = new CSGOLogReceiver({
    host: '0.0.0.0', 
    port: 9871
});

// Registration of the server from which you want to receive logs
receiver.registerSource({
    address: '127.0.0.1',
    port: 27015,
    password: '12345'
});

// Or this way
const receiver = new CSGOLogReceiver({
    host: '0.0.0.0', 
    port: 9871,

    sources: [{
        address: '127.0.0.1',
        port: 27015,
        password: '12345'
    }, ...]

});
```

### Receiving the logs

```js
receiver.on('error', ({server, error}) => {
    console.error('Error on server', receiver.stringifyServerId(server), '#' + error);
});

receiver.on('log', ({server, message}) => {
    console.log(receiver.stringifyServerId(server), message);
});
```

### Errors
```js
{
    tooShort: 1,
    badHeader: 2,
    invalidPassword: 3,
    invalidPayload: 4
}
```