package com.typingyatra.simulator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Calculate
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Folder
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.Notes
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Window
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.roundToInt

private val Desktop = Color(0xFF103654)
private val Navy = Color(0xFF0B1220)
private val Panel = Color(0xFF172A3A)
private val Paper = Color(0xFFF5F1E8)
private val Coral = Color(0xFFFF856F)
private val Teal = Color(0xFF74D3C4)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { TypingYatraApp() }
    }
}

@Composable
fun TypingYatraApp() {
    MaterialTheme {
        Surface(modifier = Modifier.fillMaxSize(), color = Paper) {
            LaptopSimulator()
        }
    }
}

@Composable
private fun LaptopSimulator() {
    var openApp by remember { mutableStateOf<String?>(null) }
    var note by remember { mutableStateOf("") }
    var clipboard by remember { mutableStateOf("") }
    var heldModifier by remember { mutableStateOf<String?>(null) }
    var status by remember { mutableStateOf("Desktop ready — click, type, drag, and explore.") }
    var cursor by remember { mutableStateOf(Offset(0.78f, 0.60f)) }
    var startOpen by remember { mutableStateOf(false) }
    var leftClickCount by remember { mutableStateOf(0) }

    fun pressKey(label: String) {
        val modifier = listOf("Ctrl", "Alt", "Shift", "Win").contains(label)
        if (modifier) {
            heldModifier = if (heldModifier == label) null else label
            status = if (heldModifier == null) "$label released." else "$label held — click an action key."
            return
        }
        val chord = heldModifier?.let { "$it+$label" }
        heldModifier = null
        when (chord) {
            "Win+Enter" -> { startOpen = true; status = "Windows Start menu opened." }
            "Ctrl+A" -> { status = "Ctrl+A — all text selected." }
            "Ctrl+C" -> { clipboard = note; status = "Ctrl+C — text copied to virtual clipboard." }
            "Ctrl+V" -> { note += clipboard; status = "Ctrl+V — virtual clipboard pasted." }
            "Alt+Tab" -> { openApp = if (openApp == "notepad") "explorer" else "notepad"; status = "Alt+Tab — switched app window." }
            "Win+R" -> { status = "Win+R — Run dialog is ready in this simulator." }
            else -> {
                when {
                    openApp == "notepad" && label.length == 1 -> note += label
                    openApp == "notepad" && label == "Space" -> note += " "
                    openApp == "notepad" && label == "Backspace" -> note = note.dropLast(1)
                    openApp == "notepad" && label == "Enter" -> note += "\n"
                }
                status = "$label pressed."
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()).background(Paper)) {
        TopBar(status)
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
            Text("VIRTUAL LAPTOP / WINDOWS DESKTOP", color = Color(0xFF647184), fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.5.sp)
            Text("One computer. Use everything.", color = Navy, fontSize = 30.sp, fontWeight = FontWeight.Black, modifier = Modifier.padding(vertical = 10.dp))
            LaptopScreen(
                openApp = openApp,
                note = note,
                onNoteChange = { note = it },
                startOpen = startOpen,
                cursor = cursor,
                onOpenApp = { openApp = it; startOpen = false },
                onClose = { openApp = null },
                onStart = { startOpen = !startOpen },
                onCursorClick = { leftClickCount++; status = if (leftClickCount % 2 == 0) "Double-click registered." else "Left click registered." },
                onCursorMove = { dx, dy -> cursor = Offset((cursor.x + dx).coerceIn(0.04f, 0.96f), (cursor.y + dy).coerceIn(0.04f, 0.92f)) }
            )
            Spacer(Modifier.height(12.dp))
            LaptopDeck(heldModifier, ::pressKey, cursor, onCursorMove = { dx, dy -> cursor = Offset((cursor.x + dx).coerceIn(0.04f, 0.96f), (cursor.y + dy).coerceIn(0.04f, 0.92f)) }, onClick = { leftClickCount++; status = if (leftClickCount % 2 == 0) "Double-click registered." else "Left click registered." })
        }
    }
}

