#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <ESP8266HTTPClient.h>
#include <LittleFS.h>
#include <vector>

#define WIFI_SSID "Tobik_Hata_EXT"
#define WIFI_PASSWORD "P4npYfYS"

const char *ssid = WIFI_SSID;
const char *password = WIFI_PASSWORD;
unsigned long lastPing = 0;
const unsigned long pingInterval = 5000;

struct Device {
  String name;
  String ip;
  String type;
  bool online;
};
std::vector<Device> devices;

IPAddress local_IP(192, 168, 0, 100);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

AsyncWebServer server(80);

void connectWiFi();
void listDir(const char *dirname);
void loadDevicesFromFS();
void addDevice(String name, String ip, String type);
void deleteFile(const char *path);

void setup() {
  Serial.begin(115200);

  connectWiFi();
  WiFi.setAutoReconnect(true);
  
  if (!LittleFS.begin()) {
      Serial.println("LittleFS Mount Failed");

      return;
  }

  listDir("/");
  loadDevicesFromFS();
  // addDevice("New Sensor", "192.168.0.101", "dht");  // ADD HARDCODED DEVICE FOR TESTING

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Content-Type, Authorization, X-Requested-With");

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("server root");
    request->send(200, "text/plain", "Hello World!");
  });

  server.on("/api/devices", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Sensor data requested");
    JsonDocument doc;
    JsonArray arr = doc.to<JsonArray>();

    for (size_t i = 0; i < devices.size(); i++) {
      JsonObject device = arr.add<JsonObject>();
      device["name"] = devices[i].name;
      device["ip"] = devices[i].ip;
      device["type"] = devices[i].type;
      device["online"] = devices[i].online;
    }

    String response;
    serializeJson(doc, response);
    request->send(200, "application/json", response);
  });

  server.on("/api/devices", HTTP_DELETE, [](AsyncWebServerRequest *request) {
    deleteFile("/devices.json");
    devices.clear();
    Serial.println("All devices deleted");

    request->send(200, "text/plain", "ok");
  });

  server.on("/api/devices", HTTP_POST, [](AsyncWebServerRequest *request) {
    request->send(200);
  });

  server.onNotFound([](AsyncWebServerRequest *request) {
  if (request->method() == HTTP_OPTIONS) {

    Serial.println("Preflight cors");
    AsyncWebServerResponse *response = request->beginResponse(200);
    // TODO: ADD SECURITY FEATURES LATER
    // response->addHeader("Access-Control-Allow-Origin", "*");
    // response->addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    // response->addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    request->send(response);
  } else {
    request->send(404, "text/plain", "Not found");
  }
});

  server.begin();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi Disconnected! Reconnecting...");
    connectWiFi();
  }

  if (millis() - lastPing >= pingInterval) {
    lastPing = millis();
    Serial.println("Pinging the devices");

    for (size_t i = 0; i < devices.size(); i++) {
      WiFiClient client;
      HTTPClient http;
      String url = "http://" + devices[i].ip;
      Serial.print("Device url:");
      Serial.println(url);

      if (http.begin(client, url)) {
        int httpCode = http.GET();
        devices[i].online = httpCode == 200;
        http.end();
        Serial.println(httpCode);
      } else {
        devices[i].online = false;
        Serial.println("Failed to ping the device");
      }
    }
  }
}

//FUNCTIONS

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

void listDir(const char *dirname) {
  Serial.printf("Listing directory: %s\n", dirname);

  Dir root = LittleFS.openDir(dirname);

  while (root.next()) {
    File file = root.openFile("r");
    Serial.print("  FILE: ");
    Serial.print(root.fileName());
    Serial.print("  SIZE: ");
    Serial.print(file.size());
    time_t creationTime = file.getCreationTime();
    time_t lastWrite = file.getLastWrite();
    file.close();
    struct tm *tmstruct = localtime(&creationTime);
    Serial.printf("    CREATION: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
    tmstruct = localtime(&lastWrite);
    Serial.printf("  LAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n", (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1, tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min, tmstruct->tm_sec);
  }
}

void saveDevicesToFS() {
  File file = LittleFS.open("/devices.json", "w");
  if (!file) {
    Serial.println("Failed to open /devices.json for writing");
    return;
  }

  JsonDocument doc;
  JsonArray arr = doc.to<JsonArray>();

  for (const auto& device : devices) {
    JsonObject obj = arr.add<JsonObject>();
    obj["name"] = device.name;
    obj["ip"] = device.ip;
    obj["type"] = device.type;
    obj["online"] = device.online;
  }

  if (serializeJson(doc, file) == 0) {
    Serial.println("Failed to write devices to JSON");
  } else {
    Serial.println("Saved devices to FS");
  }

  file.close();
}

void loadDevicesFromFS() {
  File file = LittleFS.open("/devices.json", "r");
  if (!file) {
    Serial.println("Failed to open /devices.json");
    return;
  }

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, file);
  if (error) {
    Serial.println("Failed to parse devices.json");
    return;
  }

  devices.clear();  // Clear existing list

  for (JsonObject obj : doc.as<JsonArray>()) {
    Device d;
    d.name = obj["name"].as<String>();
    d.ip = obj["ip"].as<String>();
    d.type = obj["type"].as<String>();
    d.online = false; // will be updated during ping
    devices.push_back(d);
  }

  file.close();
}

void addDevice(String name, String ip, String type) {
  Device newDevice = { name, ip, type, false };
  devices.push_back(newDevice);
  saveDevicesToFS();  // Persist it
}

void deleteFile(const char *path) {
  Serial.printf("Deleting file: %s\n", path);
  if (LittleFS.remove(path)) {
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}