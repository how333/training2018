
/**
 * service_kit.js
 * @authors dingwei (wding.cn@gmail.com)
 * @date    2015-05-26
 * @version $Id$
 */

var mqtt = require('mqtt');
var util = require('util');


var skit = function(name, log) {
    var self = this;
    var pack = {
        JSON: JSON.stringify
    };
    var unpack = {
        JSON: JSON.parse
    };
    var newID = function() {
        return Math.random().toString(36).slice(2);
    }
    self.id = newID();
    self.name = name;

    log = log || {
        info : console.log,
        debug : console.log,
        silly : console.log,
        verbose : console.log,
        warn : console.log,
        error : console.log
    }

    var mqttclient = null;
    
    self.mqtt = function(config, subtable) {
        config = config || {};
        config.host = config.host || "127.0.0.1";
        config.port = config.port || 1883;
        config.encoding = (config.encoding) && (config.encoding.toUpperCase() in pack) ? config.encoding.toUpperCase() : 'JSON';
        var p = pack[config.encoding];
        var up = unpack[config.encoding];

        for (var index in subtable) {
            var si = subtable[index];
            if (si.sub && si.process) {
                si.regex = new RegExp(si.sub.replace('+', '[0-9a-zA-Z]*'));
            }
        }

        var url = "mqtt://" + config.host + ":" + config.port;
        mqttclient = mqtt.connect(url);
        log.info('[%s] mqtt url: ' + url, log.name);

        mqttclient.on('connect', function() {
            log.info('[%s] mqtt client(id=%s, name=%s) connected.', log.name, self.id, self.name);
            var topics = [];
            subtable.forEach(function(i) {
                topics.push(i.sub);
            })

            if (topics.length > 0) {
                mqttclient.subscribe(topics);
                log.info('[%s] subscribe topics [%s].', log.name, topics.join(', '));
            }

            self.publish('server/start', {name: self.name}, config.encoding);
            
        });
        mqttclient.on('close', function() {
        });
        mqttclient.on('offline', function() {
        });
        mqttclient.on('error', function(err) {
            log.info(err)
        });
        mqttclient.on('message', function(topic, message) {
            // console.log(message.toString());
            for (var index in subtable) {
                var si = subtable[index];
                if (si.regex && topic.match(si.regex)) {
                    var m = null;
                    try {
                        m = up(message);
                        si.process(topic, m);
                    }
                    catch(err) {
                        log.error(err);
                        log.warn("topic [%s], message [%s] can't be unpacked.", topic.toString(), message.toString());
                    }
                }
            }
        });
    },

    self.publish = function(topic, message, encoding) {
        var p = pack[(encoding in pack) ? encoding : 'JSON'];
        message.uuid = message.uuid || self.id;
        message.timestamp = message.timestamp || (new Date()).valueOf();
        var m = p(message);
        mqttclient.publish(topic, m);
        log.debug('[%s] publish topic [%s], data [%s].', log.name, topic, m);
    }

    self.subscribe = function(topic) {

    }
}

exports.kit = function(name, log) {
    return new skit(name, log);
}