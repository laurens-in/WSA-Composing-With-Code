// source: https://www.typescriptbites.io/articles/pub-sub-in-typescript

export const createPubSub = <
  T extends Record<string, (...args: any[]) => void>
>() => {
  const eventMap = {} as Record<keyof T, Set<(...args: any[]) => void>>;

  return {
    emit: <K extends keyof T>(event: K, ...args: Parameters<T[K]>) => {
      (eventMap[event] ?? []).forEach((cb) => cb(...args));
    },

    on: <K extends keyof T>(event: K, callback: T[K]) => {
      if (!eventMap[event]) {
        eventMap[event] = new Set();
      }

      eventMap[event].add(callback);
    },

    off: <K extends keyof T>(event: K, callback: T[K]) => {
      if (!eventMap[event]) {
        return;
      }

      eventMap[event].delete(callback);
    },
  };
};

export const eventBus = createPubSub<{
  played: (id: string) => void;
}>();

// callback to toggle css class on node
export const nodeCallback = (nodeId: string, g: SVGElement) => {
  let timeoutId: number | undefined;
  eventBus.on("played", (id) => {
    if (id === nodeId) {
      if (timeoutId) clearTimeout(timeoutId);
      g.classList.add("playing");
      timeoutId = setTimeout(() => {
        g.classList.remove("playing");
        timeoutId = undefined;
      }, 200);
    }
  });
};
