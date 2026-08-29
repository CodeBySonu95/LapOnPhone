# Verification notes

- Desktop live preview loaded successfully at the Typing Yatra preview URL.
- Hindi labels, editorial layout, generated mark, finger guide, and progress illustration rendered without broken image paths.
- Initial active key was `a` and the on-screen key displayed `NEXT`.
- Clicking `अभ्यास शुरू करें` changed the prompt to the active practice state and started the timer.
- Pressing the physical `a` key advanced the phrase from 0% to 3%, changed the next highlighted key to `s`, and updated the live WPM/accuracy snapshot.
- TypeScript check and production build completed successfully. Vite only emitted the standard chunk-size advisory.

The incorrect `x` key produced the expected coral error state, preserved the 3% progress, and changed the accuracy snapshot. Switching to Lesson 02 reset the timer and phrase and correctly highlighted `q`, while showing the lesson's saved 62% milestone.

## Windows simulator upgrade verification

The redesigned shell renders with a warm editorial learning frame around a dark simulated Windows desktop. Chapter 01 loads with Windows as the next key, the right-side mission steps, a key-focus strip, desktop icons, taskbar, and Start control. The visible Start control successfully opened the Start menu and advanced the mission to 25%, changing the next action to Arrow Down. The browser automation did not synthesize the Meta key as Windows, but the in-simulator Start control and mission state work correctly.

Chapter 01 end-to-end browser test passed through the visible simulator controls and keyboard events: Start control opened the Start menu, Arrow Down advanced selection, Enter opened the simulated Settings window, and Escape closed it. The chapter reached 100%, changed the course meter to 1 / 4 complete, marked all mission steps with teal checks, and displayed DONE. The Meta key could not be synthesized by sandbox browser automation, so the visible Start control was used for that first action.

Chapter 02 opened the Notepad simulator with a real textarea and visible menu/status chrome. Filling a 37-character note changed the coach message to request Ctrl + A. Pressing Control+A (reported by browser automation as Meta+A) advanced the mission to 50% and correctly changed the next key to Ctrl + C, confirming the corrected shortcut progression.

Notepad shortcut completion passed: Control+C advanced the mission to 75% and Control+V set the simulated status to “Copied & pasted”, marked Chapter 02 complete, and updated the course meter to 2 / 4 complete. Browser automation reports the shortcuts as Meta+C/Meta+V, but the mission state and UI feedback are correct.

Chapter 03 loaded the File Explorer simulator with visible address bar, sidebar, documents, and file tiles. Browser-level Control+L was intercepted/reported as Meta+L and did not advance the mission; a controlled in-page key event was dispatched for further validation. The simulator UI itself rendered correctly.

Chapter 03 mission passed through the simulated Explorer: controlled Ctrl+L focused the address bar and advanced to 25%, entering Documents and pressing Enter changed the path and advanced to 50%, F2 renamed the tile to practice-note.txt and advanced to 75%, and Delete changed the tile to “(in Recycle Bin)” and completed the chapter. Course meter reached 3 / 4 complete.

Chapter 04 loaded the browser simulator with tab strip, toolbar, address bar, search page, and the keyboard mission panel. A controlled Ctrl+L event is used for the same in-page validation because sandbox browser shortcut commands are reported with Meta modifiers.

Chapter 04 browser mission passed: controlled Ctrl+L focused the address bar and advanced to 25%, entering “typing practice” and pressing Enter rendered a simulated search result at 50%, controlled Ctrl+T opened a second virtual tab at 75%, and controlled Alt+Left returned to the practice page and completed the chapter. Course meter reached 4 / 4 complete and all four chapter rows showed completion checks.

## Professional laptop upgrade verification

The development preview exposes 77 clickable virtual-key buttons plus a touchpad surface. The on-screen layout includes Ctrl, Alt, Win, Shift, function keys, navigation keys, and visible held-modifier instructions. The published domain was still on the previous checkpoint during the first test, so the updated laptop experience must be checkpointed before public verification. A browser scroll limitation occurred because the preview viewport reported no scroll container; full-page screenshot verification confirmed the laptop deck is present.

The latest development preview verified the clickable keyboard: the Win key begins Chapter 01 as a desktop action, then virtual Arrow Down, Enter, and Escape completed the mission at 100%. A full Notepad flow was also verified through virtual keyboard clicks: typing a 33-character note, then Ctrl+A, Ctrl+C, and Ctrl+V reached DONE and changed the simulated status to “Copied & pasted”.

## Professional laptop simulator verification

After switching Vite to the repository root, the development preview loads from the new root `index.html`; the browser title is “Typing Yatra — Laptop Simulator” and the English-first chapter labels render correctly. The live preview exposes the full on-screen laptop keyboard and touchpad. The fixed virtual Win-key flow completed Chapter 01 using Win, Arrow Down, Enter, and Escape. The virtual Notepad flow completed through on-screen typing plus Ctrl+A, Ctrl+C, and Ctrl+V. A controlled touchpad click updated the visible status to “Click registered” and the notice to “Click detected on the practice touchpad.”
