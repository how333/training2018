/**
 * mqtt_ws_bridge.js
 * @authors dingwei (wding.cn@gmail.com)
 * @date    2015-04-16
 * @version $Id$
 */

var mqtt = require('mqtt');
var util = require('util');
var bridges = {};
var logger = null;

/**
 * [MQTTWSBridge construction]
 * @param {[type]} mqttoptions [description]
 * @param {[type]} wsoptions   [description]
 * @param {[type]} logger      [description]
 */
var mqttwsbridge = exports.MQTTWSBridge = function(name, _mqttoptions, _server, _logger, _encoder) {
    logger = _logger;
    var self = this;
    this.name = name;
    if (logger == null) {
        throw "null logger."
    }

    this.mqttoptions = _mqttoptions;
    if (!(this.mqttoptions && this.mqttoptions.host && this.mqttoptions.port)) {
        throw "error mqtt options.";
    }
    logger.info("[%s] initializing mqtt broker at (%s:%s).", this.name, this.mqttoptions.host, this.mqttoptions.port);
    this.mqttoptions.secure = this.mqttoptions.secure || false;
    this.mqttoptions.url = (this.mqttoptions.secure ? "mqtts" : "mqtt") + "://" + this.mqttoptions.host + ":" + this.mqttoptions.port;
    this.mqttoptions.encoding = this.mqttoptions.encoding || "JSON";


    this.wsserver = _server;
};

mqttwsbridge.prototype.start = function() {
    var self = this;
    if (!self.wsserver) {
        throw "null web server.";
    }

    var pack = null,
        unpack = null;
    switch (this.mqttoptions.encoding.toUpperCase()) {
        default:
            pack = JSON.stringify;
            unpack = JSON.parse;
            break;
    }

    var io = require('socket.io')(self.wsserver);
    var mqtt_io = io.of('/mqtt');
    var ws = mqtt_io.server.eio.ws;
    logger.info("[%s] starting websocket.", self.name);

    mqtt_io.on('connect', function(websocket) {

        var socketid = websocket.id;
        var address = websocket.handshake.address;

        logger.info('[%s] ws client(socketid=%s, ip=%s) try to connect mqtt broker.', self.name, socketid, address);
        var mqttclient = mqtt.connect(self.mqttoptions.url, self.mqttoptions.args);

        mqttclient.on('connect', function() {
            logger.info('[%s] mqtt client(socketid=%s) is connected.', self.name, socketid);
        });

        mqttclient.on('close', function() {
            logger.info('[%s] mqtt client(socketid=%s) is disconnected.', self.name, socketid);
        });

        mqttclient.on('offline', function() {
            logger.info('[%s] mqtt client(socketid=%s) can\'t connect to the broker.', socketid);
        })

        mqttclient.on('message', function(topic, message, package) {
            try {
                var m = unpack(message);
                logger.silly('[%s] forward mqtt topic [%s] to ws client(socketid=%s), message=[%s].', logger.name, topic, socketid, util.inspect(m));
                websocket.emit(topic, m);
            } catch (err) {
                logger.warn('[%s], Unpack message failed, message=[%s].', err, util.inspect(message.toString(), {
                    showHidden: true,
                    depth: null
                }));
            }
        });

        bridges[socketid] = {
            id: socketid,
            address: address,
            ws: websocket,
            mqtt: mqttclient
        };

        websocket.on('disconnect', function() {
            logger.info('[%s] ws client(socketid=%s) is disconnected.', self.name, socketid);
            var m = pack({
                socketid: socketid,
                timestamp: (new Date()).valueOf()
            })
            mqttclient.publish('client/disconnect', m);
            bridges[socketid].mqtt.end();
            delete bridges[socketid];
        });

        websocket.on('subscribe', function(data) {
            if (data.topic) {
                logger.debug('[%s] ws client(socketid=%s) subscribe topic: [%s].', self.name, socketid, Array.isArray(data.topic) ? data.topic.join(', ') : data.topic);
                mqttclient.subscribe(data.topic);
            }
        });

        websocket.on('unsubscribe', function(data) {
            if (data.topic) {
                logger.debug('[%s] ws client(socketid=%s) unsubscribe topic: [%s].', self.name, socketid, Array.isArray(data.topic) ? data.topic.join(', ') : data.topic);
                mqttclient.unsubscribe(data.topic);
            }
        });

        websocket.on('publish', function(data) {
            if (data.topic && data.message) {
                var m = pack(data.message);
                logger.debug("[%s] publish message.(topic=[%s], message=[%s])", self.name, data.topic, m);
                mqttclient.publish(data.topic, m);
            }
        });
    });
}