const eventCache = new Set<string>();

interface EventsFactory {
    setEvents: () => void;
}

export const eventsFactory = (setEvent: () => void): EventsFactory => {
    const sendEventToPostHog = (eventName: string) => {
        if (!eventCache.has(eventName)) {
            eventCache.add(eventName);
        } else {
            setEvent();
        }
    };

    const setEvents = () => {
        sendEventToPostHog("bouton_click");
    };

    return { setEvents };
};
