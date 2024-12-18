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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaXRlbXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscUNBQWdDO0FBS2hDOztHQUVHO0FBQ1UsUUFBQSxPQUFPLEdBQUcsZUFBWSxDQUFDO0FBRXBDOzs7R0FHRztBQUNJLE1BQU0sWUFBWSxHQUFHLENBQUMsSUFBaUIsRUFBVyxFQUFFO0lBRXpELElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ2xDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDekIsSUFBSSxLQUFLLElBQUksT0FBTyxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUN4QyxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQTtBQVpZLFFBQUEsWUFBWSxnQkFZeEI7QUFFRDs7OztHQUlHO0FBQ0ksTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFtQixFQUFFLFFBQStCLEVBQWUsRUFBRTtJQUUzRixJQUFJLEdBQWdCLENBQUM7SUFFckIsSUFBSSxPQUFPLElBQUksSUFBSSxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUM7WUFDSCxHQUFHLEdBQUcsZUFBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU1QixDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsaUNBQWlDLElBQUksSUFBSSxDQUFDLENBQUM7WUFDekQsR0FBRyxHQUFHLElBQUksQ0FBQztRQUNiLENBQUM7SUFDSCxDQUFDO1NBQU0sQ0FBQztRQUNOLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSSxRQUFRLElBQUksR0FBRyxFQUFFLENBQUM7UUFDcEIsUUFBUSxDQUFD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