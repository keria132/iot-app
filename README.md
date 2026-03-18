# IoT Smart Home Dashboard

A full-stack smart home dashboard for controlling and monitoring ESP8266-based devices over a local Wi-Fi network.
Built with a Next.js frontend and a firmware hub that coordinates device registration, room organization, and real-time status polling.

> **Status:** Working MVP - local network only. Remote access via a cloud backend is planned.

---

## Server Features

- **Device management** - register, delete, and assign ESP devices to rooms via the dashboard UI
- **Room organization** - group devices into named rooms, view all devices by room or by type
- **Signal strength indicators** - live RSSI-based Wi-Fi status icon per device
- **Persistent storage** - hub stores device and room registry on-chip using LittleFS (survives reboots)

## Device features

- **Relay control** - toggle GPIO relay modules on/off with optimistic UI updates
- **Sensor monitoring** - real-time temperature and humidity readings from DHT22 modules (polled)

## Frontend deatures

- **UI Dashboards** - dashboards to manage devices and rooms (in progress)
- **Dark / light theme** - system-aware, switchable from the header

---

## Architecture

Right now it's based on the main ESP-server that keeps added devices and rooms in memory
with LittleFS and communicates them to frontend. Frontend directly communicates with the added devices
to pull or send the data. All this happens in a local network.

Planned: cloud backend + auth layer for remote access

**Data flows:**

- The frontend talks to the hub for device/room registry (CRUD)
- The frontend polls each device directly for live sensor/relay data
- All registry data is persisted on the hub's flash via LittleFS

---

## Tech Stack

| Layer                 | Technology                                    |
| --------------------- | --------------------------------------------- |
| Frontend              | Next.js 15, React, TypeScript                 |
| State / data fetching | TanStack Query v5                             |
| UI components         | shadcn/ui, Tailwind CSS v4                    |
| Form validation       | Zod v4                                        |
| Hub firmware          | C++, ESPAsyncWebServer, ArduinoJson, LittleFS |
| Build tools           | PlatformIO                                    |
| Hardware              | ESP8266 boards with platformio support        |

---

## Project Structure

```
iot-app/
├── frontend/                  # Next.js dashboard
│   └── src/
│       ├── app/               # Next.js app router
│       ├── components/        # UI components by feature
│       │   ├── Dashboard/     # Dashboard tab (weather, AC widget)
│       │   ├── Devices/       # Device cards, add/delete, relay, DHT
│       │   ├── Header/        # App header, theme switch
│       │   ├── Home/          # Tab layout
│       │   ├── Rooms/         # Room panel, add room
│       │   └── ui/            # shadcn/ui + custom base components
│       └── lib/
│           ├── hooks/         # Custom React Query mutation hooks
│           ├── schemas/       # Zod validation schemas
│           ├── services/      # Fetch wrappers (devices, rooms, relays, sensors)
│           └── types/         # Shared TypeScript types
│
├── esp_server/                # Server firmware (NodeMCU)
│   └── src/main.cpp
│
└── esp_devices/
    ├── relay/                 # Relay device firmware (D1 Mini Pro)
    │   └── src/main.cpp
    └── dht_sensor/            # DHT22 sensor firmware (D1 Mini Pro)
        └── src/main.cpp
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [PlatformIO CLI](https://docs.platformio.org/en/latest/core/installation/index.html) or PlatformIO IDE (VS Code extension)
- ESP8266 boards: any ESP8266 chip with platformio support

### 1. Configure hardware

Each firmware project requires a `config.h` file (gitignored).

Edit each `config.h` with your Wi-Fi credentials and the static IP you want to assign to that board. The device IPs must be free on your network and must match what you register in the dashboard.

```
// Wi-Fi credentials
#define WIFI_SSID     "your_wifi_ssid"
#define WIFI_PASSWORD "your_wifi_password"
```

### 2. Flash firmware

```bash
# Flash the hub
cd esp_server
pio run --target upload

