#include <WiFi.h>
#include <WiFiManager.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <Preferences.h>
#include <Ticker.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// ===== DISPLAY =====
LiquidCrystal_I2C lcd(0x27, 16, 2);

// ===== PINES =====
#define IN1 32
#define IN2 33
#define IN3 25
#define IN4 26

// ===== CONFIG =====
Preferences prefs;
String webhookURL = "";
int intervaloMin = 5;

// Parametros personalizados de WiFiManager
WiFiManagerParameter custom_webhook("webhook", "URL Webhook", "", 120);
WiFiManagerParameter custom_intervalo("intervalo", "Intervalo (min)", "5", 5);

// Timer
Ticker timer;

// ===== FUNCION ENVIO WEBHOOK =====
void enviarWebhook() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("No hay WiFi, no envio");
    return;
  }

  int v1 = digitalRead(IN1);
  int v2 = digitalRead(IN2);
  int v3 = digitalRead(IN3);
  int v4 = digitalRead(IN4);

  StaticJsonDocument<256> doc;
  doc["in1"] = v1;
  doc["in2"] = v2;
  doc["in3"] = v3;
  doc["in4"] = v4;
  doc["timestamp"] = (long)time(NULL);

  String payload;
  serializeJson(doc, payload);

  HTTPClient http;
  http.begin(webhookURL);
  http.addHeader("Content-Type", "application/json");

  int code = http.POST(payload);
  http.end();

  Serial.printf("Sent -> %d\n", code);

  // Mostrar en pantalla
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Enviado:");
  lcd.setCursor(0,1);
  lcd.print("Code: ");
  lcd.print(code);
}


// ===== SETUP =====
void setup() {
  Serial.begin(115200);

  // --- Pantalla ---
  lcd.init();
  lcd.backlight();
  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Iniciando...");
  
  // --- Pines ---
  pinMode(IN1, INPUT_PULLUP);
  pinMode(IN2, INPUT_PULLUP);
  pinMode(IN3, INPUT_PULLUP);
  pinMode(IN4, INPUT_PULLUP);

  // --- Leer configuraciones guardadas ---
  prefs.begin("config", false);
  webhookURL = prefs.getString("webhook", "");
  intervaloMin = prefs.getInt("intervalo", 5);
  prefs.end();

  // --- WiFiManager ---
  WiFiManager wm;
  wm.addParameter(&custom_webhook);
  wm.addParameter(&custom_intervalo);

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("Esperando");
  lcd.setCursor(0,1);
  lcd.print("Config...");

  if (!wm.autoConnect("BIT DATALOG")) {
    Serial.println("Error WiFi. Restart.");
    ESP.restart();
  }

  // --- Guardar datos ingresados ---
  String newWebhook = custom_webhook.getValue();
  String newIntervalo = custom_intervalo.getValue();

  prefs.begin("config", false);
  if (newWebhook.length() > 0) {
    prefs.putString("webhook", newWebhook);
    webhookURL = newWebhook;
  }
  if (newIntervalo.length() > 0) {
    prefs.putInt("intervalo", newIntervalo.toInt());
    intervaloMin = newIntervalo.toInt();
  }
  prefs.end();

  Serial.println("=== CONFIG FINAL ===");
  Serial.println("Webhook: " + webhookURL);
  Serial.printf("Intervalo: %d min\n", intervaloMin);

  lcd.clear();
  lcd.setCursor(0,0);
  lcd.print("WiFi OK:");
  lcd.setCursor(0,1);
  lcd.print(WiFi.localIP().toString().c_str());

  // --- Programar envío ---
  timer.attach(intervaloMin * 60, enviarWebhook);  // min → seg
}


// ===== LOOP =====
void loop() {
  // Nada aquí, todo por timer
}
