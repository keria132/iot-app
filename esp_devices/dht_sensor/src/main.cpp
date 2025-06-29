#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <DHT.h>

#define WIFI_SSID "Tobik_Hata_EXT"
#define WIFI_PASSWORD "P4npYfYS"
#define DHTTYPE DHT22
#define DHTPIN 5

const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;

IPAddress local_IP(192, 168, 0, 101);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

AsyncWebServer server(80);
DHT dht(DHTPIN, DHTTYPE);
float temp = 0.0;
float hum = 0.0;
unsigned long lastReadTime = 0;
const unsigned long readInterval = 3000;

void connectWiFi();

void setup() {
  Serial.begin(115200);
  dht.begin();

  connectWiFi();
  WiFi.setAutoReconnect(true);

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Content-Type, Authorization, X-Requested-With");

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("Server status ok");
    request->send(200, "text/plain", "ok");
  });

  server.on("/getSensorData", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Sending data response");
    int32_t rssi = WiFi.RSSI();
    
    JsonDocument doc;
    doc["temperature"] = temp;
    doc["humidity"] = hum;
    doc["signalStrength"] = rssi;

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

  if (millis() - lastReadTime >= readInterval) {
    lastReadTime = millis();
    float newTemp = dht.readTemperature();
    float newHum = dht.readHumidity();

    if (!isnan(newTemp) && !isnan(newHum)) {
      temp = newTemp;
      hum = newHum;
      Serial.printf("Temp: %.2f, Hum: %.2f\n", temp, hum);
    } else {
      Serial.println("Failed to read from DHT sensor");
    }
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