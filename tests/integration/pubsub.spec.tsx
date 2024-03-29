import { PubSub } from "@event/PubSub";

describe("PubSub", () => {
    it("should trigger events", async () => {
        const eventId = "event.mock" as Any;
        const flag = jest.fn();
        const pubSub = PubSub.getInstance();
        const unsub = pubSub.subscribe(eventId, flag);
        expect(flag).not.toHaveBeenCalled();
        pubSub.publish(eventId, void 0);
        pubSub.publish(eventId, void 0);
        expect(flag).toHaveBeenCalledTimes(2);
        unsub();
        pubSub.publish(eventId, void 0);
        expect(flag).toHaveBeenCalledTimes(2);
        const flag2 = jest.fn();
        pubSub.subscribe(eventId, flag2);
        await pubSub.uninit();
        pubSub.publish(eventId);
        expect(flag2).not.toHaveBeenCalled();
    });
});
