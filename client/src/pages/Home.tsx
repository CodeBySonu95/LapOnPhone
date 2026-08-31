/*
 * Focused simulator reminder: the computer is the product.
 * Keep the desktop dominant, make every control behave like a real computer,
 * and let the keyboard, touchpad, windows, and shortcuts carry the experience.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode } from "react";
import {
  AppWindow,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BatteryCharging,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clipboard,
  FileText,
  Folder,
  Globe2,
  HardDrive,
  Keyboard,
  Maximize2,
  Menu,
  Minus,
  Monitor,
  MousePointer2,
  PanelLeft,
  Power,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Wifi,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BRAND_MARK = "/manus-storage/typing-yatra-mark_fa278fa1.png";

type WindowId = "explorer" | "notepad" | "browser" | "calculator" | "settings";
type AppId = WindowId;
type WindowState = {
  open: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
};

type WindowMeta = { title: string; icon: LucideIcon; accent: string };

const WINDOW_META: Record<WindowId, WindowMeta> = {
  explorer: { title: "File Explorer", icon: Folder, accent: "folder" },
  notepad: { title: "Untitled — Notepad", icon: FileText, accent: "notepad" },
  browser: { title: "Typing Yatra Browser", icon: Globe2, accent: "browser" },
  calculator: { title: "Calculator", icon: Calculator, accent: "calculator" },
  settings: { title: "Settings", icon: Settings, accent: "settings" },
};

const initialWindows: Record<WindowId, WindowState> = {
  explorer: { open: false, minimized: false, maximized: false, x: 7, y: 9, width: 72, height: 72, z: 1 },
  notepad: { open: false, minimized: false, maximized: false, x: 15, y: 12, width: 62, height: 68, z: 2 },
  browser: { open: false, minimized: false, maximized: false, x: 5, y: 6, width: 78, height: 78, z: 3 },
  calculator: { open: false, minimized: false, maximized: false, x: 39, y: 20, width: 34, height: 62, z: 4 },
  settings: { open: false, minimized: false, maximized: false, x: 11, y: 10, width: 68, height: 72, z: 5 },
};

const keyRows = [
  ["Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]", "\\"],
  ["Caps Lock", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'", "Enter"],
  ["Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "Shift"],
  ["Ctrl", "Fn", "Win", "Alt", "Space", "Alt", "Ctrl", "←", "↑", "↓", "→"],
];

const modifierKeys = ["Ctrl", "Alt", "Shift", "Win"];

const appButtons: Array<{ id: AppId; label: string; icon: LucideIcon }> = [
  { id: "explorer", label: "File Explorer", icon: Folder },
  { id: "notepad", label: "Notepad", icon: FileText },
  { id: "browser", label: "Browser", icon: Globe2 },
  { id: "calculator", label: "Calculator", icon: Calculator },
  { id: "settings", label: "Settings", icon: Settings },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function normalizeKey(event: KeyboardEvent) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "c") return "Ctrl+C";
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "v") return "Ctrl+V";
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "x") return "Ctrl+X";
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") return "Ctrl+A";
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "l") return "Ctrl+L";
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "t") return "Ctrl+T";
  if (event.altKey && event.key === "Tab") return "Alt+Tab";
  if (event.altKey && event.key === "ArrowLeft") return "Alt+Left";
  if (event.key === "Meta" || event.key === "OS") return "Windows";
  if (event.key === "Control") return "Ctrl";
  if (event.key === "Alt") return "Alt";
  if (event.key === "Shift") return "Shift";
  if (event.key === "ArrowDown") return "ArrowDown";
  if (event.key === "ArrowUp") return "ArrowUp";
  if (event.key === "ArrowLeft") return "ArrowLeft";
  if (event.key === "ArrowRight") return "ArrowRight";
  if (event.key === "Escape") return "Escape";
  if (event.key === " ") return "Space";
  return event.key.length === 1 ? event.key.toUpperCase() : event.key;
}

function toActionKey(label: string) {
  if (label === "Win") return "Windows";
  if (label === "Esc") return "Escape";
  if (label === "Del") return "Delete";
  if (label === "↓") return "ArrowDown";
  if (label === "↑") return "ArrowUp";
  if (label === "←") return "ArrowLeft";
  if (label === "→") return "ArrowRight";
  return label;
}

export default function Home() {
  const screenRef = useRef<HTMLDivElement>(null);
  const notepadRef = useRef<HTMLTextAreaElement>(null);
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initialWindows);
  const [activeWindow, setActiveWindow] = useState<WindowId | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [startSelection, setStartSelection] = useState(0);
  const [systemMessage, setSystemMessage] = useState("Desktop ready — click, type, drag, and explore.");
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);
  const [heldModifiers, setHeldModifiers] = useState<string[]>([]);
  const heldModifiersRef = useRef<string[]>([]);
  const [cursor, setCursor] = useState({ x: 84, y: 80 });
  const [cursorDragging, setCursorDragging] = useState(false);
  const [touchpadMessage, setTouchpadMessage] = useState("Touchpad ready");
  const [notepadText, setNotepadText] = useState("");
  const [clipboardText, setClipboardText] = useState("");
  const [explorerPath, setExplorerPath] = useState("This PC");
  const [explorerAddressFocused, setExplorerAddressFocused] = useState(false);
  const [selectedFile, setSelectedFile] = useState("lesson-note.txt");
  const [renameMode, setRenameMode] = useState(false);
  const [browserUrl, setBrowserUrl] = useState("typing-yatra.local");
  const [browserAddressFocused, setBrowserAddressFocused] = useState(false);
  const [browserTabs, setBrowserTabs] = useState(["Typing Yatra"]);
  const [browserSearched, setBrowserSearched] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState("0");
  const [dragSession, setDragSession] = useState<{ id: WindowId; offsetX: number; offsetY: number } | null>(null);

  const topZ = useMemo(() => Math.max(...Object.values(windows).map((item) => item.z)), [windows]);

  const focusWindow = useCallback((id: WindowId) => {
    setActiveWindow(id);
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: false, z: Math.max(...Object.values(current).map((item) => item.z)) + 1 } }));
  }, []);

  const openWindow = useCallback((id: WindowId) => {
    setStartOpen(false);
    setSystemMessage(`${WINDOW_META[id].title} opened. You can move the window by dragging its title bar.`);
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: true, minimized: false, z: Math.max(...Object.values(current).map((item) => item.z)) + 1 } }));
    setActiveWindow(id);
  }, []);

  const closeWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], open: false, minimized: false } }));
    setActiveWindow((current) => current === id ? null : current);
    setSystemMessage(`${WINDOW_META[id].title} closed.`);
  };

  const minimizeWindow = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], minimized: true } }));
    setActiveWindow((current) => current === id ? null : current);
    setSystemMessage(`${WINDOW_META[id].title} minimized to the taskbar.`);
  };

  const toggleMaximize = (id: WindowId) => {
    setWindows((current) => ({ ...current, [id]: { ...current[id], maximized: !current[id].maximized } }));
    focusWindow(id);
  };

  const handleShortcut = useCallback((shortcut: string) => {
    if (shortcut === "Windows") {
      setStartOpen((current) => !current);
      setSystemMessage(startOpen ? "Start menu closed." : "Start menu opened. Use Arrow Down and Enter to choose an app.");
      return;
    }
    if (shortcut === "Alt+Tab") {
      const openIds = (Object.keys(windows) as WindowId[]).filter((id) => windows[id].open);
      if (openIds.length > 1) {
        const currentIndex = activeWindow ? openIds.indexOf(activeWindow) : -1;
        const nextId = openIds[(currentIndex + 1) % openIds.length];
        focusWindow(nextId);
        setSystemMessage(`Alt + Tab switched to ${WINDOW_META[nextId].title}.`);
      } else {
        setSystemMessage("Open two windows to practice Alt + Tab.");
      }
      return;
    }
    if (shortcut === "Ctrl+L") {
      if (activeWindow === "explorer") {
        setExplorerAddressFocused(true);
        setSystemMessage("Explorer address bar focused. Type a folder name and press Enter.");
      } else if (activeWindow === "browser") {
        setBrowserAddressFocused(true);
        setSystemMessage("Browser address bar focused. Type a search or web address.");
      } else {
        setSystemMessage("Ctrl + L is ready for an address bar in Explorer or Browser.");
      }
      return;
    }
    if (shortcut === "Ctrl+T") {
      openWindow("browser");
      setBrowserTabs((current) => [...current, "New tab"]);
      setSystemMessage("New browser tab opened with Ctrl + T.");
      return;
    }
    if (shortcut === "Ctrl+A") {
      if (activeWindow === "notepad" && notepadRef.current) notepadRef.current.select();
      setSystemMessage(activeWindow === "notepad" ? "Ctrl + A — all Notepad text selected." : "Ctrl + A — select all shortcut registered.");
      return;
    }
    if (shortcut === "Ctrl+C") {
      if (activeWindow === "notepad" && notepadRef.current) {
        const field = notepadRef.current;
        const selected = field.value.slice(field.selectionStart, field.selectionEnd) || field.value;
        setClipboardText(selected);
      }
      setSystemMessage(activeWindow === "notepad" ? "Ctrl + C — selected text copied to the virtual clipboard." : "Ctrl + C — copy shortcut registered.");
      return;
    }
    if (shortcut === "Ctrl+V") {
      if (activeWindow === "notepad" && notepadRef.current && clipboardText) {
        const field = notepadRef.current;
        const start = field.selectionStart;
        const end = field.selectionEnd;
        const nextText = `${notepadText.slice(0, start)}${clipboardText}${notepadText.slice(end)}`;
        setNotepadText(nextText);
        window.requestAnimationFrame(() => field.setSelectionRange(start + clipboardText.length, start + clipboardText.length));
      }
      setSystemMessage(activeWindow === "notepad" ? "Ctrl + V — virtual clipboard pasted into Notepad." : "Ctrl + V — paste shortcut registered.");
      return;
    }
    if (shortcut === "Ctrl+X") {
      if (activeWindow === "notepad" && notepadRef.current) {
        const field = notepadRef.current;
        const selected = field.value.slice(field.selectionStart, field.selectionEnd) || field.value;
        setClipboardText(selected);
        if (field.selectionStart !== field.selectionEnd) setNotepadText(`${field.value.slice(0, field.selectionStart)}${field.value.slice(field.selectionEnd)}`);
      }
      setSystemMessage(activeWindow === "notepad" ? "Ctrl + X — selected text cut to the virtual clipboard." : "Ctrl + X — cut shortcut registered.");
      return;
    }
    if (shortcut === "Alt+Left") { setBrowserSearched(false); setSystemMessage("Alt + Left — browser went back."); return; }
    if (shortcut === "F2") { setRenameMode(true); setSystemMessage("F2 — rename mode enabled for the selected file."); return; }
    if (shortcut === "Delete") { setSelectedFile("(in Recycle Bin)"); setSystemMessage("Delete — selected file moved to the Recycle Bin."); return; }
    if (shortcut === "Escape") { setStartOpen(false); if (activeWindow) setSystemMessage("Escape — menu dismissed. Windows stay open until you close them."); return; }
    setSystemMessage(`${shortcut} pressed.`);
  }, [activeWindow, clipboardText, focusWindow, notepadText, openWindow, startOpen, windows]);

  const handlePlainKey = useCallback((action: string) => {
    if (activeWindow === "notepad" && action.length === 1) {
      setNotepadText((current) => `${current}${action}`);
      return;
    }
    if (activeWindow === "notepad" && action === "Space") { setNotepadText((current) => `${current} `); return; }
    if (activeWindow === "notepad" && action === "Enter") { setNotepadText((current) => `${current}\n`); return; }
    if (activeWindow === "notepad" && action === "Backspace") { setNotepadText((current) => current.slice(0, -1)); return; }
    if (startOpen && action === "ArrowDown") { setStartSelection((current) => (current + 1) % appButtons.length); setSystemMessage("Start selection moved down."); return; }
    if (startOpen && action === "Enter") { openWindow(appButtons[startSelection].id); return; }
    if (activeWindow === "explorer" && action === "Enter" && explorerAddressFocused) {
      setExplorerAddressFocused(false);
      setSystemMessage(`${explorerPath || "This PC"} opened in File Explorer.`);
      return;
    }
    if (activeWindow === "browser" && action === "Enter" && browserAddressFocused) {
      setBrowserAddressFocused(false);
      setBrowserSearched(true);
      setSystemMessage(`Search opened for “${browserUrl}”.`);
      return;
    }
    if (action === "F2") { setRenameMode(true); setSystemMessage("F2 — rename mode enabled for the selected file."); return; }
    if (action === "Delete") { setSelectedFile("(in Recycle Bin)"); setSystemMessage("Delete — selected file moved to the Recycle Bin."); return; }
    setSystemMessage(`${action} pressed.`);
  }, [activeWindow, browserAddressFocused, browserUrl, explorerAddressFocused, explorerPath, openWindow, startOpen, startSelection]);

  const handleGlobalKey = useCallback((event: KeyboardEvent) => {
    const normalized = normalizeKey(event);
    if (event.type === "keydown") setPressedKeys((current) => current.includes(normalized) ? current : [...current, normalized]);
    if (event.type === "keyup") setPressedKeys((current) => current.filter((item) => item !== normalized));
    if (event.type !== "keydown") return;

    const target = event.target as HTMLElement | null;
    const editable = target?.tagName === "TEXTAREA" || target?.tagName === "INPUT";
    const isShortcut = normalized.includes("+") || ["Windows", "Alt+Tab", "F2", "Delete", "Escape"].includes(normalized);
    if (isShortcut && !(editable && ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+A"].includes(normalized))) event.preventDefault();
    if (editable && !isShortcut) return;
    if (normalized === "Windows") { handleShortcut("Windows"); return; }
    if (normalized === "Alt+Tab") { handleShortcut("Alt+Tab"); return; }
    if (normalized === "Ctrl+L" || normalized === "Ctrl+T" || normalized.startsWith("Ctrl+") || normalized === "Alt+Left") { handleShortcut(normalized); return; }
    if (normalized === "F2" || normalized === "Delete" || normalized === "Escape") { handlePlainKey(normalized); return; }
    if (!editable) handlePlainKey(normalized);
  }, [handlePlainKey, handleShortcut]);

  useEffect(() => {
    window.addEventListener("keydown", handleGlobalKey);
    window.addEventListener("keyup", handleGlobalKey);
    return () => { window.removeEventListener("keydown", handleGlobalKey); window.removeEventListener("keyup", handleGlobalKey); };
  }, [handleGlobalKey]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!dragSession || !screenRef.current) return;
      const rect = screenRef.current.getBoundingClientRect();
      const x = clamp(((event.clientX - rect.left - dragSession.offsetX) / rect.width) * 100, 0, 96 - windows[dragSession.id].width);
      const y = clamp(((event.clientY - rect.top - dragSession.offsetY) / rect.height) * 100, 0, 96 - windows[dragSession.id].height);
      setWindows((current) => ({ ...current, [dragSession.id]: { ...current[dragSession.id], x, y } }));
    };
    const onUp = () => setDragSession(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [dragSession, windows]);

  const startDragging = (event: ReactPointerEvent<HTMLDivElement>, id: WindowId) => {
    const current = windows[id];
    if (current.maximized || !screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    setDragSession({ id, offsetX: event.clientX - rect.left - (current.x / 100) * rect.width, offsetY: event.clientY - rect.top - (current.y / 100) * rect.height });
    focusWindow(id);
  };

  const handleVirtualKey = (label: string) => {
    setPressedKeys((current) => current.includes(label) ? current : [...current, label]);
    window.setTimeout(() => setPressedKeys((current) => current.filter((item) => item !== label)), 150);
    if (modifierKeys.includes(label)) {
      const nextModifiers = heldModifiersRef.current.includes(label)
        ? heldModifiersRef.current.filter((item) => item !== label)
        : [...heldModifiersRef.current, label];
      heldModifiersRef.current = nextModifiers;
      setHeldModifiers(nextModifiers);
      setSystemMessage(nextModifiers.includes(label) ? `${label} held — now click the action key.` : `${label} released.`);
      return;
    }
    const action = toActionKey(label);
    const modifier = heldModifiersRef.current[0];
    heldModifiersRef.current = [];
    setHeldModifiers([]);
    handleShortcut(modifier ? `${modifier === "Win" ? "Windows" : modifier}+${action}` : action);
    if (!modifier) handlePlainKey(action);
  };

  const moveCursorFromTouchpad = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const nextX = clamp(((event.clientX - rect.left) / rect.width) * 100, 3, 97);
    const nextY = clamp(((event.clientY - rect.top) / rect.height) * 100, 4, 95);
    setCursor({ x: nextX, y: nextY });
    setTouchpadMessage(cursorDragging ? "Dragging pointer" : `Cursor ${Math.round(nextX)}%, ${Math.round(nextY)}%`);
  };

  const handleTouchpadClick = (type: "click" | "double" | "right") => {
    const label = type === "double" ? "Double-click registered" : type === "right" ? "Right-click registered" : "Click registered";
    setTouchpadMessage(label);
    setSystemMessage(`${label} — the virtual cursor is at ${Math.round(cursor.x)}%, ${Math.round(cursor.y)}%.`);
  };

  const stageWindowStyle = (state: WindowState): CSSProperties => state.maximized
    ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: state.z }
    : { left: `${state.x}%`, top: `${state.y}%`, width: `${state.width}%`, height: `${state.height}%`, zIndex: state.z };

  const renderWindow = (id: WindowId, body: ReactNode) => {
    const state = windows[id];
    if (!state.open || state.minimized) return null;
    const meta = WINDOW_META[id];
    const Icon = meta.icon;
    return <section className={`app-window ${meta.accent} ${activeWindow === id ? "focused" : ""}`} style={stageWindowStyle(state)} onPointerDown={() => focusWindow(id)}>
      <div className="window-titlebar" onPointerDown={(event) => startDragging(event, id)}>
        <span className="window-title"><Icon size={14} />{meta.title}</span>
        <div className="window-controls">
          <button aria-label="Minimize" onPointerDown={(event) => event.stopPropagation()} onClick={() => minimizeWindow(id)}><Minus size={13} /></button>
          <button aria-label="Maximize" onPointerDown={(event) => event.stopPropagation()} onClick={() => toggleMaximize(id)}><Maximize2 size={12} /></button>
          <button aria-label="Close" onPointerDown={(event) => event.stopPropagation()} onClick={() => closeWindow(id)}><X size={13} /></button>
        </div>
      </div>
      {body}
    </section>;
  };

  const visibleApps = (Object.keys(windows) as WindowId[]).filter((id) => windows[id].open);
  const desktopTime = "10:24 AM";

  return <div className="computer-app">
    <header className="computer-header">
      <a className="computer-brand" href="#computer" aria-label="Typing Yatra computer simulator home"><img src={BRAND_MARK} alt="" /><span><strong>typing</strong><em>yatra</em></span><small>COMPUTER SIMULATOR</small></a>
      <div className="header-status"><span className="status-dot" /> SYSTEM ONLINE <span className="header-divider" /> Keyboard + Touchpad <button aria-label="Help"><CircleHelp size={16} /></button></div>
    </header>

    <main id="computer" className="computer-workspace">
      <div className="workspace-title"><div><span className="eyebrow">VIRTUAL LAPTOP / WINDOWS DESKTOP</span><h1>One computer. <i>Use everything.</i></h1></div><div className="workspace-hint"><Keyboard size={15} /><span>Use your real keyboard or the keys below.<br /><strong>Try Ctrl + C, Alt + Tab, or Windows.</strong></span></div></div>

      <section className="laptop" aria-label="Typing Yatra virtual laptop">
        <div className="screen-lid">
          <div className="screen-bezel">
            <div className="camera-dot" />
            <div ref={screenRef} className="screen-stage" onPointerMove={(event) => { const rect = event.currentTarget.getBoundingClientRect(); setCursor({ x: clamp(((event.clientX - rect.left) / rect.width) * 100, 2, 98), y: clamp(((event.clientY - rect.top) / rect.height) * 100, 2, 96) }); }}>
              <div className="desktop-wallpaper">
                <div className="desktop-brand-lockup"><div className="window-symbol"><span /><span /><span /><span /></div><strong>typing yatra</strong><small>learn by using</small></div>
                <div className="desktop-icons">
                  <button onDoubleClick={() => openWindow("explorer")} onClick={() => setSystemMessage("Double-click This PC to open File Explorer.")}><HardDrive size={25} /><span>This PC</span></button>
                  <button onDoubleClick={() => openWindow("explorer")} onClick={() => setSystemMessage("Double-click Documents to open File Explorer.")}><Folder size={25} /><span>Documents</span></button>
                  <button onDoubleClick={() => setSystemMessage("Recycle Bin is empty.")} onClick={() => setSystemMessage("Recycle Bin — nothing to restore.")}><Trash2 size={25} /><span>Recycle Bin</span></button>
                  <button onDoubleClick={() => openWindow("notepad")} onClick={() => setSystemMessage("Double-click Notepad to open it.")}><FileText size={25} /><span>Notepad</span></button>
                  <button onDoubleClick={() => openWindow("browser")} onClick={() => setSystemMessage("Double-click Browser to open it.")}><Globe2 size={25} /><span>Browser</span></button>
                </div>
                <div className="desktop-watermark"><span /> Practice environment <b>·</b> safe simulation</div>
              </div>
              <div className="virtual-cursor" style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }} aria-label="Virtual cursor"><MousePointer2 size={18} /></div>
              <div className="cursor-target"><span /> Move pointer here</div>

              {startOpen && <div className="start-menu" onPointerDown={(event) => event.stopPropagation()}><div className="start-menu-search"><Search size={14} /><span>Type to search</span></div><div className="start-menu-heading"><span>Pinned</span><span>All apps <ChevronRight size={12} /></span></div><div className="start-menu-apps">{appButtons.map(({ id, label, icon: AppIcon }, index) => <button key={id} className={index === startSelection ? "selected" : ""} onClick={() => openWindow(id)}><span className={`start-app-icon ${WINDOW_META[id].accent}`}><AppIcon size={15} /></span>{label}</button>)}</div><div className="start-menu-footer"><span><span className="user-badge">A</span> learner</span><Power size={15} /></div></div>}

              {renderWindow("settings", <div className="settings-content"><aside><strong>Settings</strong><span className="selected"><Monitor size={14} /> System</span><span><Wifi size={14} /> Network & internet</span><span><ShieldCheck size={14} /> Privacy & security</span></aside><div className="settings-main"><span className="crumb">System <ChevronRight size={11} /> About</span><h2>Welcome to your PC</h2><p>Explore the simulated settings panel. Window controls, focus, and Escape all work like a desktop app.</p><div className="device-card"><Monitor size={22} /><span><strong>Practice PC</strong><small>Typing Yatra Virtual Machine</small></span><Check size={16} /></div></div></div>)}
              {renderWindow("notepad", <div className="notepad-content"><div className="app-menu"><span>File</span><span>Edit</span><span>View</span><span>Help</span><em><Check size={11} /> Auto-save</em></div><textarea ref={notepadRef} value={notepadText} onChange={(event) => setNotepadText(event.target.value)} placeholder="Start typing here… Try Ctrl + A, Ctrl + C, and Ctrl + V." aria-label="Notepad typing area" autoFocus={activeWindow === "notepad"} /><div className="notepad-status"><span>Ln 1, Col {notepadText.length + 1}</span><span>UTF-8 · {notepadText.length} characters</span></div></div>)}
              {renderWindow("explorer", <div className="explorer-content"><div className="explorer-toolbar"><button><ArrowLeft size={14} /></button><button><ArrowRight size={14} /></button><button><ArrowUp size={14} /></button><div className={`address-bar ${explorerAddressFocused ? "focused" : ""}`}><Folder size={13} />{explorerAddressFocused ? <input value={explorerPath} onChange={(event) => setExplorerPath(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setExplorerAddressFocused(false); setSystemMessage(`${explorerPath} opened.`); } }} autoFocus aria-label="Explorer address bar" /> : <span>{explorerPath}</span>}</div><Search size={14} /></div><div className="explorer-body"><aside><strong>Quick access</strong><span><Folder size={13} /> Desktop</span><span className="selected"><Folder size={13} /> Documents</span><span><HardDrive size={13} /> This PC</span><span><Trash2 size={13} /> Recycle Bin</span></aside><div className="file-area"><div className="file-breadcrumb">This PC <ChevronRight size={11} /> Documents</div><div className="file-grid"><button className={`file-tile ${selectedFile === "lesson-note.txt" ? "selected" : ""}`} onClick={() => setSelectedFile("lesson-note.txt")}><FileText size={27} /><span>{renameMode ? "practice-note.txt" : selectedFile}</span><small>TXT · 2 KB</small></button><button className="file-tile"><Folder size={27} /><span>Keyboard basics</span><small>folder</small></button></div></div></div></div>)}
              {renderWindow("browser", <div className="browser-content"><div className="browser-tabs">{browserTabs.map((tab, index) => <button key={`${tab}-${index}`} className={index === browserTabs.length - 1 ? "active" : ""}><Globe2 size={11} />{tab}<X size={10} /></button>)}<button className="new-tab" onClick={() => setBrowserTabs((current) => [...current, "New tab"])}>+</button></div><div className="browser-toolbar"><button><ArrowLeft size={14} /></button><button><ArrowRight size={14} /></button><button><ArrowDown size={13} /></button><div className={`address-bar ${browserAddressFocused ? "focused" : ""}`}><ShieldCheck size={12} />{browserAddressFocused ? <input value={browserUrl} onChange={(event) => setBrowserUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); setBrowserAddressFocused(false); setBrowserSearched(true); setSystemMessage(`Search opened for “${browserUrl}”.`); } }} autoFocus aria-label="Browser address bar" /> : <span>{browserUrl}</span>}</div><Menu size={14} /></div><div className="browser-page">{browserSearched ? <><span className="result-kicker">SEARCH RESULT</span><h2>How to use a computer keyboard</h2><p>Home row, shortcuts, and daily practice build computer confidence.</p><span className="result-ok"><Check size={13} /> Opened by keyboard</span></> : <><Globe2 size={28} /><h2>Practice web</h2><p>Press Ctrl + L to focus the address bar, then search.</p></>}</div></div>)}
              {renderWindow("calculator", <div className="calculator-content"><div className="calculator-display">{calculatorInput}</div><div className="calculator-grid">{["C", "⌫", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "±", "0", ".", "="].map((label) => <button key={label} onClick={() => { if (label === "C") setCalculatorInput("0"); else if (label === "⌫") setCalculatorInput((value) => value.length > 1 ? value.slice(0, -1) : "0"); else if (label === "=") setCalculatorInput("Ready"); else setCalculatorInput((value) => value === "0" ? label : `${value}${label}`); }}>{label}</button>)}</div></div>)}

              <div className="windows-taskbar"><button className={`taskbar-start ${startOpen ? "active" : ""}`} onClick={() => { setStartOpen((current) => !current); setSystemMessage(startOpen ? "Start menu closed." : "Start menu opened."); }} aria-label="Open Start menu"><span className="window-symbol mini"><span /><span /><span /><span /></span></button><div className="taskbar-search"><Search size={12} /><span>Type to search</span></div><div className="taskbar-pinned">{appButtons.slice(0, 4).map(({ id, icon: AppIcon }) => <button key={id} className={activeWindow === id && windows[id].open ? "active" : ""} onClick={() => windows[id].open ? focusWindow(id) : openWindow(id)} aria-label={`Open ${WINDOW_META[id].title}`}><AppIcon size={15} /></button>)}</div><div className="taskbar-spacer" /><div className="taskbar-tray"><Wifi size={12} /><BatteryCharging size={13} /><span>{desktopTime}<small>Wed, 28 Aug</small></span><ChevronDown size={11} /></div></div>
            </div>
          </div>
          <div className="screen-hinge"><span /><span /></div>
        </div>

        <div className="laptop-deck">
          <div className="keyboard-panel"><div className="keyboard-panel-head"><span><Keyboard size={12} /> Virtual laptop keyboard</span><small>Click a modifier, then an action key</small></div>{keyRows.map((row, rowIndex) => <div className={`virtual-key-row row-${rowIndex}`} key={rowIndex}>{row.map((label, keyIndex) => <button key={`${label}-${keyIndex}`} className={`virtual-key ${modifierKeys.includes(label) ? "modifier" : ""} ${label === "Space" ? "space" : ""} ${pressedKeys.includes(label) || heldModifiers.includes(label) ? "pressed" : ""}`} onClick={() => handleVirtualKey(label)}>{label}</button>)}</div>)}</div>
          <div className="touchpad-hardware"><div className="touchpad-head"><span><MousePointer2 size={12} /> Precision touchpad</span><small>{touchpadMessage}</small></div><div className={`touchpad-surface ${cursorDragging ? "dragging" : ""}`} onPointerMove={moveCursorFromTouchpad} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setCursorDragging(true); moveCursorFromTouchpad(event); }} onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setCursorDragging(false); setTouchpadMessage("Pointer released"); }} onPointerLeave={() => setCursorDragging(false)} onClick={() => handleTouchpadClick("click")} onDoubleClick={() => handleTouchpadClick("double")} onContextMenu={(event) => { event.preventDefault(); handleTouchpadClick("right"); }} role="button" tabIndex={0} aria-label="Practice touchpad"><MousePointer2 size={18} /><span>Move cursor · click · double-click<br /><small>Hold and move for drag practice</small></span></div><div className="touchpad-zones"><button onClick={() => handleTouchpadClick("click")}>Left click</button><button onClick={() => handleTouchpadClick("right")}>Right click</button></div></div>
        </div>
      </section>

      <div className="computer-statusbar"><span className="status-pulse" />{systemMessage}<span className="status-shortcuts">{heldModifiers.length ? `Held: ${heldModifiers.join(" + ")}` : "Keyboard listening"}</span></div>
      <section className="quick-reference"><div><span className="eyebrow">DESKTOP CONTROLS</span><strong>Open apps by double-clicking icons.</strong><small>Drag any title bar to move a window. Use the taskbar to switch between apps.</small></div><div className="shortcut-chips"><span><b>Win</b> Start</span><span><b>Ctrl + L</b> Address bar</span><span><b>Alt + Tab</b> Switch apps</span><span><b>F2</b> Rename</span></div></section>
    </main>
  </div>;
}
