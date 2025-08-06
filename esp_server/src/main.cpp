#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <AsyncJson.h>
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
  String roomId;
  bool online;
};

struct Room {
  String name;
  String uuid;
};

std::vector<Device> devices;
std::vector<Room> rooms;

IPAddress local_IP(192, 168, 0, 100);
IPAddress gateway(192, 168, 0, 1);
IPAddress subnet(255, 255, 255, 0);

void connectWiFi();
void listDir(const char *dirname);
void saveToFS();
void loadFromFS();
void deleteFile(const char *path);
void addDevice(String name, String ip, String type, String roomId);
bool deleteDeviceByIP(String ip);
void deleteAllDevices();
bool addRoom(String name, String uuid);
bool assignRoom(String deviceIp, String roomId);
bool isRoomNameExists(const String &name);
bool deleteRoomById(String id);

AsyncWebServer server(80);

AsyncCallbackJsonWebHandler* devicePostHandler = new AsyncCallbackJsonWebHandler("/api/devices",
  [](AsyncWebServerRequest *request, JsonVariant &json) {
    Serial.printf("[JSON HANDLER] %s %s\n", request->methodToString(), request->url().c_str());

    String name = json["name"] | "";
    String ip = json["ip"] | "";
    String type = json["type"] | "";
    String roomId = json["roomId"] | "";

    if (name == "" || ip == "" || type == "") {
      request->send(400, "text/plain", "Missing required fields");
      return;
    }

    for (const auto& device : devices) {
      if (device.ip == ip) {
        request->send(409, "text/plain", "Device with this IP already exists");
        return;
      }
    }

    addDevice(name, ip, type, roomId);
    request->send(200, "text/plain", "Device added");
  }
);

AsyncCallbackJsonWebHandler* assignRoomPostHandler = new AsyncCallbackJsonWebHandler("/api/assign-room",
  [](AsyncWebServerRequest *request, JsonVariant &json) {
    Serial.printf("[JSON HANDLER] %s %s\n", request->methodToString(), request->url().c_str());

    String deviceIp = json["deviceIp"] | "";
    String roomId = json["roomId"] | "";

    if (deviceIp == "" || roomId == "") {
      request->send(400, "text/plain", "Missing ip or roomId");
      return;
    }

    if (assignRoom(deviceIp, roomId)) {
      request->send(200, "text/plain", "Room assigned to device");
    } else {
      request->send(404, "text/plain", "Device not found or room invalid");
    }
  }
);

AsyncCallbackJsonWebHandler* roomPostHandler = new AsyncCallbackJsonWebHandler("/api/rooms",
  [](AsyncWebServerRequest *request, JsonVariant &json) {
    Serial.printf("[JSON HANDLER] %s %s\n", request->methodToString(), request->url().c_str());

    String name = json["name"] | "";
    String uuid = json["uuid"] | "";

    if (name == "" || uuid == "") {
      request->send(400, "text/plain", "Missing name or room uuid");
    } 

    if (isRoomNameExists(name)) {
      request->send(409, "text/plain", "Room name already in use");
      return;
    }
    
    if (addRoom(name, uuid)) {
      request->send(200, "text/plain", "Room added");
    }
  }
);

