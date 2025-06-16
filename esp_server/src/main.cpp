#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <DHT.h>
#include <LittleFS.h>

#define WIFI_SSID "Tobik_Hata_EXT"
#define WIFI_PASSWORD "P4npYfYS"

bool relayState = false;
const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

IPAddress local_IP(192, 168, 0, 100);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

AsyncWebServer server(80);

void connectWiFi();

void setup() {
  Serial.begin(115200);

  connectWiFi();
  
  if (!LittleFS.begin()) {
      Serial.println("LittleFS Mount Failed");

      return;
  }

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("server on");
    request->send(200, "text/plain", "Hello World!");
  });

  server.on("/api/dht", HTTP_GET, [](AsyncWebServerRequest *request) {
    int32_t rssi = WiFi.RSSI();
    float mockTemp = 2.2f;
    float mockHum = 0.6f;
    
    JsonDocument doc;
    doc["temperature"] = mockTemp;
    doc["humidity"] = mockHum;
    String response;
    serializeJson(doc, response);

    request->send(200, "application/json", response);
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