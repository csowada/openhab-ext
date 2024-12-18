import { Item, Quantity } from "openhab/types/items/items";
import { ZonedDateTime } from "@js-joda/core";
/**
 * Export items proxy as any type to define it later on
 */
export declare const myitems: any;
/**
 *
 * @param item
 */
export declare const isValidState: (item: Item | null) => boolean;
/**
 *
 * @param item
 * @param callback
 */
export declare const getItem: (item: Item | string, callback?: (item: Item) => void) => Item | null;
/**
 *
 * @param itemName
 * @param callback
 */
export declare const stateAsNumber: (itemName: Item | string, callback?: (value: number) => void) => number;
export declare const statesAsNumber: (itemNames: Item[] | string[], callback: (values: number[]) => void) => void;
export declare const stateEquals: (itemName: Item | string | null | undefined, value: string) => boolean;
export declare const postUpdate: (item: Item | string, value: string | typeof ZonedDateTime | Quantity | HostState | number) => void;
/**
 * Sends a command to an item
 * @param item
 * @param value
 * @returns
 */
export declare const sendCommand: (item: Item | string, value: string | typeof ZonedDateTime | Quantity | HostState | number) => null;
