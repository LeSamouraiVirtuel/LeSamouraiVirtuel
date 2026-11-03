// SamouraiLink : les "mains" de Claude.
// L'ESP32 se présente à l'iPhone comme une souris + un clavier Bluetooth
// ("ESP32 Keyboard/Mouse") et exécute les ordres reçus :
//   - par USB (port série 115200) : mode local, avec un PC ou un Pi branché ;
//   - par Wi-Fi : connexion WebSocket chiffrée (TLS) vers le relais du VPS.
//
// Arduino : core esp32 2.0.17, carte "ESP32 Dev Module",
//   Partition Scheme : "Huge APP (3MB No OTA/1MB SPIFFS)" (BLE + Wi-Fi + TLS = gros programme).
// Bibliothèques : ESP32-BLE-Combo (blackketter) + WebSockets 2.6.1 (Markus Sattler).
//
// Protocole (une commande par ligne/message, réponse "OK…" ou "ERR…") :
//   ?                 état Bluetooth : "OK connected" / "OK disconnected"
//   M dx dy           déplacement brut (-127..127)
//   G dx dy           déplacement fluide et précis (n'importe quelle taille, petits pas)
//   Z                 plaque le pointeur dans le coin haut-gauche (origine connue)
//   W n               molette (n>0 = vers le haut)
//   C L|R|M           clic ; P L|R|M = appuyer ; U L|R|M = relâcher
//   T texte           tape du texte ASCII
//   K NOM             ENTER TAB ESC BACKSPACE SPACE UP DOWN LEFT RIGHT, ou une lettre
//   H MODS NOM        raccourci : "H GUI SPACE", "H GUI,SHIFT 3"
//   X                 relâche tout
#include <BleCombo.h>
#include "config.h"
#include <WiFi.h>
#include <WebSocketsClient.h>

const int GLIDE_STEP = 4;      // petits pas : pas d'accélération du pointeur iOS
const int GLIDE_DELAY_MS = 8;

WebSocketsClient ws;
bool useWifi = false;
String serialLine;

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

void parseXY(const String &arg, long &x, long &y) {
  int sp = arg.indexOf(' ');
  x = arg.substring(0, sp).toInt();
  y = sp < 0 ? 0 : arg.substring(sp + 1).toInt();
}

void glide(long dx, long dy) {
  long n = max(labs(dx), labs(dy)) / GLIDE_STEP + 1;
  long doneX = 0, doneY = 0;
  for (long i = 1; i <= n; i++) {
    long tx = dx * i / n, ty = dy * i / n;
    if (tx != doneX || ty != doneY) {
      Mouse.move((signed char)(tx - doneX), (signed char)(ty - doneY));
      doneX = tx; doneY = ty;
      delay(GLIDE_DELAY_MS);
    }
    if (useWifi) ws.loop();   // garde la connexion vivante pendant les longs trajets
  }
}

String handle(String cmd) {
  cmd.trim();
  if (cmd.length() == 0) return "ERR empty";
  char op = cmd[0];
  String arg = cmd.length() > 2 ? cmd.substring(2) : "";

  if (op == '?') return Keyboard.isConnected() ? "OK connected" : "OK disconnected";
  if (!Keyboard.isConnected()) return "ERR iphone not connected (Bluetooth)";

  long x, y;
  switch (op) {
    case 'M': parseXY(arg, x, y); Mouse.move(constrain(x, -127, 127), constrain(y, -127, 127)); break;
    case 'G': parseXY(arg, x, y); glide(x, y); break;
    case 'Z': for (int i = 0; i < 30; i++) { Mouse.move(-127, -127); delay(5); } delay(150); break;
    case 'W': Mouse.move(0, 0, constrain(arg.toInt(), -127, 127)); break;
    case 'C': Mouse.click(mouseBtn(arg[0])); break;
    case 'P': Mouse.press(mouseBtn(arg[0])); break;
    case 'U': Mouse.release(mouseBtn(arg[0])); break;
    case 'T': for (unsigned int i = 0; i < arg.length(); i++) { Keyboard.write(arg[i]); delay(8); } break;
    case 'K': {
      int k = keyCode(arg);
      if (k < 0) return "ERR key";
      Keyboard.write(k);
      break;
    }
    case 'H': {
      int sp = arg.indexOf(' ');
      if (sp < 0) return "ERR usage: H MODS KEY";
      int k = keyCode(arg.substring(sp + 1));
      if (k < 0) return "ERR key";
      String mods = arg.substring(0, sp) + ",";
      mods.toUpperCase();
      int start = 0;
      while (start < (int)mods.length()) {
        int c = mods.indexOf(',', start);
        String m = mods.substring(start, c);
        if (m == "GUI" || m == "CMD") Keyboard.press(KEY_LEFT_GUI);
        else if (m == "CTRL") Keyboard.press(KEY_LEFT_CTRL);
        else if (m == "ALT") Keyboard.press(KEY_LEFT_ALT);
        else if (m == "SHIFT") Keyboard.press(KEY_LEFT_SHIFT);
        start = c + 1;
      }
      Keyboard.press(k);
      delay(60);
      Keyboard.releaseAll();
      break;
    }
    case 'X': Keyboard.releaseAll(); Mouse.release(MOUSE_LEFT); Mouse.release(MOUSE_RIGHT);
              Mouse.release(MOUSE_MIDDLE); break;
    default: return "ERR unknown";
  }
  return "OK";
}

void onWs(WStype_t type, uint8_t *payload, size_t length) {
  if (type == WStype_CONNECTED) Serial.println("Relais VPS : connecté");
  else if (type == WStype_DISCONNECTED) Serial.println("Relais VPS : déconnecté, nouvel essai…");
  else if (type == WStype_TEXT) {
    String reply = handle(String((char *)payload, length));
    ws.sendTXT(reply);
  }
}

void setup() {
  Serial.begin(115200);
  Keyboard.begin();
  Mouse.begin();
  useWifi = strlen(WIFI_SSID) > 0;
  if (useWifi) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASS);
    Serial.print("Wi-Fi");
    for (int i = 0; i < 40 && WiFi.status() != WL_CONNECTED; i++) { delay(500); Serial.print("."); }
    Serial.println(WiFi.status() == WL_CONNECTED ? " connecté" : " pas encore (nouvel essai en tâche de fond)");
    ws.beginSslWithCA(RELAY_HOST, RELAY_PORT, "/esp", RELAY_CA);
    ws.setExtraHeaders((String("Authorization: Bearer ") + RELAY_TOKEN).c_str());
    ws.onEvent(onWs);
    ws.setReconnectInterval(5000);
    ws.enableHeartbeat(15000, 5000, 2);
  }
  Serial.println("OK ready");
}

void loop() {
  if (useWifi) ws.loop();
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n') { Serial.println(handle(serialLine)); serialLine = ""; }
    else if (c != '\r') serialLine += c;
  }
}
