#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>

#define WIFI_SSID "Tobik_Hata_EXT"
#define WIFI_PASSWORD "P4npYfYS"
#define RELAYPIN 4

const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

IPAddress local_IP(192, 168, 0, 102);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

AsyncWebServer server(80);

void connectWiFi();

void setup() {
  Serial.begin(115200);
  pinMode(RELAYPIN, OUTPUT);

  connectWiFi();
  WiFi.setAutoReconnect(true);

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Content-Type, Authorization, X-Requested-With");

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("Server status ok");
    request->send(200, "text/plain", "ok");
  });

  server.on("/relayStatus", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Sending data response");
    int32_t rssi = WiFi.RSSI();
    bool isOn = digitalRead(RELAYPIN) == HIGH;
    
    JsonDocument doc;
    doc["relayStatus"] = isOn;
    doc["signalStrength"] = rssi;

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  server.on("/relayStatus", HTTP_POST, [](AsyncWebServerRequest *request){
    if (!request->hasParam("state", true)) {
      request->send(400, "text/plain", "Missing 'state' parameter");
      return;
    }

    String stateStr = request->getParam("state", true)->value();
    stateStr.toLowerCase();

    if (stateStr == "true") {
      digitalWrite(RELAYPIN, HIGH);
      request->send(200, "text/plain", "Relay turned ON");
    } else if (stateStr == "false") {
      digitalWrite(RELAYPIN, LOW);
      request->send(200, "text/plain", "Relay turned OFF");
    } else {
      request->send(400, "text/plain", "Invalid state value, expected 'true' or 'false'");
    }
  });

  server.begin();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected! Reconnecting...");
    connectWiFi();
  }
}

void connectWiFi() {
  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("STA Failed to configure");
  }
  Serial.println();
  Serial.println("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");
  Serial.println(WiFi.localIP());

  delay(1000);
}