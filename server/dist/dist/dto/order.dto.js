"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SORTING = exports.statusList = exports.TABS = exports.STATUS = void 0;
const pdf = require("pdf-creator-node");
exports.default = pdf;
var STATUS;
(function (STATUS) {
    STATUS["WAITING"] = "WAITING";
    STATUS["REJECTED"] = "REJECTED";
    STATUS["ACCEPTED"] = "ACCEPTED";
    STATUS["DONE"] = "DONE";
})(STATUS = exports.STATUS || (exports.STATUS = {}));
var TABS;
(function (TABS) {
    TABS["DATE"] = "order/data";
    TABS["CITY"] = "orders/city";
    TABS["TOP_THREE"] = "top_3";
    TABS["MASTER_STATISTICS"] = "master_statistics";
})(TABS = exports.TABS || (exports.TABS = {}));
var statusList;
(function (statusList) {
    statusList["WAITING"] = "WAITING";
    statusList["REJECTED"] = "REJECTED";
    statusList["ACCEPTED"] = "ACCEPTED";
    statusList["DONE"] = "DONE";
})(statusList = exports.statusList || (exports.statusList = {}));
var SORTING;
(function (SORTING) {
    SORTING["MASTER_NAME"] = "masterName";
    SORTING["SIZE_NAME"] = "sizeName";
    SORTING["CITY_NAME"] = "cityName";
    SORTING["USER_ID"] = "userId";
    SORTING["DATE"] = "date";
    SORTING["CITY_PRICE"] = "cityPrice";
})(SORTING = exports.SORTING || (exports.SORTING = {}));