void setup() {
  Serial.begin(115200);

  connectWiFi();
  WiFi.setAutoReconnect(true);
  
  if (!LittleFS.begin()) {
      Serial.println("LittleFS Mount Failed");
      return;
  }

  listDir("/");
  loadFromFS();

  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Content-Type, Authorization, X-Requested-With");

  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request){
    Serial.println("server root");
    request->send(200, "text/plain", "Hello World!");
  });

  server.on("/api/devices", HTTP_GET, [](AsyncWebServerRequest *request) {
    JsonDocument doc;
    JsonArray devicesArr = doc.to<JsonArray>();

    for (size_t i = 0; i < devices.size(); i++) {
      JsonObject deviceObj = devicesArr.add<JsonObject>();
      deviceObj["name"] = devices[i].name;
      deviceObj["ip"] = devices[i].ip;
      deviceObj["type"] = devices[i].type;
      deviceObj["online"] = devices[i].online;
      deviceObj["roomId"] = devices[i].roomId;
    }

    String response;
    serializeJson(devicesArr, response);
    request->send(200, "application/json", response);
  });

  server.on("/api/devices", HTTP_DELETE, [](AsyncWebServerRequest *request) {
    if (request->hasParam("ip")) {
      String ip = request->getParam("ip")->value();
      Serial.println("Deleting device with IP: " + ip);
      
      if (deleteDeviceByIP(ip)) {
        request->send(200, "text/plain", "Device deleted");
      } else {
        request->send(404, "text/plain", "Device not found");
      }
    } else {
      Serial.println("Deleting all devices");
      deleteAllDevices();
      
      request->send(200, "text/plain", "All devices deleted");
    }
  });

  server.on("/api/rooms", HTTP_GET, [](AsyncWebServerRequest *request) {
    JsonDocument doc;
    JsonArray roomsArr = doc.to<JsonArray>();

    for (const auto& room : rooms) {
      JsonObject roomObj = roomsArr.add<JsonObject>();
      roomObj["name"] = room.name;
      roomObj["uuid"] = room.uuid;
    }

    String response;
    serializeJson(roomsArr, response);
    request->send(200, "application/json", response);
  });

  server.on("/api/rooms", HTTP_DELETE, [](AsyncWebServerRequest *request) {
    if (request->hasParam("id")) {
      String id = request->getParam("id")->value();
      Serial.println("Deleting room with ID: " + id);
      
      if (deleteRoomById(id)) {
        request->send(200, "text/plain", "Room deleted");
      } else {
        request->send(404, "text/plain", "Room not found");
      }
    } else {
      Serial.println("Deleting all rooms");
      // deleteAllRooms() TODO: delete all rooms here
      
      request->send(200, "text/plain", "All devices deleted");
    }
  });

  server.on("/api/wipe", HTTP_DELETE, [](AsyncWebServerRequest *request) {
    if (LittleFS.remove("/data.json")) request->send(200, "text/plain", "Wipe successful");;
  });

  //POST AsyncJson handlers
  server.addHandler(devicePostHandler);
  server.addHandler(assignRoomPostHandler);
  server.addHandler(roomPostHandler);

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
      Serial.print(url);

      if (http.begin(client, url)) {
        int httpCode = http.GET();
        devices[i].online = httpCode == 200;
        http.end();
        Serial.println(" " + String(httpCode));
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

void saveToFS() {
  File file = LittleFS.open("/data.json", "w");
  if (!file) {
    Serial.println("Failed to open /data.json for writing");
    return;
  }

  JsonDocument doc;
  JsonObject root = doc.to<JsonObject>();

  JsonArray devicesArr = root["devices"].to<JsonArray>();
  for (const auto& device : devices) {
    Serial.println("Saving new device...");
    JsonObject newDevice = devicesArr.add<JsonObject>();
    newDevice["name"] = device.name;
    newDevice["ip"] = device.ip;
    newDevice["type"] = device.type;
    newDevice["online"] = device.online;
    newDevice["roomId"] = device.roomId;
  }

  JsonArray roomsArr = root["rooms"].to<JsonArray>();
  for (const auto& room : rooms) {
    JsonObject newRoom = roomsArr.add<JsonObject>();
    newRoom["name"] = room.name;
    newRoom["uuid"] = room.uuid;
  }

  if (serializeJson(root, file) == 0) {
    Serial.println("Failed to write combined data to JSON");
  } else {
    Serial.println("Saved combined data to FS");
  }

  file.close();
}

void loadFromFS() {
  File file = LittleFS.open("/data.json", "r");
  if (!file) {
    Serial.println("No existing data file");
    return;
  }

  JsonDocument doc;
  DeserializationError error = deserializeJson(doc, file);
  if (error) {
    Serial.println("Failed to parse data.json");
    file.close();
    return;
  }

   if (doc.overflowed()) {
    Serial.println("Warning: JsonDocument overflowed while parsing (unexpected for v7)");
  }

  devices.clear();
  if (doc["devices"].is<JsonArray>()) {
    for (JsonObject device : doc["devices"].as<JsonArray>()) {
      Device newDevice;
      newDevice.name = device["name"].as<String>();
      newDevice.ip = device["ip"].as<String>();
      newDevice.type = device["type"].as<String>();
      newDevice.online = false;
      newDevice.roomId = device["roomId"] | String("");
      devices.push_back(newDevice);
    }
  }

  rooms.clear();
  if (doc["rooms"].is<JsonArray>()) {
    for (JsonObject room : doc["rooms"].as<JsonArray>()) {
      Room newRoom;
      newRoom.name = room["name"].as<String>();
      newRoom.uuid = room["uuid"].as<String>();
      rooms.push_back(newRoom);
    }
  }

  file.close();
}

void addDevice(String name, String ip, String type, String roomId) {
  Device newDevice = { name, ip, type, roomId, false };
  devices.push_back(newDevice);
  saveToFS();
}

void deleteFile(const char *path) {
  Serial.printf("Deleting file: %s\n", path);
  if (LittleFS.remove(path)) {
    Serial.println("File deleted");
  } else {
    Serial.println("Delete failed");
  }
}

bool deleteDeviceByIP(String ip) {
  bool found = false;

  for (size_t i = 0; i < devices.size(); ++i) {
    if (devices[i].ip == ip) {
      devices.erase(devices.begin() + i);
      found = true;
      break;
    }
  }

  if (found) {
    saveToFS();
    Serial.println("Device deleted and filesystem updated");
  } else {
    Serial.println("Device not found");
  }

  return found;
}

void deleteAllDevices() {
  devices.clear();
  saveToFS();
  Serial.println("All devices deleted from memory and filesystem");
}

bool addRoom(String name, String uuid) {
  for (const auto& room : rooms) {
    if (room.uuid == uuid){
      Serial.println("Error - duplicate uuid detected, return");
      return false;
    };
  };

  Room newRoom = { name, uuid };
  rooms.push_back(newRoom);
  saveToFS();
  
  return true;
}

bool assignRoom(String deviceIp, String roomId) {
  bool roomExists = false;
  for (const auto& r : rooms) {
    if (r.uuid == roomId) {
      roomExists = true;
      break;
    }
  }

  if (!roomExists) {
    Serial.println("Attempted to assign non-existent room UUID");
    return false;
  }

  for (auto& device : devices) {
    if (device.ip == deviceIp) {
      device.roomId = roomId;
      saveToFS();
      return true;
    }
  }
  
  return false;
}

bool isRoomNameExists(const String &name) {
  String target = name;
  target.trim();
  target.toLowerCase();

  for (const auto &room : rooms) {
    String existing = room.name;
    existing.trim();
    existing.toLowerCase();

    if (existing == target) return true;
  }

  return false;
}

bool deleteRoomById(String id) {
  bool found = false;

  for (size_t i = 0; i < rooms.size(); ++i) {
    if (rooms[i].uuid == id) {
      rooms.erase(rooms.begin() + i);
      found = true;
      break;
    }
  }

  if (found) {
    saveToFS();
    Serial.println("Room deleted and filesystem updated");
  } else {
    Serial.println("Room not found");
  }

  return found;
}