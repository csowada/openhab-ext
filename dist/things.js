"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearAllLinkedThingItems = void 0;
const openhab_1 = require("openhab");
const items_1 = require("./items");
/**
 * Set all items to NULL for a given thing and its channels
 * @param thing
 */
const clearAllLinkedThingItems = (thing) => {
    const itemChannelLinkRegistry = openhab_1.osgi.getService("org.openhab.core.thing.link.ItemChannelLinkRegistry");
    const rawThing = thing.rawThing;
    openhab_1.utils.javaListToJsArray(rawThing.getChannels()).forEach(channel => {
        const linkedItems = openhab_1.utils.javaSetToJsArray(itemChannelLinkRegistry.getLinkedItems(channel.getUID()));
        linkedItems.forEach(item => {
            if (item.getState().toString() !== "UNDEF" && item.getState().toString() !== "NULL") {
                // console.info("     -xxx-->" + item.getName() + "-" + item.getState());
                (0, items_1.postUpdate)(item.getName(), "NULL");
            }
        });
    });
};
exports.clearAllLinkedThingItems = clearAllLinkedThingItems;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhpbmdzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3RoaW5ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFFckMsbUNBQXFDO0FBRXJDOzs7R0FHRztBQUNJLE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxLQUFZLEVBQUUsRUFBRTtJQUV2RCxNQUFNLHVCQUF1QixHQUFHLGNBQUksQ0FBQyxVQUFVLENBQUMscURBQXFELENBQUMsQ0FBQztJQUN2RyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBZSxDQUFDO0lBRXZDLGVBQUssQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDaEUsTUFBTSxXQUFXLEdBQUcsZUFBSyxDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLFdBQVcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDekIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxFQUFFLEtBQUssT0FBTyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsS0FBSyxNQUFNLEVBQUU7Z0JBQ25GLHlFQUF5RTtnQkFDekUsSUFBQSxrQkFBVSxFQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzthQUNwQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUE7QUFkWSxRQUFBLHdCQUF3Qiw0QkFjcEMifQ==