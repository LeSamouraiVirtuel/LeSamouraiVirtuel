// Configuration de l'ESP32. Par défaut : mode USB seul (WIFI_SSID vide).
// install.sh (sur le VPS) affiche les valeurs exactes à coller ici.
#pragma once

// Wi-Fi de la maison. Laisse WIFI_SSID vide ("") pour le mode USB seul.
#define WIFI_SSID   ""
#define WIFI_PASS   ""

// Relais sur le VPS
#define RELAY_HOST  "203.0.113.10"   // IP ou nom de domaine du VPS
#define RELAY_PORT  8765
#define RELAY_TOKEN "change-moi"

// Certificat du relais (affiché par install.sh), entre les guillemets R"( ... )"
static const char RELAY_CA[] = R"(-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
)";
