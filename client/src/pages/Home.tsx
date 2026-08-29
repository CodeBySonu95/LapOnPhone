/*
 * Windows Simulator chapter reminder: this is a practice computer, not a lesson poster.
 * Make the simulated desktop the hero, let keyboard actions drive visible state changes,
 * keep chapter missions concrete, and use coral for the next action with teal for completion.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Copy,
  FileText,
  Folder,
  Globe2,
  HardDrive,
  HelpCircle,
  Keyboard,
  LockKeyhole,
  Maximize2,
  Menu,
  Monitor,
  MousePointer2,
  Play,
  Power,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wifi,
  PanelsTopLeft,
  X,
  Zap,
} from "lucide-react";

const BRAND_MARK = "/manus-storage/typing-yatra-mark_fa278fa1.png";

type ChapterId = "desktop" | "notepad" | "explorer" | "browser";
type MissionStep = { key: string; title: string; detail: string };

type Chapter = {
  id: ChapterId;
  number: string;
  title: string;
  subtitle: string;
  app: string;
  icon: typeof Monitor;
  color: "coral" | "blue" | "green" | "gold";
  intro: string;
  steps: MissionStep[];
  shortcut: string;
};

const chapters: Chapter[] = [
  {
    id: "desktop",
    number: "01",
    title: "Desktop Basics",
    subtitle: "Windows, Start menu & window control",
    app: "Desktop",
    icon: Monitor,
    color: "coral",
    intro: "अपने पहले virtual computer में एक छोटी यात्रा करें। Start menu खोलें, selection घुमाएं, एक window खोलें और Esc से वापस desktop पर आएं।",
    steps: [
      { key: "Windows", title: "Start menu खोलें", detail: "keyboard पर Windows key दबाएं" },
      { key: "↓", title: "Selection नीचे ले जाएं", detail: "Arrow Down से app चुनें" },
      { key: "Enter", title: "App खोलें", detail: "Enter से selected window launch करें" },
      { key: "Esc", title: "Desktop पर लौटें", detail: "Esc से window बंद करें" },
    ],
    shortcut: "Windows → ↓ → Enter → Esc",
  },
  {
    id: "notepad",
    number: "02",
    title: "Write in Notepad",
    subtitle: "Type, select, copy & paste",
    app: "Notepad",
    icon: FileText,
    color: "blue",
    intro: "एक छोटी note लिखें और फिर shortcuts से उसे select, copy और paste करें। यही computer पर रोज़ होने वाले काम की असली practice है।",
    steps: [
      { key: "Type", title: "Note लिखें", detail: "नीचे Notepad में वाक्य पूरा टाइप करें" },
      { key: "Ctrl + A", title: "सब select करें", detail: "पूरा note एक साथ चुनें" },
      { key: "Ctrl + C", title: "Copy करें", detail: "selected text की copy बनाएं" },
      { key: "Ctrl + V", title: "Paste करें", detail: "copy को दूसरी line में लगाएं" },
    ],
    shortcut: "Ctrl + A  ·  Ctrl + C  ·  Ctrl + V",
  },
  {
    id: "explorer",
    number: "03",
    title: "Manage Files",
    subtitle: "Explorer, folders, rename & Delete",
    app: "File Explorer",
    icon: Folder,
    color: "green",
    intro: "File Explorer में address bar पर जाएं, Documents folder खोलें, एक file चुनें और F2 तथा Delete का सुरक्षित अभ्यास करें।",
    steps: [
      { key: "Ctrl + L", title: "Address bar चुनें", detail: "folder path लिखने की जगह खोलें" },
      { key: "Type", title: "Documents लिखें", detail: "path में Documents टाइप करें" },
      { key: "Enter", title: "Folder खोलें", detail: "address को confirm करें" },
      { key: "F2 / Delete", title: "File manage करें", detail: "rename और recycle का अभ्यास" },
    ],
    shortcut: "Ctrl + L  ·  Enter  ·  F2  ·  Delete",
  },
  {
    id: "browser",
    number: "04",
    title: "Browser Mission",
    subtitle: "Tabs, address bar & back",
    app: "Browser",
    icon: Globe2,
    color: "gold",
    intro: "Browser में address bar, search, new tab और back navigation का इस्तेमाल करके एक छोटा research task पूरा करें।",
    steps: [
      { key: "Ctrl + L", title: "Address bar चुनें", detail: "current address select हो जाएगा" },
      { key: "Type", title: "Search लिखें", detail: "typing practice लिखें" },
      { key: "Enter", title: "Search चलाएं", detail: "simulated result खोलें" },
      { key: "Ctrl + T / Alt + ←", title: "Tab और back", detail: "नई tab और पिछला page देखें" },
    ],
    shortcut: "Ctrl + L  ·  Enter  ·  Ctrl + T  ·  Alt + ←",
  },
];

const chapterKeyGroups: Record<ChapterId, string[]> = {
  desktop: ["Win", "↓", "Enter", "Esc"],
  notepad: ["Ctrl", "A", "C", "V"],
  explorer: ["Ctrl", "L", "F2", "Del"],
  browser: ["Ctrl", "L", "T", "Alt ←"],
};

const virtualKeyRows = [
  ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps Lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Fn", "Win", "Alt", "Space", "Alt", "Ctrl", "←", "↑", "↓", "→"],
];

const taskbarApps = [
  { label: "Explorer", icon: Folder },
  { label: "Notepad", icon: FileText },
  { label: "Browser", icon: Globe2 },
];

const normalizeKey = (event: KeyboardEvent) => {
  if (event.metaKey && event.key.toLowerCase() === "a") return "Ctrl+A";
  if (event.metaKey && event.key.toLowerCase() === "c") return "Ctrl+C";
  if (event.metaKey && event.key.toLowerCase() === "v") return "Ctrl+V";
  if (event.ctrlKey && event.key.toLowerCase() === "a") return "Ctrl+A";
  if (event.ctrlKey && event.key.toLowerCase() === "c") return "Ctrl+C";
  if (event.ctrlKey && event.key.toLowerCase() === "v") return "Ctrl+V";
  if (event.ctrlKey && event.key.toLowerCase() === "l") return "Ctrl+L";
  if (event.ctrlKey && event.key.toLowerCase() === "t") return "Ctrl+T";
  if (event.altKey && event.key === "ArrowLeft") return "Alt+Left";
  if (event.key === "Meta" || event.key === "OS") return "Windows";
  if (event.key === "ArrowDown") return "ArrowDown";
  if (event.key === "ArrowUp") return "ArrowUp";
  if (event.key === "ArrowLeft") return "ArrowLeft";
  if (event.key === "ArrowRight") return "ArrowRight";
  if (event.key === " ") return "Space";
  return event.key.length === 1 ? event.key : event.key;
};

export default function Home() {
  const [activeChapter, setActiveChapter] = useState<ChapterId>("desktop");
  const [completedChapters, setCompletedChapters] = useState<ChapterId[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [startOpen, setStartOpen] = useState(false);
  const [startSelection, setStartSelection] = useState(0);
  const [activeWindow, setActiveWindow] = useState<"settings" | "notepad" | "explorer" | "browser" | null>(null);
  const [notice, setNotice] = useState("Simulator ready — your next action is highlighted.");
  const [pulseKey, setPulseKey] = useState("");
  const [heldKeys, setHeldKeys] = useState<string[]>([]);
  const [touchpadMessage, setTouchpadMessage] = useState("Touchpad ready");
  const [notepadText, setNotepadText] = useState("");
  const [notepadPasteCount, setNotepadPasteCount] = useState(0);
  const [explorerPath, setExplorerPath] = useState("This PC");
  const [explorerAddressFocused, setExplorerAddressFocused] = useState(false);
  const [explorerFileState, setExplorerFileState] = useState<"ready" | "renamed" | "deleted">("ready");
  const [browserUrl, setBrowserUrl] = useState("typing-yatra.local");
  const [browserAddressFocused, setBrowserAddressFocused] = useState(false);
  const [browserSearched, setBrowserSearched] = useState(false);
  const [browserTabCount, setBrowserTabCount] = useState(1);
  const chapter = chapters.find((item) => item.id === activeChapter) ?? chapters[0];
  const currentStep = chapter.steps[stepIndex];
  const chapterComplete = completedChapters.includes(activeChapter);

  const resetChapter = useCallback(() => {
    setStepIndex(0);
    setStartOpen(false);
    setStartSelection(0);
    setActiveWindow(activeChapter === "notepad" ? "notepad" : activeChapter === "explorer" ? "explorer" : activeChapter === "browser" ? "browser" : null);
    setNotice("Simulator ready — next action नीचे दिख रही है।");
    setPulseKey("");
    setHeldKeys([]);
    setTouchpadMessage("Touchpad ready");
    setNotepadText("");
    setNotepadPasteCount(0);
    setExplorerPath("This PC");
    setExplorerAddressFocused(false);
    setExplorerFileState("ready");
    setBrowserUrl("typing-yatra.local");
    setBrowserAddressFocused(false);
    setBrowserSearched(false);
    setBrowserTabCount(1);
  }, [activeChapter]);

  const selectChapter = (id: ChapterId) => {
    setActiveChapter(id);
    const nextWindow = id === "notepad" ? "notepad" : id === "explorer" ? "explorer" : id === "browser" ? "browser" : null;
    setActiveWindow(nextWindow);
    setStepIndex(0);
    setStartOpen(false);
    setNotice("Chapter खुल गया — पहले task से शुरू करें।");
    setHeldKeys([]);
    setTouchpadMessage("Touchpad ready");
    setNotepadText("");
    setNotepadPasteCount(0);
    setExplorerPath("This PC");
    setExplorerAddressFocused(false);
    setExplorerFileState("ready");
    setBrowserUrl("typing-yatra.local");
    setBrowserAddressFocused(false);
    setBrowserSearched(false);
    setBrowserTabCount(1);
  };

  const completeIfNeeded = (nextIndex: number) => {
    if (nextIndex >= chapter.steps.length) {
      setCompletedChapters((items) => items.includes(activeChapter) ? items : [...items, activeChapter]);
      setStepIndex(chapter.steps.length - 1);
      setNotice("Chapter complete — आपने task keyboard से पूरा किया। अगला chapter चुनें।");
      return true;
    }
    setStepIndex(nextIndex);
    return false;
  };

  const registerDesktopKey = useCallback((key: string) => {
    setPulseKey(key);
    window.setTimeout(() => setPulseKey(""), 150);
    if (activeChapter !== "desktop" || chapterComplete) return;
    const expected = ["Windows", "ArrowDown", "Enter", "Escape"][stepIndex];
    if (key !== expected) {
      setNotice(`अभी ${currentStep?.key ?? "अगली key"} चाहिए — धीरे दबाएं, कोई जल्दी नहीं।`);
      return;
    }
    if (key === "Windows") {
      setStartOpen(true);
      setNotice("Start menu खुल गया। अब ↓ से selection नीचे ले जाएं।");
    }
    if (key === "ArrowDown") {
      setStartSelection((value) => Math.min(value + 1, 3));
      setNotice("Selection नीचे आ गई। अब Enter दबाकर Settings खोलें।");
    }
    if (key === "Enter") {
      setStartOpen(false);
      setActiveWindow("settings");
      setNotice("Settings window खुली। Esc दबाकर वापस desktop पर आएं।");
    }
    if (key === "Escape") {
      setActiveWindow(null);
      setStartOpen(false);
      setNotice("बहुत बढ़िया — आपने desktop window control कर लिया।");
    }
    completeIfNeeded(stepIndex + 1);
  }, [activeChapter, chapterComplete, completeIfNeeded, currentStep?.key, stepIndex]);

  const registerNotepadKey = (key: string) => {
    setPulseKey(key);
    window.setTimeout(() => setPulseKey(""), 150);
    if (activeChapter !== "notepad" || chapterComplete) return;
    if (stepIndex === 0) {
      if (key === "Ctrl+A" && notepadText.trim().length >= 28) {
        setNotice("पूरा note select है। अब Ctrl + C से copy करें।");
        completeIfNeeded(2);
      } else if (notepadText.trim().length < 28) {
        setNotice("पहले note को थोड़ा और पूरा टाइप करें, फिर Ctrl + A दबाएं।");
      }
      return;
    }
    const expected = ["Ctrl+A", "Ctrl+C", "Ctrl+V"][stepIndex - 1];
    if (key !== expected) {
      setNotice(`इस step में ${expected} दबाएं — shortcut को साथ में पकड़ें।`);
      return;
    }
    if (key === "Ctrl+A") setNotice("पूरा note select है। अब Ctrl + C से copy करें।");
    if (key === "Ctrl+C") setNotice("Note clipboard में copy हो गया। अब Ctrl + V दबाएं।");
    if (key === "Ctrl+V") {
      setNotepadPasteCount((value) => value + 1);
      setNotice("Paste हो गया — आपने Notepad mission पूरा किया।");
    }
    completeIfNeeded(stepIndex + 1);
  };

  const registerExplorerKey = (key: string) => {
    setPulseKey(key);
    window.setTimeout(() => setPulseKey(""), 150);
    if (activeChapter !== "explorer" || chapterComplete) return;
    const expected = ["Ctrl+L", "Enter", "F2", "Delete"][stepIndex];
    if (key !== expected) {
      setNotice(`अभी ${expected} चाहिए — Explorer में task क्रम से पूरा करें।`);
      return;
    }
    if (key === "Ctrl+L") {
      setExplorerAddressFocused(true);
      setNotice("Address bar select है। Documents लिखकर Enter दबाएं।");
    }
    if (key === "Enter") {
      setExplorerAddressFocused(false);
      setExplorerPath("Documents");
      setNotice("Documents folder खुल गया। अब F2 से selected file rename करें।");
    }
    if (key === "F2") {
      setExplorerFileState("renamed");
      setNotice("File rename mode पूरा। अब Delete दबाकर Recycle Bin भेजें।");
    }
    if (key === "Delete") {
      setExplorerFileState("deleted");
      setNotice("File Recycle Bin में चली गई — Explorer mission पूरा।");
    }
    completeIfNeeded(stepIndex + 1);
  };

  const registerBrowserKey = (key: string) => {
    setPulseKey(key);
    window.setTimeout(() => setPulseKey(""), 150);
    if (activeChapter !== "browser" || chapterComplete) return;
    const expected = ["Ctrl+L", "Enter", "Ctrl+T", "Alt+Left"][stepIndex];
    if (key !== expected) {
      setNotice(`अभी ${expected} चाहिए — browser navigation को एक-एक करके करें।`);
      return;
    }
    if (key === "Ctrl+L") {
      setBrowserAddressFocused(true);
      setNotice("Address bar select है। कोई search लिखें और Enter दबाएं।");
    }
    if (key === "Enter") {
      setBrowserAddressFocused(false);
      setBrowserSearched(true);
      setNotice("Search results आ गए। अब Ctrl + T से नई tab खोलें।");
    }
    if (key === "Ctrl+T") {
      setBrowserTabCount((value) => value + 1);
      setNotice("नई tab खुल गई। अब Alt + ← से वापस जाएं।");
    }
    if (key === "Alt+Left") {
      setBrowserSearched(false);
      setNotice("Back navigation सही चला — browser mission complete।");
    }
    completeIfNeeded(stepIndex + 1);
  };

  const handleGlobalKey = useCallback((event: KeyboardEvent) => {
    const target = event.target as HTMLElement | null;
    if (target?.tagName === "TEXTAREA" || target?.tagName === "INPUT") return;
    const key = normalizeKey(event);
    if (["Windows", "ArrowDown", "Enter", "Escape", "Ctrl+L", "F2", "Delete", "Ctrl+T", "Alt+Left"].includes(key) || (activeChapter === "desktop" && key.length === 1)) {
      event.preventDefault();
    }
    if (activeChapter === "desktop") registerDesktopKey(key);
    if (activeChapter === "explorer") registerExplorerKey(key);
    if (activeChapter === "browser") registerBrowserKey(key);
  }, [activeChapter, registerBrowserKey, registerDesktopKey, registerExplorerKey]);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [handleGlobalKey]);

  const handleNotepadKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.ctrlKey || event.metaKey) {
      const key = normalizeKey(event.nativeEvent);
      event.preventDefault();
      registerNotepadKey(key);
    }
  };

  const handleExplorerAddressKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      registerExplorerKey("Enter");
    }
  };

  const handleBrowserAddressKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      registerBrowserKey("Enter");
    }
  };

  const virtualAction = (label: string) => {
    if (label === "Win") return "Windows";
    if (label === "↓") return "ArrowDown";
    if (label === "↑") return "ArrowUp";
    if (label === "←") return "ArrowLeft";
    if (label === "→") return "ArrowRight";
    if (label === "Del") return "Delete";
    if (label === "Space") return "Space";
    if (label === "Esc") return "Escape";
    return label;
  };

  const handleVirtualKey = (label: string) => {
    setPulseKey(label);
    window.setTimeout(() => setPulseKey(""), 150);
    const modifiers = ["Ctrl", "Alt", "Shift", "Win"];
    if (label === "Win" && activeChapter === "desktop" && stepIndex === 0) {
      registerDesktopKey("Windows");
      return;
    }
    if (modifiers.includes(label)) {
      setHeldKeys((current) => current.includes(label) ? current.filter((item) => item !== label) : [...current, label]);
      setNotice(heldKeys.includes(label) ? `${label} released.` : `${label} held — now click the next key to make a shortcut.`);
      return;
    }
    const action = virtualAction(label);
    const modifier = heldKeys.includes("Ctrl") ? "Ctrl" : heldKeys.includes("Alt") ? "Alt" : heldKeys.includes("Win") ? "Win" : heldKeys.includes("Shift") ? "Shift" : "";
    const chord = modifier ? `${modifier}+${action}` : action;
    setHeldKeys([]);

    if (activeChapter === "desktop") registerDesktopKey(chord);
    if (activeChapter === "explorer") registerExplorerKey(chord);
    if (activeChapter === "browser") registerBrowserKey(chord);
    if (activeChapter === "notepad") {
      if (modifier) {
        registerNotepadKey(chord);
      } else if (!chapterComplete) {
        if (action === "Backspace") setNotepadText((value) => value.slice(0, -1));
        else if (action === "Enter") setNotepadText((value) => `${value}\\n`);
        else if (action === "Space") setNotepadText((value) => `${value} `);
        else if (action.length === 1) setNotepadText((value) => `${value}${action}`);
        setNotice("Virtual keyboard input added. Keep typing until the note is complete.");
      }
    }
  };

  const handleTouchpad = (action: string) => {
    setTouchpadMessage(action === "double" ? "Double-click registered" : action === "right" ? "Right-click registered" : "Click registered");
    setNotice(`${action === "double" ? "Double-click" : action === "right" ? "Right-click" : "Click"} detected on the practice touchpad.`);
  };

  const lessonProgress = Math.round((stepIndex / chapter.steps.length) * 100);
  const nextDisplay = chapter.id === "desktop" ? currentStep?.key : chapter.id === "notepad" && stepIndex === 0 ? "TYPE" : currentStep?.key;
  const completedCount = completedChapters.length;

  const stageTitle = useMemo(() => {
    if (activeWindow === "settings") return "Settings";
    if (activeWindow === "notepad") return "Notepad";
    if (activeWindow === "explorer") return "File Explorer";
    if (activeWindow === "browser") return "Browser";
    return "Desktop";
  }, [activeWindow]);

  return (
    <div className="simulator-app">
      <header className="sim-topbar">
        <a className="sim-brand" href="#simulator" aria-label="Typing Yatra simulator home">
          <span className="sim-brand-mark"><img src={BRAND_MARK} alt="" /></span>
          <span><strong>typing</strong><em>yatra</em></span>
          <i>SIMULATOR</i>
        </a>
        <div className="sim-topbar-right"><span className="online-indicator"><span /> practice mode on</span><button className="help-button" aria-label="Help"><CircleHelp size={17} /></button><span className="sim-avatar">A</span></div>
      </header>

      <main id="simulator" className="sim-layout">
        <aside className="chapter-rail">
          <div className="rail-label">YOUR COMPUTER COURSE</div>
          <div className="course-title"><h1>Computer<br /><i>practice.</i></h1><p>Learn by doing. हर chapter एक real laptop task है।</p></div>
          <div className="course-meter"><div><span>COURSE PROGRESS</span><strong>{completedCount} / 4 complete</strong></div><div className="course-meter-track"><span style={{ width: `${(completedCount / 4) * 100}%` }} /></div></div>
          <nav className="chapter-list" aria-label="Course chapters">
            <span className="chapter-list-label">CHAPTERS <em>click to practice</em></span>
            {chapters.map((item) => {
              const Icon = item.icon;
              const selected = item.id === activeChapter;
              const done = completedChapters.includes(item.id);
              return <button key={item.id} className={`chapter-link ${selected ? "selected" : ""} ${done ? "done" : ""}`} onClick={() => selectChapter(item.id)}>
                <span className={`chapter-icon ${item.color}`}><Icon size={16} /></span>
                <span className="chapter-copy"><small>CHAPTER {item.number}</small><strong>{item.title}</strong><em>{item.subtitle}</em></span>
                <span className="chapter-state">{done ? <Check size={13} /> : selected ? <ChevronRight size={15} /> : <span className="tiny-line" />}</span>
              </button>;
            })}
            <div className="future-chapter"><span className="future-icon"><LockKeyhole size={14} /></span><span><small>CHAPTER 05</small><strong>Daily mission</strong><em>unlock after all chapters</em></span></div>
          </nav>
          <div className="rail-note"><Sparkles size={15} /><span><strong>Keyboard rule</strong><br />Use the keyboard first, mouse second.</span></div>
        </aside>

        <section className="simulator-column">
          <div className="sim-heading"><div><div className="sim-kicker"><span className="red-dot" /> WINDOWS SIMULATOR <span className="slash">/</span> {chapter.app.toUpperCase()}</div><h2>{chapter.title}</h2></div><button className="reset-button" onClick={resetChapter}><RotateCcw size={15} /> reset chapter</button></div>

          <div className="desktop-shell" aria-label="Windows simulator workspace">
            <div className="desktop-topline"><span><span className="window-led" /> typing-yatra.local</span><span className="desktop-topline-center">{stageTitle} · Practice Environment</span><span><ShieldCheck size={13} /> safe simulation</span></div>
            <div className="desktop-stage">
              <div className="wallpaper-mark"><div className="window-logo"><span /><span /><span /><span /></div><strong>typing yatra</strong><small>learn by doing</small></div>
              <div className="desktop-icons">
                <button onClick={() => setNotice("This PC icon अभी सिर्फ़ keyboard mission से खुलेगा।")}><span className="desktop-icon-box"><HardDrive size={22} /></span><small>This PC</small></button>
                <button onClick={() => setNotice("Documents icon खोलने के लिए Chapter 03 चुनें।")}><span className="desktop-icon-box folder"><Folder size={22} /></span><small>Documents</small></button>
                <button onClick={() => setNotice("Recycle Bin खाली है। Delete mission में file यहां आएगी।")}><span className="desktop-icon-box"><Trash2 size={22} /></span><small>Recycle Bin</small></button>
              </div>

              {activeWindow === null && <div className="desktop-hint"><MousePointer2 size={14} /><span>यह आपका virtual desktop है<br /><strong>next action: {nextDisplay}</strong></span></div>}

              {startOpen && <div className="start-menu"><div className="start-search"><Search size={14} /><span>Type here to search</span></div><div className="start-menu-title"><span>pinned</span><span>all apps <ChevronRight size={12} /></span></div><div className="start-apps">{["Settings", "Notepad", "File Explorer", "Browser"].map((item, index) => <button key={item} className={index === startSelection ? "selected" : ""}><span>{index === 0 ? <Settings size={15} /> : index === 1 ? <FileText size={15} /> : index === 2 ? <Folder size={15} /> : <Globe2 size={15} />}</span>{item}</button>)}</div><div className="start-footer"><span><span className="mini-user">A</span> learner</span><Power size={14} /></div></div>}

              {activeWindow === "settings" && <div className="fake-window settings-window"><div className="fake-window-bar"><span><Settings size={13} /> Settings</span><div><button><Maximize2 size={12} /></button><button onClick={() => setActiveWindow(null)}><X size={14} /></button></div></div><div className="settings-body"><div className="settings-sidebar"><strong>Settings</strong><span className="setting-selected"><Monitor size={13} /> System</span><span><Wifi size={13} /> Network</span><span><ShieldCheck size={13} /> Privacy</span></div><div className="settings-content"><span className="settings-breadcrumb">System &gt; About</span><h3>Welcome to your PC</h3><p>आपने keyboard से Settings window खोली है। अब Esc दबाकर desktop पर लौटें।</p><div className="setting-card"><Monitor size={20} /><span><strong>Practice PC</strong><small>Typing Yatra Virtual Machine</small></span><Check size={16} /></div></div></div></div>}

              {activeWindow === "notepad" && <div className="fake-window notepad-window"><div className="fake-window-bar"><span><FileText size={13} /> Untitled — Notepad</span><div><button><Maximize2 size={12} /></button><button onClick={() => setActiveWindow(null)}><X size={14} /></button></div></div><div className="notepad-menu"><span>File</span><span>Edit</span><span>View</span><span>Help</span><span className="notepad-save"><Check size={11} /> auto-save</span></div><textarea value={notepadText} onChange={(event) => { setNotepadText(event.target.value); if (event.target.value.trim().length >= 28 && stepIndex === 0) setNotice("Note तैयार है। अब Ctrl + A से पूरा text select करें।"); }} onKeyDown={handleNotepadKeyDown} placeholder="यहां अपना practice note टाइप करें..." aria-label="Notepad practice area" autoFocus /><div className="notepad-status"><span>Ln 1, Col {notepadText.length + 1}</span><span>{notepadPasteCount > 0 ? "Copied & pasted" : "UTF-8"}</span></div></div>}

              {activeWindow === "explorer" && <div className="fake-window explorer-window"><div className="fake-window-bar"><span><Folder size={13} /> File Explorer</span><div><button><Maximize2 size={12} /></button><button onClick={() => setActiveWindow(null)}><X size={14} /></button></div></div><div className="explorer-toolbar"><button><ArrowLeft size={13} /></button><button><ArrowRight size={13} /></button><button><ChevronDown size={13} /></button><div className={`explorer-address ${explorerAddressFocused ? "focused" : ""}`}><Folder size={13} />{explorerAddressFocused ? <input value={explorerPath} onChange={(event) => setExplorerPath(event.target.value)} onKeyDown={handleExplorerAddressKeyDown} autoFocus aria-label="Explorer address bar" /> : <span>{explorerPath}</span>}</div><Search size={14} /></div><div className="explorer-body"><div className="explorer-sidebar"><span><Folder size={13} /> Quick access</span><span><Monitor size={13} /> Desktop</span><span className="selected"><Folder size={13} /> Documents</span><span><HardDrive size={13} /> This PC</span><span><Trash2 size={13} /> Recycle Bin</span></div><div className="explorer-content"><div className="explorer-breadcrumb">This PC <ChevronRight size={12} /> Documents</div><div className="file-grid"><div className={`file-tile ${explorerFileState === "deleted" ? "file-deleted" : ""}`}><FileText size={27} /><span>{explorerFileState === "renamed" ? "practice-note.txt" : explorerFileState === "deleted" ? "(in Recycle Bin)" : "lesson-note.txt"}</span><small>{explorerFileState === "deleted" ? "deleted" : "TXT · 2 KB"}</small></div><div className="file-tile"><Folder size={27} /><span>Keyboard basics</span><small>folder</small></div></div></div></div></div>}

              {activeWindow === "browser" && <div className="fake-window browser-window"><div className="browser-tabs">{Array.from({ length: browserTabCount }).map((_, index) => <div key={index} className={`browser-tab ${index === browserTabCount - 1 ? "active" : ""}`}><Globe2 size={11} /><span>{index === 0 ? "Typing Yatra" : "New tab"}</span><X size={11} /></div>)}<button className="new-tab" onClick={() => registerBrowserKey("Ctrl+T")}><span>+</span></button><div className="browser-window-actions"><span>—</span><Maximize2 size={12} /><X size={13} /></div></div><div className="browser-toolbar"><button><ArrowLeft size={14} /></button><button><ArrowRight size={14} /></button><button><RotateCcw size={13} /></button><div className={`browser-address ${browserAddressFocused ? "focused" : ""}`}><ShieldCheck size={12} />{browserAddressFocused ? <input value={browserUrl} onChange={(event) => setBrowserUrl(event.target.value)} onKeyDown={handleBrowserAddressKeyDown} autoFocus aria-label="Browser address bar" /> : <span>{browserUrl}</span>}</div><Menu size={15} /></div><div className="browser-page">{browserSearched ? <><span className="search-result-kicker">TYPING YATRA SEARCH</span><h3>How to use a computer keyboard</h3><p>Home row, shortcuts और daily practice से typing confidence बनता है।</p><div className="result-line"><Check size={13} /> result opened by keyboard</div></> : <><Globe2 size={29} /><h3>Welcome to the practice web</h3><p>Ctrl + L दबाकर address bar चुनें और अपना search लिखें।</p></>}</div></div>}

              <div className="sim-taskbar"><button className={`start-button ${startOpen ? "active" : ""}`} onClick={() => registerDesktopKey("Windows")} aria-label="Open Start menu"><PanelsTopLeft size={17} /></button><div className="taskbar-search"><Search size={12} /><span>Type to search</span></div><div className="taskbar-pinned">{taskbarApps.map((item) => { const Icon = item.icon; return <button key={item.label} onClick={() => setNotice(`${item.label} खोलने का सही तरीका chapter mission में सीखेंगे।`)}><Icon size={15} /></button>; })}</div><div className="taskbar-tray"><span className="tray-time">10:24 AM<br /><small>Wed, 28 Aug</small></span><Wifi size={13} /><BatteryCharging size={14} /><ChevronDown size={13} /></div></div>
            </div>
          </div>

          <div className="laptop-deck" aria-label="Virtual laptop keyboard and touchpad">
            <div className="keyboard-hardware">
              <div className="keyboard-label"><span>Typing Yatra laptop keyboard</span><span>{heldKeys.length ? `Held: ${heldKeys.join(" + ")}` : "Click a modifier, then an action key"}</span></div>
              <div className="virtual-keyboard">
                {virtualKeyRows.map((row, rowIndex) => <div className={`virtual-key-row row-${rowIndex}`} key={rowIndex}>
                  {row.map((label, keyIndex) => <button key={`${rowIndex}-${keyIndex}-${label}`} className={`virtual-key ${label.length > 4 ? "wide-key" : ""} ${heldKeys.includes(label) ? "held" : ""} ${pulseKey === label ? "key-pulse" : ""}`} onClick={() => handleVirtualKey(label)} aria-pressed={heldKeys.includes(label)}>{label}</button>)}
                </div>)}
              </div>
            </div>
            <div className="touchpad-hardware">
              <div className="touchpad-label"><span>Precision touchpad</span><span>{touchpadMessage}</span></div>
              <div className="touchpad-surface" onClick={() => handleTouchpad("single")} onDoubleClick={() => handleTouchpad("double")} onContextMenu={(event) => { event.preventDefault(); handleTouchpad("right"); }} role="button" tabIndex={0} aria-label="Practice touchpad"><MousePointer2 size={17} /><span>Move, click, double-click</span></div>
              <div className="touchpad-click-zones"><button onClick={() => handleTouchpad("left")}>L click</button><button onClick={() => handleTouchpad("right")}>R click</button></div>
            </div>
          </div>

          <div className="sim-notice"><span className={`notice-icon ${chapter.color}`}><Zap size={14} /></span><span>{notice}</span><span className="notice-right"><Keyboard size={13} /> keyboard input listening</span></div>
        </section>

        <aside className="mission-column">
          <div className="mission-header"><span className="sim-kicker">CURRENT MISSION</span><span className="mission-number">{chapter.number} / 04</span></div>
          <div className={`mission-card mission-${chapter.color}`}><div className="mission-card-top"><span className="mission-app"><chapter.icon size={14} /> {chapter.app}</span><span className="mission-status"><span /> active</span></div><h3>{chapter.title}</h3><p>{chapter.intro}</p><div className="mission-progress"><div><span>MISSION PROGRESS</span><strong>{chapterComplete ? "100" : Math.min(99, lessonProgress)}%</strong></div><div className="mission-track"><span style={{ width: `${chapterComplete ? 100 : lessonProgress}%` }} /></div></div></div>
          <div className="mission-steps"><div className="steps-heading"><span>DO THIS NOW</span><span>{Math.min(stepIndex + 1, chapter.steps.length)} / {chapter.steps.length}</span></div>{chapter.steps.map((step, index) => <button key={step.key} className={`mission-step ${index < stepIndex || chapterComplete ? "done" : ""} ${index === stepIndex && !chapterComplete ? "current" : ""}`} onClick={() => { if (index === stepIndex) setNotice(`अब ${step.detail}।`); }}><span className="step-check">{index < stepIndex || chapterComplete ? <Check size={13} /> : <span>{index + 1}</span>}</span><span><strong>{step.title}</strong><small>{step.detail}</small></span>{index === stepIndex && !chapterComplete && <ChevronRight size={15} />}</button>)}</div>
          <div className="next-key-card"><div><span className="sim-kicker">NEXT KEY</span><strong>{chapterComplete ? "DONE" : nextDisplay}</strong></div><div className={`large-key ${pulseKey ? "pulse" : ""}`}>{chapterComplete ? <Check size={22} /> : nextDisplay}</div></div>
          <div className={`keyboard-anchor anchor-${chapter.color}`}><div className="keyboard-anchor-heading"><span className="sim-kicker"><Keyboard size={12} /> KEYBOARD FOCUS</span><span>use these keys</span></div><div className="anchor-keys">{chapterKeyGroups[chapter.id].map((key, index) => <span key={key} className={`${index === 0 || index === 1 ? "anchor-key active-anchor" : "anchor-key"}`}>{key}</span>)}</div><div className="anchor-caption"><span><span className="anchor-line" /> hands stay low</span><span>real key practice</span></div></div>
          <div className="shortcut-card"><div className="shortcut-heading"><span className="sim-kicker">SHORTCUT TO PRACTICE</span><Copy size={14} /></div><p>{chapter.shortcut}</p><div className="shortcut-foot"><span><HelpCircle size={13} /> Need a hint?</span><button onClick={() => setNotice(`Hint: ${currentStep?.detail ?? "अगला chapter चुनें"}`)}>show hint</button></div></div>
          <div className="coach-footer"><span className="coach-face"><Sparkles size={14} /></span><span><strong>Coach note</strong><br />एक action पूरा करें, फिर अगली key देखें।</span></div>
        </aside>
      </main>
      <footer className="sim-footer"><span><Keyboard size={13} /> Built to make computer feel familiar.</span><span>Typing Yatra <b>·</b> simulator v1.0</span></footer>
    </div>
  );
}
