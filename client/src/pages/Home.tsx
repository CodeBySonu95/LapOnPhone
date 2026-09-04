import { useRef, useState } from "react";
import { ExternalLink, Maximize2, Monitor, Power, RefreshCw, Wifi } from "lucide-react";

const VM_URL =
  "https://bellard.org/jslinux/vm.html?url=win2k.cfg&mem=192&graphic=1&w=1024&h=768";

/**
 * Style note: Quiet Study Desk surrounds a real, dark JSLinux VM with a restrained
 * editorial frame. The computer is the hero; helper UI is intentionally minimal.
 */
export default function Home() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [vmKey, setVmKey] = useState(0);
  const [status, setStatus] = useState("Booting Windows 2000 virtual machine…");

  const enterFullscreen = async () => {
    if (frameRef.current && document.fullscreenEnabled) {
      await frameRef.current.requestFullscreen();
    }
  };

  const reloadVm = () => {
    setStatus("Restarting virtual machine…");
    setVmKey((value) => value + 1);
  };

  return (
    <main className="vm-page">
      <header className="vm-header">
        <a className="brand-lockup" href="#computer" aria-label="Typing Yatra computer simulator">
          <span className="brand-mark" aria-hidden="true">↗</span>
          <span><strong>typing</strong><em>yatra</em></span>
          <small>REAL COMPUTER PRACTICE</small>
        </a>
        <div className="system-readout" aria-live="polite">
          <span className="online-dot" />
          <span>SYSTEM ONLINE</span>
          <i />
          <span>Physical keyboard enabled</span>
        </div>
      </header>

      <section className="vm-intro" id="computer">
        <div>
          <p className="eyebrow"><span /> Virtual Windows computer</p>
          <h1>Use the computer.<br /><em>Learn the computer.</em></h1>
          <p className="intro-copy">
            This is a real browser VM, not a mockup. Click inside the screen once to focus it,
            then use your physical keyboard to type, navigate, open menus, and practice shortcuts.
            The screen itself is your touch surface.
          </p>
        </div>
        <div className="vm-actions" aria-label="Virtual machine controls">
          <div className="vm-status"><Wifi size={15} /><span>{status}</span></div>
          <div className="action-row">
            <button type="button" onClick={reloadVm}><RefreshCw size={15} /> Restart VM</button>
            <button type="button" onClick={enterFullscreen}><Maximize2 size={15} /> Full screen</button>
          </div>
        </div>
      </section>

      <section className="laptop-stage" aria-label="Virtual laptop">
        <div className="screen-lid" ref={frameRef}>
          <div className="camera-dot" aria-hidden="true" />
          <div className="screen-bezel">
            <iframe
              key={vmKey}
              className="vm-iframe"
              src={VM_URL}
              title="JSLinux Windows 2000 virtual computer"
              allow="fullscreen"
              onLoad={() => setStatus("VM online — click the screen to focus your keyboard")}
            />
          </div>
          <div className="screen-hinge" aria-hidden="true" />
        </div>

        <div className="laptop-base">
          <div className="base-label">
            <span>typing <em>yatra</em></span>
            <small>LEARN BY USING</small>
          </div>
          <div className="keyboard-deck" aria-label="Physical keyboard reminder">
            <div className="deck-line" />
            <div className="keyboard-caption"><Monitor size={14} /> Physical keyboard</div>
            <div className="key-row key-row-function">
              {['Esc','F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'].map((key) => <span key={key}>{key}</span>)}
            </div>
            <div className="key-row">{['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'].map((key) => <span key={key}>{key}</span>)}</div>
            <div className="key-row">{['Caps','A','S','D','F','G','H','J','K','L',';','\'','Enter'].map((key) => <span key={key}>{key}</span>)}</div>
            <div className="key-row">{['Shift','Z','X','C','V','B','N','M',',','.','/','Shift'].map((key) => <span key={key}>{key}</span>)}</div>
            <div className="key-row key-row-bottom">{['Ctrl','Fn','Win','Alt','Space','Alt','Ctrl','←','↑','↓','→'].map((key) => <span key={key}>{key}</span>)}</div>
          </div>
          <div className="trackpad-placeholder" aria-hidden="true" />
          <p className="hardware-hint"><Power size={13} /> No separate touchpad — touch or drag on the VM screen itself</p>
        </div>
      </section>

      <footer className="vm-footer">
        <span>JSLinux Windows 2000 reference VM</span>
        <span className="footer-divider" />
        <a href={VM_URL} target="_blank" rel="noreferrer"><ExternalLink size={13} /> Open direct VM</a>
        <span className="footer-divider" />
        <span>Click screen first · then type with your real keyboard</span>
      </footer>
    </main>
  );
}