@Composable
private fun TopBar(status: String) {
    Row(Modifier.fillMaxWidth().background(Navy).padding(horizontal = 18.dp, vertical = 13.dp), verticalAlignment = Alignment.CenterVertically) {
        Icon(Icons.Default.Window, contentDescription = null, tint = Coral, modifier = Modifier.size(18.dp))
        Spacer(Modifier.width(8.dp))
        Text("typing", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 17.sp)
        Text("yatra", color = Coral, fontWeight = FontWeight.Bold, fontSize = 17.sp)
        Spacer(Modifier.weight(1f))
        Text("SYSTEM ONLINE  ·  Keyboard + Touchpad", color = Color(0xFFB6C2CF), fontSize = 11.sp)
    }
}

@Composable
private fun LaptopScreen(
    openApp: String?, note: String, onNoteChange: (String) -> Unit, startOpen: Boolean, cursor: Offset,
    onOpenApp: (String) -> Unit, onClose: () -> Unit, onStart: () -> Unit, onCursorClick: () -> Unit, onCursorMove: (Float, Float) -> Unit
) {
    Box(Modifier.fillMaxWidth().height(355.dp).clip(RoundedCornerShape(15.dp)).background(Color(0xFFBFCAD1)).padding(10.dp)) {
        Box(Modifier.fillMaxSize().clip(RoundedCornerShape(8.dp)).background(Desktop).pointerInput(Unit) { detectDragGestures { _, drag -> onCursorMove(drag.x / 500f, drag.y / 500f) } }) {
            Column(Modifier.fillMaxSize().padding(14.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    DesktopIcon(Icons.Default.Folder, "Documents") { onOpenApp("explorer") }
                    DesktopIcon(Icons.Default.Notes, "Notepad") { onOpenApp("notepad") }
                    DesktopIcon(Icons.Default.Language, "Browser") { onOpenApp("browser") }
                    Spacer(Modifier.weight(1f))
                    Text("typing yatra\nLEARN BY USING", color = Color(0xFFB5D0DE), fontSize = 10.sp, lineHeight = 13.sp)
                }
                Box(Modifier.fillMaxSize()) {
                    if (openApp != null) AppWindow(openApp, note, onNoteChange, onClose)
                    if (startOpen) StartMenu(onOpenApp)
                    Text("◆", color = Coral, fontSize = 22.sp, modifier = Modifier.align(Alignment.TopStart).offset((cursor.x * 260).dp, (cursor.y * 210).dp))
                }
            }
            Row(Modifier.align(Alignment.BottomCenter).fillMaxWidth().background(Navy.copy(alpha = .94f)).padding(6.dp), verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = onStart) { Icon(Icons.Default.Menu, contentDescription = "Start", tint = Color.White) }
                Text("Type to search", color = Color(0xFF9EB0C0), fontSize = 11.sp, modifier = Modifier.weight(1f))
                IconButton(onClick = { onOpenApp("explorer") }) { Icon(Icons.Default.Folder, contentDescription = "File Explorer", tint = Teal) }
                IconButton(onClick = { onOpenApp("notepad") }) { Icon(Icons.Default.Notes, contentDescription = "Notepad", tint = Coral) }
            }
        }
    }
}

@Composable
private fun DesktopIcon(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, onClick: () -> Unit) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(end = 16.dp)) {
        IconButton(onClick = onClick) { Icon(icon, contentDescription = label, tint = Color.White, modifier = Modifier.size(27.dp)) }
        Text(label, color = Color.White, fontSize = 10.sp)
    }
}

