import { utils, osgi } from "openhab"
import { Thing } from "openhab/types/things"
import { postUpdate } from "./items";

/**
 * Set all items to NULL for a given thing and its channels
 * @param thing 
 */
export const clearAllLinkedThingItems = (thing: Thing) => {

  const itemChannelLinkRegistry = osgi.getService("org.openhab.core.thing.link.ItemChannelLinkRegistry");
  const rawThing = thing.rawThing as any;

  utils.javaListToJsArray(rawThing.getChannels()).forEach(channel => {
    const linkedItems = utils.javaSetToJsArray(itemChannelLinkRegistry.getLinkedItems(channel.getUID()));
    linkedItems.forEach(item => {
      if (item.getState().toString() !== "UNDEF" && item.getState().toString() !== "NULL") {
        // console.info("     -xxx-->" + item.getName() + "-" + item.getState());
        postUpdate(item.getName(), "NULL");
      }
    });
  });
}