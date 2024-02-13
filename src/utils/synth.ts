import { eventBus } from "./pubsub";
import { midiToFreq } from "./conversions";
import { UndirectedGraph } from "../tree";

const ctx = new AudioContext();

export const playNote = (n: number, duration = 0.3) => {
  const carrier = ctx.createOscillator();
  carrier.type = "sine";
  carrier.frequency.setValueAtTime(midiToFreq(n), ctx.currentTime);

  const modulator = ctx.createOscillator();
  modulator.type = "sine";
  modulator.frequency.setValueAtTime(midiToFreq(n) * 0.5, ctx.currentTime);

  const modAmp = ctx.createGain();
  modAmp.gain.setValueAtTime(400, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.95, ctx.currentTime + duration * 0.1);
  gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + duration * 0.8);
  gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + duration * 0.95);

  carrier.connect(gain);
  modulator.connect(modAmp);
  modAmp.connect(carrier.detune);
  gain.connect(ctx.destination);
  carrier.start(ctx.currentTime);
  modulator.start(ctx.currentTime);
  carrier.stop(ctx.currentTime + duration);
  modulator.stop(ctx.currentTime + duration);
};

export const playSequence = (
  ns: number[],
  duration = 0.3,
  speed = 1,
  count = 0
) => {
  if (count === ns.length) return;
  playNote(ns[count], duration);
  eventBus.emit("played", ns[count].toString()); // just to see which note is playing
  setTimeout(() => {
    playSequence(ns, duration, speed, count + 1);
  }, (speed - duration) * 1000);
};

export const playSequenceWeighted = (
  ns: number[],
  duration = 0.3,
  speed = 1,
  count = 0
) => {
  if (count === ns.length) return;
  playNote(ns[count], duration);
  eventBus.emit("played", ns[count].toString()); // just to see which note is playing
  setTimeout(() => {
    playSequenceWeighted(ns, duration, speed, count + 1);
  }, ((speed - duration) * 1000) / ((count + 1) * 0.25));
};

export const playSequenceAsync = (
  ns: number[],
  duration = 0.3,
  speed = 1,
  count = 0
): Promise<void> => {
  return new Promise<void>((resolve) => {
    const playNextNote = (index: number) => {
      if (index === ns.length) {
        resolve();
        return;
      }
      playNote(ns[index], duration);
      eventBus.emit("played", ns[index].toString());
      setTimeout(() => {
        playNextNote(index + 1);
        // }, ((speed - duration) * 1000) / ((index + 1) * 0.25));
      }, (speed - duration) * 1000);
    };
    playNextNote(count);
  });
};

export const loopSequences = (ns: number[][]) => {
  const playNextSequence = () => {
    const currentSequence = ns[Math.floor(Math.random() * ns.length)];
    playSequenceAsync(currentSequence, 0.2, 0.4).then(() => {
      playNextSequence();
    });
  };
  playNextSequence();
};

export const createLooper = (ns: number[][]) => {
  let play = true;
  const loopSequences = (ns: number[][]) => {
    const playNextSequence = () => {
      if (!play) return;
      const currentSequence = ns[Math.floor(Math.random() * ns.length)];
      playSequenceAsync(currentSequence, 0.15, 0.25).then(() => {
        playNextSequence();
      });
    };
    playNextSequence();
  };
  return [
    () => {
      play = true;
      loopSequences(ns);
    },
    () => {
      play = false;
    },
  ];
};

export const createLooperGraph = (g: UndirectedGraph) => {
  console.log("i go");
  let play = true;
  const startingPoint = parseInt(Object.keys(g)[0]);
  const walkGraph = (node: number) => {
    const notes = g[node];
    const nextNote = notes[Math.floor(Math.random() * notes.length)];
    playNote(nextNote, 0.3);
    eventBus.emit("played", nextNote.toString()); // just to see which note is playing
    if (!play) return;
    setTimeout(() => walkGraph(nextNote), 300);
  };
  return [
    () => {
      play = true;
      walkGraph(startingPoint);
    },
    () => {
      play = false;
    },
  ];
};
