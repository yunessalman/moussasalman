/* Home tweaks — mounts only the Tweaks panel and applies changes
   to the existing vanilla DOM. No visible React UI of its own. */

const HOME_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "marquee": false,
  "recognition": true,
  "palette": "cream"
}/*EDITMODE-END*/;

/* Each palette swaps the whole canvas — background tints, text/ink,
   hairlines and accent — so the paintings stay the stars. */
const PALETTES = {
  cream: {
    label: 'Warm cream (original)',
    vars: {
      '--paper':'#F5F2EC', '--paper-2':'#EEEAE0', '--paper-3':'#E7E2D6',
      '--ink':'#1B1813', '--ink-soft':'#403B32', '--ink-faint':'#6B645A',
      '--line':'rgba(27,24,19,0.14)', '--line-soft':'rgba(27,24,19,0.08)',
      '--accent':'oklch(0.46 0.10 42)', '--accent-deep':'oklch(0.38 0.09 40)'
    }
  },
  babyblue: {
    label: 'Baby blue',
    vars: {
      '--paper':'#EEF6FD', '--paper-2':'#E2EFFA', '--paper-3':'#D5E7F6',
      '--ink':'#15263E', '--ink-soft':'#33485F', '--ink-faint':'#5E7390',
      '--line':'rgba(21,38,62,0.14)', '--line-soft':'rgba(21,38,62,0.07)',
      '--accent':'oklch(0.58 0.13 245)', '--accent-deep':'oklch(0.48 0.12 245)'
    }
  },
  sky: {
    label: 'Bright sky',
    vars: {
      '--paper':'#FBFDFF', '--paper-2':'#EDF5FC', '--paper-3':'#DFEDF8',
      '--ink':'#142A4A', '--ink-soft':'#324a6b', '--ink-faint':'#5d749a',
      '--line':'rgba(20,42,74,0.13)', '--line-soft':'rgba(20,42,74,0.07)',
      '--accent':'oklch(0.60 0.15 250)', '--accent-deep':'oklch(0.50 0.14 250)'
    }
  },
  powder: {
    label: 'Powder periwinkle',
    vars: {
      '--paper':'#F1F3FC', '--paper-2':'#E7EAF7', '--paper-3':'#DADFF2',
      '--ink':'#1E2348', '--ink-soft':'#3a4068', '--ink-faint':'#676d96',
      '--line':'rgba(30,35,72,0.13)', '--line-soft':'rgba(30,35,72,0.07)',
      '--accent':'oklch(0.57 0.14 278)', '--accent-deep':'oklch(0.47 0.13 278)'
    }
  },
  teal: {
    label: 'Fresh aqua',
    vars: {
      '--paper':'#EDF8F7', '--paper-2':'#E0F1EF', '--paper-3':'#D2E9E6',
      '--ink':'#0F2E2C', '--ink-soft':'#2f4f4c', '--ink-faint':'#5a7a76',
      '--line':'rgba(15,46,44,0.13)', '--line-soft':'rgba(15,46,44,0.07)',
      '--accent':'oklch(0.58 0.12 200)', '--accent-deep':'oklch(0.48 0.11 200)'
    }
  }
};

function HomeTweaks() {
  const [t, setTweak] = useTweaks(HOME_TWEAK_DEFAULTS);

  // Moving titles strip (the marquee)
  React.useEffect(() => {
    const m = document.querySelector('.marquee');
    if (m) m.style.display = t.marquee ? '' : 'none';
  }, [t.marquee]);

  // Recognition band
  React.useEffect(() => {
    const r = document.querySelector('.recognition');
    if (r) r.style.display = t.recognition ? '' : 'none';
  }, [t.recognition]);

  // Palette — set every canvas variable at the root
  React.useEffect(() => {
    const p = PALETTES[t.palette] || PALETTES.babyblue;
    const root = document.documentElement;
    Object.entries(p.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [t.palette]);

  return (
    <TweaksPanel>
      <TweakSection label="Palette" />
      <TweakSelect label="Colour theme" value={t.palette}
                   options={Object.keys(PALETTES).map((k) => ({ value: k, label: PALETTES[k].label }))}
                   onChange={(v) => setTweak('palette', v)} />
      <TweakSection label="Homepage" />
      <TweakToggle label="Moving titles strip" value={t.marquee}
                   onChange={(v) => setTweak('marquee', v)} />
      <TweakToggle label="Recognition band" value={t.recognition}
                   onChange={(v) => setTweak('recognition', v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('tweaks-root')).render(<HomeTweaks />);