@Composable
private fun AppWindow(name: String, note: String, onNoteChange: (String) -> Unit, onClose: () -> Unit) {
    Column(Modifier.padding(top = 38.dp).fillMaxWidth(.84f).clip(RoundedCornerShape(8.dp)).background(Color.White).border(1.dp, Color(0xFF7C97AA), RoundedCornerShape(8.dp))) {
        Row(Modifier.fillMaxWidth().background(Color(0xFFE7EEF2)).padding(start = 10.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(when (name) { "notepad" -> "Untitled — Notepad"; "explorer" -> "File Explorer"; "browser" -> "Typing Yatra Browser"; else -> "App" }, color = Navy, fontSize = 12.sp, modifier = Modifier.weight(1f))
            IconButton(onClick = onClose, modifier = Modifier.size(34.dp)) { Icon(Icons.Default.Close, contentDescription = "Close", tint = Navy, modifier = Modifier.size(16.dp)) }
        }
        when (name) {
            "notepad" -> TextField(value = note, onValueChange = onNoteChange, modifier = Modifier.fillMaxWidth().height(180.dp), placeholder = { Text("Start typing here…") }, colors = TextFieldDefaults.colors(unfocusedContainerColor = Color.White, focusedContainerColor = Color.White))
            "explorer" -> ExplorerView()
            "browser" -> BrowserView()
        }
    }
}

@Composable
private fun ExplorerView() {
    Column(Modifier.padding(14.dp)) {
        Text("This PC  ›  Documents", color = Navy, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) { Icon(Icons.Default.Folder, contentDescription = null, tint = Color(0xFFE2A93B)); Text("Keyboard basics\nlesson-note.txt", color = Navy) }
    }
}

@Composable
private fun BrowserView() {
    Column(Modifier.padding(14.dp)) { Text("typingyatra.local", color = Color(0xFF557184), fontSize = 11.sp); Spacer(Modifier.height(10.dp)); Text("Practice web", color = Navy, fontSize = 20.sp, fontWeight = FontWeight.Bold); Text("A safe simulated browser for learning computer basics.", color = Color(0xFF647184)) }
}

@Composable
private fun StartMenu(onOpenApp: (String) -> Unit) {
    Column(Modifier.padding(start = 8.dp, top = 52.dp).width(210.dp).clip(RoundedCornerShape(8.dp)).background(Color(0xFF182C3C)).padding(12.dp)) {
        Text("Pinned apps", color = Color.White, fontWeight = FontWeight.Bold)
        Button(onClick = { onOpenApp("notepad") }, colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent)) { Icon(Icons.Default.Notes, contentDescription = null); Spacer(Modifier.width(8.dp)); Text("Notepad") }
        Button(onClick = { onOpenApp("explorer") }, colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent)) { Icon(Icons.Default.Folder, contentDescription = null); Spacer(Modifier.width(8.dp)); Text("File Explorer") }
        Button(onClick = { onOpenApp("browser") }, colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent)) { Icon(Icons.Default.Language, contentDescription = null); Spacer(Modifier.width(8.dp)); Text("Browser") }
    }
}

@Composable
private fun LaptopDeck(heldModifier: String?, pressKey: (String) -> Unit, cursor: Offset, onCursorMove: (Float, Float) -> Unit, onClick: () -> Unit) {
    Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(14.dp)).background(Color(0xFF253342)).padding(12.dp)) {
        Text("VIRTUAL LAPTOP KEYBOARD", color = Color(0xFFCBD7DF), fontSize = 10.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
        Spacer(Modifier.height(8.dp))
        val rows = listOf(listOf("Esc", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"), listOf("Tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "Backspace"), listOf("Caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Enter"), listOf("Shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "Shift"), listOf("Ctrl", "Alt", "Win", "Space", "Alt", "Ctrl"))
        Column(Modifier.horizontalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            rows.forEach { row -> Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) { row.forEach { key -> KeyButton(key, heldModifier == key, pressKey) } } }
        }
        Spacer(Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("PRECISION TOUCHPAD", color = Color(0xFFCBD7DF), fontSize = 10.sp, fontWeight = FontWeight.Bold)
            Box(Modifier.weight(1f).height(90.dp).clip(RoundedCornerShape(8.dp)).background(Color(0xFFE8EDF0)).border(1.dp, Coral, RoundedCornerShape(8.dp)).pointerInput(Unit) { detectDragGestures { _, drag -> onCursorMove(drag.x / 700f, drag.y / 700f) } }, contentAlignment = Alignment.Center) {
                Text("Move cursor · click · double-click\nHold and drag", color = Color(0xFF526272), fontSize = 11.sp)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(5.dp)) { Button(onClick = onClick, colors = ButtonDefaults.buttonColors(containerColor = Coral)) { Text("Left") }; Button(onClick = onClick, colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF506274))) { Text("Right") } }
        }
    }
}

@Composable
private fun KeyButton(label: String, held: Boolean, pressKey: (String) -> Unit) {
    val wide = label in listOf("Backspace", "Enter", "Shift", "Space", "Caps")
    Button(onClick = { pressKey(label) }, modifier = Modifier.width(if (wide) 74.dp else 42.dp).height(38.dp), contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp), colors = ButtonDefaults.buttonColors(containerColor = if (held) Coral else Color(0xFF394B5A), contentColor = Color.White), shape = RoundedCornerShape(4.dp)) { Text(label, fontSize = 9.sp) }
}
