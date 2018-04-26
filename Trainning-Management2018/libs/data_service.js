/**
 * data_service.js
 * @authors dingwei (wding.cn@gmail.com)
 * @date    2015-05-13
 * @version $Id$
 */

var mqtt = require('mqtt');
var myIP = require('my-ip');
var debug = require('debug')('dataservice');
var util = require('util');
var url = require('url');
var clone = require('clone');

var Data = function() {
    var self = this;
    self.uuid = Math.random().toString(36).slice(2);
    var data = {};
    var synctable = {};
    var syncdata = {
        all: {},
        modify: {}
    };
    var synchronizer = {};

    var pack = {
        JSON: JSON.stringify
    };
    var unpack = {
        JSON: JSON.parse
    };
    var scope = ['ALL', 'MODIFY'];
    var schedule = ['ONTIME', 'PERIOD', 'MANUAL'];

    var newID = function() {
        return Math.random().toString(36).slice(2);
    }
    self.get = function(name) {
        if (data[name] != undefined) {
            return data[name].v;
        }
        return undefined;
    };

    self.registVariables = function(name, variables) {
        synctable[name] = synctable[name] || {};
        synctable[name].variables = synctable[name].variables || [];
        variables = typeof variables == 'string' ? [variables] : variables;
        if (Array.isArray(variables)) {
            synctable[name].variables = synctable[name].variables.concat(variables.filter(function(v) {
                return synctable[name].variables.indexOf(v) < 0;
            }));
        }
        syncdata.all[name] = syncdata.all[name] || {};
        if (Array.isArray(variables)) {
            for (var index in variables) {
                var vn = variables[index];
                var v = self.get(vn);
                if (v != undefined) {
                    syncdata.all[name][vn] = v;
                }
            }
        }
        // console.log(synctable);
    };

    var getMQTTClient = function(host, port) {
        for (var id in synchronizer) {
            var s = synchronizer[id];
            if (s.url.protocol == 'mqtt:' && s.url.hostname == host && s.url.port == port) {
                return id;
            }
        }
        var s = {};
        s.id = newID();
        var u = 'mqtt://' + host + ":" + port.toString();
        s.url = url.parse(u);
        s.synchronizer = mqtt.connect(u);
        synchronizer[s.id] = s;
        return s.id;
    }

    var getMQTTSync = function(name, sync) {
        sync.param.ip = sync.param.ip || '127.0.0.1';
        sync.param.port = sync.param.port || 1883;
        sync.synchronizer = getMQTTClient(sync.param.ip, sync.param.port);
        if (!sync.param.topic) {
            throw 'MQTT needs topic.';
        }
        return sync;
    }

    var addondata = function(data, addon) {
        if (addon) {
            for(var k in addon) {
                data[k] = addon[k];
            }
        }
        data.timestamp = (new Date()).valueOf();
        return data;
    }

    var syncfun = function(task) {
        var d = {};
        if (task.scope == 'MODIFY') {
            d.data = clone(syncdata.modify[task.id]);
        } else {
            d.data = clone(syncdata.all[task.owner]);
        }
        if (Object.keys(data).length == 0) {
            return;
        }
        addondata(d, task.addon);
        if (task.type == 'MQTT') {
            if (Object.keys(d.data).length > 0) {
                synchronizer[task.synchronizer].synchronizer.publish(task.param.topic, task.packf(d));
                if (task.scope == 'MODIFY') {
                    syncdata.modify[task.id] = {};
                }
            }
        }
    }

    var getSync = function(name, sync) {
        sync.id = newID();
        sync.type = sync.type.toUpperCase();
        sync.pack = (sync.pack && (sync.pack.toUpperCase() in pack)) ? sync.pack : 'JSON';
        sync.scope = (sync.scope && (scope.indexOf(sync.scope.toUpperCase()) >= 0)) ? sync.scope.toUpperCase() : "MODIFY";
        sync.schedule = (sync.schedule && schedule.indexOf(sync.schedule.toUpperCase()) >= 0) ? sync.schedule.toUpperCase() : "ONTIME";
        sync.param = sync.param || {};
        sync.owner = name;

        sync.packf = pack[sync.pack];
        
        if (sync.scope == 'MODIFY') {
            syncdata.modify[sync.id] = syncdata.modify[sync.id] || {};
        }
        
        if (sync.schedule == "PERIOD") {
            sync.param.period = sync.param.period || 50;
            // sync.timer = setInterval(syncfun, sync.param.period, sync);
        }

        switch (sync.type) {
            case 'MQTT':
                return getMQTTSync(name, sync);
                break;
            default:
                throw 'unknown Sync Type.';
                break;
        }
    }

    var objectequal = function(x, y) {
        if (x === y) return true;

        if (!(x instanceof Object) || !(y instanceof Object)) return false;

        if (x.constructor !== y.constructor) return false;

        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;

            if (!y.hasOwnProperty(p)) return false;

            if (x[p] === y[p]) continue;

            if (typeof(x[p]) !== "object") return false;

            if (!objectequal(x[p], y[p])) return false;
        }

        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        }
        return true;
    }

    var syncequal = function(x, y) {
        return (x.type == y.type) && 
            (x.owner == y.owner) &&
            (x.pack == y.pack) && 
            (x.scope == y.scope) &&
            (x.schedule == y.schedule) &&
            (objectequal(x.param, y.param));
    }


    self.registSync = function(name, sync) {
        synctable[name] = synctable[name] || {};
        synctable[name].syncs = synctable[name].syncs || [];
        // synctable[name].syncids = synctable[name].syncids || [];

        var s = getSync(name, sync);

        var isexist = false;
        for (var index in synctable[name].syncs) {
            if (syncequal(synctable[name].syncs[index], s)) {
                s = synctable[name].syncs[index];
                isexist = true;
                break;
            }
        }

        if (isexist == false) {
            synctable[name].syncs.push(s);
            // synctable[name].syncids.push(s.id);
            if (s.schedule == 'PERIOD') {
                s.timer = setInterval(syncfun, s.param.period, s);
            }
        }

        return s.id;
    };

    self.unregistSync = function(id) {
        for (var i in synctable) {
            var syncs = synctable[i].syncs;
            for (var j in syncs) {
                if (syncs[j].id == id) {
                    delete syncs[j];
                    syncs.splice(j, 1);
                }
            }
        }
    }

    var gettask = function(id) {
        for (var i in synctable) {
            var syncs = synctable[i].syncs;
            for (var index in syncs) {
                if (syncs[index].id == id) {
                    return syncs[index];
                }
            }
        }
        return undefined;
    }

    self.manualSync = function(id) {
        var sync = gettask(id);
        syncfun(sync);
    }



    self.set = function(name, value, callback) {
        var oldvalue = self.get(name);
        if (!objectequal(oldvalue, value)) {
            data[name] = {
                v: value,
                t: new Date().getTime()
            };
            if (callback) {
                callback(name, oldvalue, data[name]);
            }

            for (t in synctable) {
                var sc = synctable[t];
                if (sc.variables.indexOf(name) >= 0) {
                    var syncs = sc.syncs;
                    for (sindex in syncs) {
                        var id = syncs[sindex].id;
                        var task = gettask(id);
                        if (task.scope == 'MODIFY') {
                            syncdata.modify[id][name] = value;
                        }
                        if (task.schedule == 'ONTIME') {
                            var d = {};
                            d.data = {};
                            d.data[name] = value;
                            addondata(d, task.addon);
                            synchronizer[task.synchronizer].synchronizer.publish(task.param.topic, task.packf(d));
                        }
                    }
                    syncdata.all[t][name] = value;
                }
            }
            // console.log(syncdata);
        }
    }




    self.timestamp = function(name) {
        if (data[name]) {
            return data[name].t;
        }
        return undefined;
    }

}

exports.data = function() {
    return new Data();
}