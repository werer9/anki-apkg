"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.APKG = void 0;
var Database = require("better-sqlite3");
var path_1 = require("path");
var sql_1 = require("./sql");
var fs_1 = require("fs");
var archiver = require("archiver");
var rimraf_1 = require("rimraf");
var APKG = /** @class */ (function () {
    function APKG(config) {
        this.config = config;
        this.dest = (0, path_1.join)(__dirname, config.name);
        this.clean();
        (0, fs_1.mkdirSync)(this.dest);
        this.db = new Database((0, path_1.join)(this.dest, 'collection.anki2'));
        this.deck = __assign(__assign({}, config), { id: +new Date() });
        (0, sql_1.initDatabase)(this.db, this.deck);
        this.mediaFiles = [];
    }
    APKG.prototype.addCard = function (card) {
        (0, sql_1.insertCard)(this.db, this.deck, card);
    };
    APKG.prototype.addMedia = function (filename, data) {
        var index = this.mediaFiles.length;
        this.mediaFiles.push(filename);
        (0, fs_1.writeFileSync)((0, path_1.join)(this.dest, "".concat(index)), data);
    };
    APKG.prototype.save = function (destination) {
        var directory = (0, path_1.join)(__dirname, this.config.name);
        var archive = archiver('zip');
        var mediaObj = this.mediaFiles.reduce(function (obj, file, idx) {
            obj[idx] = file;
            return obj;
        }, {});
        (0, fs_1.writeFileSync)((0, path_1.join)(this.dest, 'media'), JSON.stringify(mediaObj));
        archive.directory(directory, false);
        archive.pipe((0, fs_1.createWriteStream)((0, path_1.join)(destination, "".concat(this.config.name, ".apkg"))));
        archive.finalize();
        archive.on('end', this.clean.bind(this));
    };
    APKG.prototype.clean = function () {
        (0, rimraf_1.rimraf)(this.dest).then(function (r) { });
    };
    return APKG;
}());
exports.APKG = APKG;