# Flash relay device
cd ../esp_devices/relay
pio run --target upload

# Flash DHT sensor
cd ../dht_sensor
pio run --target upload
```

Open PlatformIO serial monitor (`pio device monitor`) to confirm each board connects and prints its assigned IP.

### 3. Configure the frontend

In `frontend/src/lib/constants.ts`, set `MAIN_HUB_IP` to match the server hub's static IP:

```ts
export const MAIN_HUB_IP = "http://192.168.0.100";
```

> This will move to an environment variable (`.env.local`) in a future.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard will connect to the hub and display any registered devices.

---

## API Reference

The hub exposes a REST API on port 80. All request bodies use `application/json`. All responses are `text/plain` unless noted.

### Devices

| Method   | Path                   | Body                          | Description                                  |
| -------- | ---------------------- | ----------------------------- | -------------------------------------------- |
| `GET`    | `/api/devices`         | -                             | Returns all registered devices as JSON array |
| `POST`   | `/api/devices`         | `{ name, ip, type, roomId? }` | Register a new device                        |
| `DELETE` | `/api/devices?ip=<ip>` | -                             | Delete a specific device by IP               |
| `DELETE` | `/api/devices`         | -                             | Delete all devices                           |

### Rooms

| Method   | Path                   | Body             | Description                     |
| -------- | ---------------------- | ---------------- | ------------------------------- |
| `GET`    | `/api/rooms`           | -                | Returns all rooms as JSON array |
| `POST`   | `/api/rooms`           | `{ name, uuid }` | Create a new room               |
| `DELETE` | `/api/rooms?id=<uuid>` | -                | Delete a room by UUID           |

### Room assignment

| Method | Path               | Body                   | Description               |
| ------ | ------------------ | ---------------------- | ------------------------- |
| `POST` | `/api/assign-room` | `{ deviceIp, roomId }` | Assign a device to a room |

### Utility

| Method   | Path        | Description                      |
| -------- | ----------- | -------------------------------- |
| `DELETE` | `/api/wipe` | Wipe all data from flash storage |

---

### Device endpoints (per-device, hit directly by the frontend)

**Relay** (`http://<device-ip>`)

| Method | Path           | Description                                                       |
| ------ | -------------- | ----------------------------------------------------------------- |
| `GET`  | `/relayStatus` | Returns `{ relayStatus: bool, signalStrength: number }`           |
| `POST` | `/relayStatus` | Body: `state=true\|false` (form-encoded). Toggles the GPIO relay. |

**DHT22 sensor** (`http://<device-ip>`)

| Method | Path             | Description                                                               |
| ------ | ---------------- | ------------------------------------------------------------------------- |
| `GET`  | `/getSensorData` | Returns `{ temperature: float, humidity: float, signalStrength: number }` |

---

## Roadmap

### Phase 1 - Local experience (current focus)

- [ ] Device auto-discovery via UDP broadcast - devices announce themselves to
      the hub on boot; frontend shows a "discovered devices" picker instead of
      manual IP entry
- [ ] Better configuration and environment variables
- [ ] Delete room cascade - un-assign devices when their room is deleted
- [ ] Add security features to the main server hub

### Phase 2 - Cloud backend

- [ ] NestJS backend with JWT authentication and user profiles
- [ ] Migrate device + room registry from ESP hub LittleFS to backend database
      (local server retains only ping loop and local device communication)
- [ ] Remote registry access - view and manage your device list from outside
      the local network when authenticated
- [ ] Widgets - external weather API integration
- [ ] Notification system - temperature threshold alerts, device offline alerts

### Phase 3 - Remote control

- [ ] MQTT broker integration - hub maintains persistent outbound connection
      so commands can be routed from the cloud to LAN devices
- [ ] Full remote control - relay toggle and sensor readings from anywhere
- [ ] Air conditioner widget - IR blaster device integration
