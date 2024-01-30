import { items } from "openhab";
import { Item, Quantity } from "openhab/types/items/items";
import { ZonedDateTime } from "openhab/types/time"

/**
 * Export items proxy as any type to define it later on
 */
export const myitems = items as any;

/**
 * 
 * @param item 
 */
export const isValidState = (item: Item | null): boolean => {

  if (!item || item.isUninitialized) {
    return false;
  }

  const state = item.state;
  if (state == "UNDEF" || state == "NULL") {
    return false;
  }

  return true;
}

/**
 * 
 * @param item 
 * @param callback 
 */
export const getItem = (item: Item | string, callback?: (item: Item) => void): Item | null => {

  let itm: Item | null;

  if (typeof item == "string") {
    try {
      itm = items.getItem(item);

    } catch (e) {
      console.debug(`Unable to find item with name ${item} !`);
      itm = null;
    }
  } else {
    itm = item;
  }

  if (callback && itm) {
    callback(itm);
  }

  return itm;
}

/**
 * 
 * @param itemName 
 * @param callback 
 */
export const stateAsNumber = (itemName: Item | string, callback?: (value: number) => void): number => {
  let item = getItem(itemName);
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
}

export const statesAsNumber = (itemNames: Item[] | string[], callback: (values: number[]) => void): void => {

  const results: number[] = [];

  itemNames.forEach(element => {
    const v = stateAsNumber(element);
    if(isNaN(v)) {
      return;
    }

    results.push(v);
  });

  callback(results);
}

export const stateEquals = (itemName: Item | string | null | undefined, value: any) => {

  if(itemName == null || itemName == undefined) {
    return false;
  }

  const item = getItem(itemName);
  return item == value;
}

export const postUpdate = (item: Item | string, value: string | typeof ZonedDateTime | Quantity | HostState | number) => {
  const itm = getItem(item);
  if (itm) {
    itm.postUpdate(<any>value);
  } else {
    console.warn("postUpdate() failed, item \"{}\" not found!", item)
  }
}

/**
 * Sends a command to an item
 * @param item 
 * @param value 
 * @returns 
 */
export const sendCommand = (item: Item | string, value: string | typeof ZonedDateTime | Quantity | HostState | number) => {
  const itm = getItem(item);
  if (itm) {
    itm.sendCommand(<any>value);
  } else {
    console.warn("sendCommand() failed, item \"{}\" not found!", item)
  }

  return null;
}