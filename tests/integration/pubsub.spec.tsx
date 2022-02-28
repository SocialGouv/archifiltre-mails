import { PubSub } from "@event/PubSub";

jest.mock(
    "electron",
    () => {
        const mockIpcMain = {
            on: jest.fn().mockReturnThis(),
        };
        return { app: { getLocale: () => "fr-FR" }, ipcMain: mockIpcMain };
    },
    {
        virtual: true,
    }
);

describe("PubSub", () => {
    it("should trigger events", async () => {
        const flag = jest.fn();
        const pubSub = PubSub.getInstance();
        const unsub = pubSub.subscribe("event.mock", flag);
        expect(flag).not.toHaveBeenCalled();
        pubSub.publish("event.mock", void 0);
        pubSub.publish("event.mock", void 0);
        expect(flag).toHaveBeenCalledTimes(2);
        unsub();
        pubSub.publish("event.mock", void 0);
        expect(flag).toHaveBeenCalledTimes(2);
        const flag2 = jest.fn();
        pubSub.subscribe("event.mock", flag2);
        await pubSub.uninit();
        pubSub.publish("event.mock");
        expect(flag2).not.toHaveBeenCalled();
    });
});
