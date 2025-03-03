const awsIot = require('aws-iot-device-sdk');

const today = new Date();
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
const dateTime = date + ' ' + time;
const topic = "seederslocation"  // de start.ps1 o lo actualizo en AWS web

const device = awsIot.device({
    clientId: 'sdk-nodejs-v2', // de start.ps1
    host: 'a1mlxh04kxytys-ats.iot.eu-north-1.amazonaws.com', // de start.ps1
    port: 8883,
    keyPath: './SebasSeeder.private.key', // de start.ps1
    certPath: './SebasSeeder.cert.pem', // de start.ps1
    caPath: './root-CA.crt', // de start.ps1
});

const IoTDevice = {
    serialNumber: "SN-D7F3C8947867",
    dateTime,
    activated: true,
    device: "MyRaspperry-01",
    type: "MySmartIoTDevice",
    payload: {}
}

const getSensorData = (cb) => getDummySensorData(cb);

const getDummySensorData = (cb) => {
    const temperatureData = { temp: '100°C', humidity: '52%' }
    return cb(temperatureData)
}

const sendData = (data) => {
    const telemetryData = {
        ...IoTDevice,
        payload: data
    }
    console.log(`STEP - Sending data to AWS  IoT Core'`, telemetryData)
    console.log(`---------------------------------------------------------------------------------`)
    return device.publish(topic, JSON.stringify(telemetryData))
}

device
    .on('connect', function () {
        console.log('STEP - Connecting to AWS  IoT Core');
        console.log(`---------------------------------------------------------------------------------`)
        setInterval(() => getSensorData(sendData), 3000)

    });

device
    .on('message', function (topic, payload) {
        console.log('message', topic, payload.toString());
    });

device
    .on('error', function (topic, payload) {
        console.log('Error:', topic, payload.toString());
    });