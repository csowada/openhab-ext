"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCommand = exports.postUpdate = exports.stateEquals = exports.statesAsNumber = exports.stateAsNumber = exports.getItem = exports.isValidState = exports.myitems = void 0;
const openhab_1 = require("openhab");
/**
 * Export items proxy as any type to define it later on
 */
exports.myitems = openhab_1.items;
/**
 *
 * @param item
 */
const isValidState = (item) => {
    if (!item || item.isUninitialized) {
        return false;
    }
    const state = item.state;
    if (state == "UNDEF" || state == "NULL") {
        return false;
    }
    return true;
};
exports.isValidState = isValidState;
/**
 *
 * @param item
 * @param callback
 */
const getItem = (item, callback) => {
    let itm;
    if (typeof item == "string") {
        try {
            itm = openhab_1.items.getItem(item);
        }
        catch (e) {
            console.debug(`Unable to find item with name ${item} !`);
            itm = null;
        }
    }
    else {
        itm = item;
    }
    if (callback && itm) {
        callback(itm);
    }
    return itm;
};
exports.getItem = getItem;
/**
 *
 * @param itemName
 * @param callback
 */
const stateAsNumber = (itemName, callback) => {
    let item = (0, exports.getItem)(itemName);
    if (item) {
        let state = item.numericState;
        if (typeof state === "number") {
            if (callback) {
                callback(state);
            }
            return state;
        }
    }
    return NaN;
};
exports.stateAsNumber = stateAsNumber;
const statesAsNumber = (itemNames, callback) => {
    const results = [];
    itemNames.forEach(element => {
        const v = (0, exports.stateAsNumber)(element);
        if (isNaN(v)) {
            return;
        }
        results.push(v);
    });
    callback(results);
};
exports.statesAsNumber = statesAsNumber;
const stateEquals = (itemName, value) => {
    if (itemName == null || itemName == undefined) {
        return false;
    }
    const item = (0, exports.getItem)(itemName);
    if (typeof value == "number") {
        return item?.numericState == value;
    }
    return item?.state == value;
};
exports.stateEquals = stateEquals;
const postUpdate = (item, value) => {
    const itm = (0, exports.getItem)(item);
    if (itm) {
        itm.postUpdate(value);
    }
    else {
        console.warn("postUpdate() failed, item \"{}\" not found!", item);
    }
};
exports.postUpdate = postUpdate;
/**
 * Sends a command to an item
 * @param item
 * @param value
 * @returns
 */
const sendCommand = (item, value) => {
    const itm = (0, exports.getItem)(item);
    if (itm) {
        itm.sendCommand(value);
    }
    else {
        console.warn("sendCommand() failed, item \"{}\" not found!", item);
    }
    return null;
};
exports.sendCommand = sendCommand;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaXRlbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQWdDO0FBSWhDOztHQUVHO0FBQ1UsUUFBQSxPQUFPLEdBQUcsZUFBWSxDQUFDO0FBRXBDOzs7R0FHRztBQUNJLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBaUIsRUFBVyxFQUFFO0lBRXpELElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtRQUNqQyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUN6QixJQUFJLEtBQUssSUFBSSxPQUFPLElBQUksS0FBSyxJQUFJLE1BQU0sRUFBRTtRQUN2QyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDLENBQUE7QUFaWSxRQUFBLFlBQVksZ0JBWXhCO0FBRUQ7Ozs7R0FJRztBQUNJLE1BQU0sT0FBTyxHQUFHLENBQUMsSUFBbUIsRUFBRSxRQUErQixFQUFlLEVBQUU7SUFFM0YsSUFBSSxHQUFnQixDQUFDO0lBRXJCLElBQUksT0FBTyxJQUFJLElBQUksUUFBUSxFQUFFO1FBQzNCLElBQUk7WUFDRixHQUFHLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUUzQjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsSUFBSSxJQUFJLENBQUMsQ0FBQztZQUN6RCxHQUFHLEdBQUcsSUFBSSxDQUFDO1NBQ1o7S0FDRjtTQUFNO1FBQ0wsR0FBRyxHQUFHLElBQUksQ0FBQztLQUNaO0lBRUQsSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFO1FBQ25CLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNmO0lBRUQsT0FBTyxHQUFHLENBQUM7QUFDYixDQUFDLENBQUE7QUFyQlksUUFB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