import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import * as engine from "./soundscapes.js";

const KEY = "synapse:sound";
const readPref = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const writePref = (p) => { try { localStorage.setItem(KEY, JSON.stringify({ ...readPref(), ...p })); } catch { /* storage blocked */ } };

export const soundSource = (sound) => (sound.track === "upload" ? (sound.uploadUrl ? { url: sound.uploadUrl } : null) : sound.track || null);
export const soundLabel = (sound) => (sound.track === "upload" ? sound.uploadName || "Your audio" : engine.SOUND_BY_ID[sound.track]?.label || "Soundscape");

/*
 * Visitor-facing sound toggle. Sound is always off on load: playback starts only when the visitor presses play,
 * the site works fully without it, and the visitor's volume / last choice is remembered on this device.
 */
export default function SoundControl({ sound, rootRef }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVol] = useState(() => readPref().volume ?? sound.volume ?? 0.5);
  const src = soundSource(sound);
  const srcKey = typeof src === "string" ? src : src?.url;
  const ref = useRef(sound);
  useEffect(() => { ref.current = sound; }, [sound]);

  useEffect(() => engine.subscribe((st) => setPlaying(st.playing)), []);
  // A different track (theme change) stops what's playing; leaving the page stops it too.
  useEffect(() => () => engine.stop(ref.current.fadeOut ?? 1.5), [srcKey]);

  // Optional interaction cues on links and buttons while sound is on.
  useEffect(() => {
    const root = rootRef?.current;
    if (!root || !sound.sfx || !playing) return;
    const onClick = (e) => { if (e.target.closest("a, button")) engine.sfx("click", volume); };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [rootRef, sound.sfx, playing, volume]);

  if (!src || !engine.supported()) return null;
  const toggle = () => {
    if (playing) { engine.stop(sound.fadeOut ?? 1.5); writePref({ muted: true }); }
    else { engine.play(src, { volume, loop: sound.loop !== false, fadeIn: sound.fadeIn ?? 2 }); writePref({ muted: false }); }
  };
  const label = soundLabel(sound);
  return (
    <div className="syn-sound" role="group" aria-label="Background sound">
      <button type="button" onClick={toggle} aria-pressed={playing} aria-label={playing ? `Pause background sound (${label})` : `Play background sound (${label})`}
        title={sound.track === "upload" ? label : `${label} — generated live in your browser`}>
        {playing ? <Pause size={15} /> : <Play size={15} />}
        <span>{playing ? "Sound on" : "Play sound"}</span>
        {playing && <i className="syn-sound-bars" aria-hidden><b /><b /><b /></i>}
      </button>
      {playing && (
        <label className="syn-sound-vol">
          <Volume2 size={14} aria-hidden />
          <input type="range" min="0" max="1" step="0.05" value={volume} aria-label="Volume"
            onChange={(e) => { const v = +e.target.value; setVol(v); engine.setVolume(v); writePref({ volume: v }); }} />
        </label>
      )}
    </div>
  );
}
