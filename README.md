# Real-Time Event Ticketing System (Ticket Simulator)

## Overview

The **Real-Time Event Ticketing System** is a full-stack simulation platform demonstrating advanced **Producer-Consumer concurrency patterns**. It models a real-world scenario where multiple Vendors (Producers) release tickets and multiple Customers (Consumers) compete to purchase them simultaneously.

The system features a **CLI-based configuration module**, a robust **Spring Boot backend** handling multithreaded logic, and a reactive **Next.js frontend** visualizing real-time transaction throughput via WebSockets.

---

## Key Features

### Core Functionality
- **Concurrent Execution:** Utilizes Java multithreading to simulate hundreds of simultaneous vendor releases and customer purchases.
- **Real-Time Visualization:** WebSocket integration pushes live updates (ticket availability, sales logs) to the dashboard without refreshing.
- **Dynamic Configuration:** Users can adjust simulation parameters (Release Rate, Retrieval Rate, Max Capacity) on the fly.
- **Data Persistence:** All simulation data and transaction logs are persisted in a cloud-based **MySQL (TiDB)** database.

### Technical Highlights
- **Backend:** Spring Boot, JPA/Hibernate, WebSocket (STOMP), Thread Pool Management.
- **Frontend:** Next.js (TypeScript), Tailwind CSS, Recharts for live data visualization.
- **Database:** TiDB Cloud (MySQL Compatible) with secure SSL connections.
- **DevOps:** Dockerized deployment on Render (Backend) and Vercel (Frontend).
- **Security:** CORS configuration for secure cross-origin resource sharing.

---

## Architecture

The system follows a **Producer-Consumer** architecture pattern:

1.  **Configuration:** The Admin sets parameters (e.g., *Total Tickets: 1000*, *Release Rate: 2000ms*).
2.  **Initialization:** The backend initializes a thread pool.
3.  **Production:** `Vendor` threads generate tickets and add them to the `TicketPool` (Blocking Queue).
4.  **Consumption:** `Customer` threads retrieve tickets from the `TicketPool`.
5.  **Broadcasting:** The `TicketPool` emits events via `WebSocketService` to the frontend.

---

## Tech Stack

| Component | Technology |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.x, Spring WebSocket, Hibernate |
| **Frontend** | Next.js 14, TypeScript, Tailwind CSS, Axios |
| **Database** | MySQL (TiDB Cloud Serverless) |
| **Tools** | Gradle (Build), Docker (Containerization), Git |
| **Deployment** | Render (Backend), Vercel (Frontend) |

---

## Installation & Setup

### Prerequisites
- **Java JDK 17** or higher
- **Node.js 18+** and npm
- **MySQL Database** (Local or Cloud)

### 1. Clone the Repository
```
git clone [https://github.com/YourUsername/Ticket-simulator.git](https://github.com/YourUsername/Ticket-simulator.git)
cd Ticket-simulator
```

### 2. Backend Setup (Spring Boot)
Navigate to the backend directory and configure the database.
```
cd backend
```

**Configuration**: Update ```src/main/resources/application.properties```or set environment variables:
```
# Database Configuration
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# Server Port
server.port=9000
```

**Run the Application:**
```
./gradlew bootRun
```
The backend will start on ```http://localhost:9000```.

### 3. Frontend Setup (Next.js)
Navigate to the frontend directory.

```
cd ../frontend
```

**Configuration**: Create a ```.env.local``` file:
```
NEXT_PUBLIC_API_BASE=http://localhost:9000
NEXT_PUBLIC_WS_URL=http://localhost:9000/ws
```

**Install & Run:**
```
npm install
npm run dev
```

The frontend will start on ```http://localhost:3000```.

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| ```POST```| ```/api/config/start``` | Starts the simulation threads. |
| ```POST``` | ```/api/config/stop``` | Stops all active threads. |
| ```POST``` | ```/api/config/update``` | Updates simulation parameters. |
| ```GET``` | ```/api/status``` | Returns current pool size and active thread count. |
| ```WS``` | ```/topic/updates``` | WebSocket channel for real-time logs |

---

## Docker Deployment

To build and run the backend using Docker:
```
# Build the image
docker build -t ticket-backend ./backend

# Run the container (Pass env vars)
docker run -p 9000:9000 \
  -e DB_URL="jdbc:mysql://..." \
  -e DB_USER="root" \
  -e DB_PASSWORD="password" \
  ticket-backend
```

---

## Screenshots

### 1. Control Dashboard
<img width="1902" height="797" alt="Screenshot 2026-02-10 090845" src="https://github.com/user-attachments/assets/9a0914b9-7e69-4a59-b784-213b9a3c1fa8" />

### 2. System Events Log
<img width="787" height="391" alt="Screenshot 2026-02-10 090912" src="https://github.com/user-attachments/assets/5fec6677-faf2-42a2-9ff2-3f257b8ab709" />

### 3. Throughput Analytics & Live Flow
<img width="1612" height="523" alt="Screenshot 2026-02-10 090856" src="https://github.com/user-attachments/assets/8ac5f522-9298-4419-a48c-aa449a06c0c0" />
<img width="798" height="393" alt="Screenshot 2026-02-10 090902" src="https://github.com/user-attachments/assets/b63e5b8c-7f84-4e9f-bf6a-1159191330b1" />

### 4. Database Schema
<img width="1900" height="870" alt="Screenshot 2026-02-10 093053" src="https://github.com/user-attachments/assets/03afa7ba-a88e-45ff-8329-1cdc54acb648" />

---

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features or bug fixes.
Fork the Project

1. Create your Feature Branch ```(git checkout -b feature/AmazingFeature)```
2. Commit your Changes ```(git commit -m 'Add some AmazingFeature')```
3. Push to the Branch ```(git push origin feature/AmazingFeature)```
4. Open a Pull Request

---

## License
Distributed under the MIT License

---

## Developed by:

**Dinuka Induwara Bandara**  
Software Engineering Intern · AI Developer  
[LinkedIn](https://www.linkedin.com/in/dinuka-induwara) | [Portfolio](https://dinuka-induwara-portfolio.vercel.app)


