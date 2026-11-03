// SamouraiLink : les "mains" de Claude.
// Un ESP32 se présente à l'iPhone comme une souris + un clavier Bluetooth,
// et obéit aux ordres reçus sur le port série (USB) depuis le Raspberry Pi / PC.
//
// Matériel : n'importe quelle carte ESP32 "classique" (ESP32-WROOM-32, DevKit V1…).
// Arduino IDE : carte "ESP32 Dev Module", core esp32 version 2.0.17
// Bibliothèque : ESP32-BLE-Combo (https://github.com/blackketter/ESP32-BLE-Combo), en .zip
//
// Protocole (une commande par ligne, 115200 bauds) :
//   ?                 -> "OK connected" ou "OK disconnected"
//   M dx dy           déplace la souris (relatif, -127..127)
//   W n               molette (n>0 vers le haut)
//   C L|R|M           clic gauche/droit/milieu
//   P L|R|M / U L|R|M appuie / relâche un bouton (glisser)
//   T texte           tape du texte (ASCII)
//   K NOM             touche : ENTER TAB ESC BACKSPACE SPACE UP DOWN LEFT RIGHT
//   H MODS NOM        raccourci, ex : "H GUI SPACE", "H GUI,SHIFT 3", "H CTRL A"
//   X                 relâche tout
#include <BleCombo.h>

String line;

int mouseBtn(char c) {
  if (c == 'R') return MOUSE_RIGHT;
  if (c == 'M') return MOUSE_MIDDLE;
  return MOUSE_LEFT;
}

int keyCode(String n) {
  n.toUpperCase();
  if (n == "ENTER") return KEY_RETURN;
  if (n == "TAB") return KEY_TAB;
  if (n == "ESC") return KEY_ESC;
  if (n == "BACKSPACE") return KEY_BACKSPACE;
  if (n == "SPACE") return ' ';
  if (n == "UP") return KEY_UP_ARROW;
  if (n == "DOWN") return KEY_DOWN_ARROW;
  if (n == "LEFT") return KEY_LEFT_ARROW;
  if (n == "RIGHT") return KEY_RIGHT_ARROW;
  if (n.length() == 1) return tolower(n[0]);
  return -1;
}

void handle(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return;
  char op = cmd[0];
  String arg = cmd.length() > 2 ? cmd.substring(2) : "";

  if (op == '?') { Serial.println(Keyboard.isConnected() ? "OK connected" : "OK disconnected"); return; }
  if (!Keyboard.isConnected()) { Serial.println("ERR not connected"); return; }

  if (op == 'M') {
    int sp = arg.indexOf(' ');
    int dx = constrain(arg.substring(0, sp).toInt(), -127, 127);
    int dy = constrain(arg.substring(sp + 1).toInt(), -127, 127);
    Mouse.move(dx, dy, 0);
  } else if (op == 'W') {
    Mouse.move(0, 0, constrain(arg.toInt(), -127, 127));
  } else if (op == 'C') {
    Mouse.click(mouseBtn(arg[0]));
  } else if (op == 'P') {
    Mouse.press(mouseBtn(arg[0]));
  } else if (op == 'U') {
    Mouse.release(mouseBtn(arg[0]));
  } else if (op == 'T') {
    for (unsigned int i = 0; i < arg.length(); i++) { Keyboard.write(arg[i]); delay(8); }
  } else if (op == 'K') {
    int k = keyCode(arg);
    if (k < 0) { Serial.println("ERR key"); return; }
    Keyboard.write(k);
  } else if (op == 'H') {
    int sp = arg.indexOf(' ');
    String mods = arg.substring(0, sp) + ",";
    int k = keyCode(arg.substring(sp + 1));
    if (k < 0) { Serial.println("ERR key"); return; }
    int start = 0;
    while (start < (int)mods.length()) {
      int c = mods.indexOf(',', start);
      String m = mods.substring(start, c); m.toUpperCase();
      if (m == "GUI" || m == "CMD") Keyboard.press(KEY_LEFT_GUI);
      else if (m == "CTRL") Keyboard.press(KEY_LEFT_CTRL);
      else if (m == "ALT") Keyboard.press(KEY_LEFT_ALT);
      else if (m == "SHIFT") Keyboard.press(KEY_LEFT_SHIFT);
      start = c + 1;
    }
    Keyboard.press(k);
    delay(60);
    Keyboard.releaseAll();
  } else if (op == 'X') {
    Keyboard.releaseAll();
    Mouse.release(MOUSE_LEFT); Mouse.release(MOUSE_RIGHT); Mouse.release(MOUSE_MIDDLE);
  } else {
    Serial.println("ERR unknown"); return;
  }
  Serial.println("OK");
}

void setup() {
  Serial.begin(115200);
  Keyboard.deviceName = "SamouraiLink";
  Keyboard.begin();
  Mouse.begin();
  Serial.println("OK ready");
}

void loop() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') { handle(line); line = ""; }
    else if (c != '\r') line += c;
  }
}
