# Typing Yatra — डिज़ाइन दिशा

## तीन संभावित दिशाएँ

### Theme Name: Quiet Study Desk
**Very Brief Intro:** काग़ज़, स्याही और warm coral के साथ एक शांत, editorial learning desk. भरोसेमंद, tactile और beginner-friendly अनुभव।
**Probability:** 0.07

### Theme Name: Signal Arcade
**Very Brief Intro:** गहरा navy canvas, bright key states और थोड़ा playful arcade energy. तेज़ feedback और short practice loops पर ज़ोर।
**Probability:** 0.03

### Theme Name: Sunlit Utility
**Very Brief Intro:** हल्का daylight UI, साफ़ utility panels और blue-green accents. सीधे, सरल और productivity-first keyboard trainer जैसा अनुभव।
**Probability:** 0.08

## चुनी गई दिशा: Quiet Study Desk

### Design Movement
Contemporary editorial learning tools — print-inspired surfaces, tactile illustration और calm utility dashboard का मेल।

### Core Principles
1. **Keyboard first:** हर screen पर असली सीखने वाला object, यानी keyboard, सबसे मजबूत visual anchor रहेगा।
2. **Warm clarity:** रंग और spacing beginner को शांत रखें; गलती को शर्मिंदगी नहीं बल्कि अगला संकेत बनाएं।
3. **Tactile progress:** keys, cards और progress marks में हल्का paper/desk feel होगा, ताकि practice mechanical नहीं लगे।
4. **Editorial rhythm:** बड़े offset headings, thin dividers और असममित blocks से page को lesson-sheet जैसा cadence मिलेगा।

### Color Philosophy
Background के लिए warm ivory paper रखा गया है, ताकि लंबे अभ्यास में आंखों पर तेज़ सफ़ेदी का दबाव न हो। Deep ink navy text और keyboard में भरोसा और readability देते हैं। Signature coral-saffron accent उस अगली key को आवाज़ देता है जिसे अभी दबाना है; muted teal mastery और सही उत्तर का शांत संकेत है।

### Layout Paradigm
Centralized marketing grid के बजाय **practice desk composition**: बायाँ rail daily journey दिखाता है, मुख्य क्षेत्र में keyboard और typing line है, और दायाँ slim coach panel अगला action बताता है। छोटे inset cards जगह-जगह notebook annotations की तरह बैठेंगे।

### Signature Elements
- **Key trail:** active key तक जाने वाला dotted/coral path और finger hint.
- **Desk cards:** off-white surfaces, fine navy rules, tiny uppercase metadata और pencil-like labels.
- **Progress stamp:** streak और level को छोटे circular/rectangular editorial stamps की तरह दिखाना।

### Interaction Philosophy
हर interaction छोटे, स्पष्ट और तुरंत feedback के साथ होगा। User physical keyboard से टाइप करे तो active key press हो, अगला अक्षर चमके, सही input पर teal pulse और गलती पर gentle coral nudge मिले। Buttons software controls जैसे नहीं, study desk के useful tools जैसे महसूस हों।

### Animation
Entrance पर rail, practice card और coach panel 30–60ms stagger के साथ ऊपर की ओर 8px से settle होंगे। Key press 120ms में scale 0.97 और shadow compression से tactile होगा। Correct character के लिए 180ms teal underline sweep, error के लिए 140ms horizontal nudge; लगातार typing के दौरान कोई भारी animation नहीं। `prefers-reduced-motion` पर सभी non-essential effects बंद।

### Typography System
Headings: **Fraunces** 600/700, थोड़ा character वाला editorial serif. Body and UI: **DM Sans** 400/500/700, साफ़ और screen-friendly. Labels uppercase में letter spacing के साथ; Hindi copy body में comfortable 1.6 line-height के साथ।

### Brand Essence
एक beginner-first keyboard coach जो computer की keys को डरावना नहीं, रोज़ की छोटी practice का हिस्सा बनाता है — **शांत, tactile, encouraging**।

### Brand Voice
Headlines छोटे, सीधे और हल्के मानवीय होंगे। CTAs action को डराए बिना invite करेंगे; microcopy गलती को सीखने की भाषा में बदलेगी।

उदाहरण:
- “उंगलियां घर पर रखें। रफ्तार अपने-आप आएगी।”
- “अगली key तैयार है — बस एक tap दूर।”

### Wordmark & Logo
Wordmark में “Typing” को थोड़ा bold और “Yatra” को italic editorial treatment दिया जाएगा; mark एक abstract keyboard key और ऊपर जाती सीढ़ी/path का होगा। Generated symbol-only mark header और favicon में रहेगा; wordmark CSS typography से composed होगा, default logo text image नहीं।

### Signature Brand Color
**Yatra Coral — #E76F51**, अगली key, active states और moments of encouragement का ownable signal.

## Implementation Reminder
हर CSS/component/page file के शीर्ष पर इस file के लिए style reminder लिखा जाएगा। Visual anchors के लिए generated assets के project URLs उपयोग होंगे:

- `/manus-storage/typing-yatra-mark_fa278fa1.png`
- `/manus-storage/typing-yatra-hero-desk_728facd5.jpg`
- `/manus-storage/typing-yatra-finger-guide_51e04413.jpg`
- `/manus-storage/typing-yatra-progress_547faea7.jpg`

## नई Ground-Truth Reference: Windows Simulator Learning Environment

यूज़र की दी हुई keyboard overview image अब visual और content reference है। Simulator में keyboard को केवल display नहीं करना है; हर chapter में संबंधित keys का वास्तविक उपयोग कराना है। Visual language में dark Windows-style desktop, numbered key groups, clear utility panels, shortcut callouts, और beginner tips शामिल होंगे।

### Chapter Architecture

| Chapter | Computer feel | मुख्य keyboard skills |
|---|---|---|
| 01 | Desktop और Start menu | Windows key, Esc, Tab, Arrow keys, Enter |
| 02 | Notepad में note बनाना | अक्षर, Shift, Backspace, Enter, Ctrl+A/C/V/S |
| 03 | File Explorer में folder संभालना | Ctrl+L, Arrow keys, F2, Delete, Enter |
| 04 | Browser में research task | Ctrl+L, Ctrl+T, Alt+Left, Tab, Space |
| 05 | Daily computer mission | multi-step shortcuts और स्वतंत्र task completion |

### Product Direction
यह guide नहीं बल्कि **Chapter-based Windows Simulator** है। User को एक simulated desktop मिलेगा; हर chapter में left mission briefing, center में interactive app window, bottom taskbar और right-side key/shortcut coach होगा। Chapter complete तभी माना जाएगा जब user सही keyboard actions से simulated task पूरा करे।

## Style Decisions

- The dark Windows simulator sits inside a warm editorial learning shell; the two layers must remain visibly distinct.
- Every chapter keeps a visible keyboard-learning anchor with the key group tied to that chapter's mission.
- Yatra Coral `#E76F51` marks the next required action and encouragement; muted teal marks completion, listening, and correct progress.
- Chapter UI uses paper surfaces, fine rules, course meters, and annotation-like labels so the experience feels like a patient Hindi keyboard coach over a simulator.
