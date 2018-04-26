#!/usr/bin/env node
/**
 * 
 * @authors dingwei (wding.cn@gmail.com)
 * @date    2015-04-10 14:34:28
 * @version 0.0.1
 */


var winston = require('winston');
var loglevels = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
var destinations = ['console', 'file', 'db'];
var loggerdest = ['console', 'udp'];


/**
 * [Logger constructor]
 * 
 * @param {[object]} options [logger options]
 * @param {[string]} name    [logger name]
 */
var Logger = exports.Logger = function(options, name) {
  var self = this;
  //
  // options on this instance.
  // 
  options = options || {};
  this.uuid = Math.random().toString(36).slice(2);
  this.name = name || options.name || "Logger";
  this.level = (options.level && (loglevels.indexOf(options.level.toLowerCase()) >= 0)) ? options.level.toLowerCase() : 'info';
  this.silent = (typeof options.silent == 'boolean') ? options.silent : false;
  this.destination = (options.destination && (loggerdest.indexOf(options.destination.toLowerCase()) >= 0)) ? options.destination.toLowerCase() : 'console';
  if (this.destination == 'udp') {
    this.ip = options.ip || "127.0.0.1";
    this.port = options.port || 10514;
  }

  //
  // create logger instance by wiston
  //
  this._logger = new winston.Logger();
  if (this.destination == 'console') {
    this._logger.add(winston.transports.Console, {
      colorize: true,
      prettyPrint: true,
      silent: this.silent,
      level: this.level
    });
  }
  else if (this.destination == 'udp') {
    require('winston-logstash-udp');
    this._logger.add(winston.transports.LogstashUDP, {
      port: this.port,
      appName: this.name,
      host: this.ip,
      silent: this.silent,
      level: this.level
    });
  }
  

  for (var ll in loglevels) {
    Logger.prototype[loglevels[ll]] = this._logger[loglevels[ll]];
  }
}






var logserver = exports.LogServer = function(name, options) {
  var dgram = require('dgram');
  options = options || {};
  this.uuid = Math.random().toString(36).slice(2);
  this.name = name || options.name || "LogServer";
  this.ip = options.ip || '0.0.0.0';
  this.port = options.port || 9514;
  this.level = (loglevels.indexOf(options.level.toLowerCase()) >= 0) ? options.level : 'info';
  this.showname = (options.showname == undefined) ? true : options.showname;
  this.destination = options.destination instanceof Array ?  options.destination : new Array(options.destination);

  var l = new logger(name);
  console.log(this);
}

