# Troubleshooting Guide

## Network Error / Database Connection Failed

If you see a "Network Error" or "Failed to seed database" message, it usually means the backend server could not start because it cannot connect to MongoDB.

### Symptoms
- Frontend shows "Network Error".
- Backend terminal shows: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`.

### Solution 1: Start MongoDB (If Installed)
Ensure your MongoDB service is running.
- **Windows**: Open Services (`services.msc`), find "MongoDB Server", right-click > Start.
- **Mac/Linux**: Run `brew services start mongodb-community` or `sudo systemctl start mongod`.

### Solution 2: Install MongoDB
If you don't have MongoDB installed:
1.  Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community).
2.  Install it (select "Install MongoD as a Service").
3.  Restart the backend server (`npm run dev` in `server/`).

### Solution 3: Use MongoDB Atlas (Cloud)
If you prefer not to install MongoDB locally:
1.  Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2.  Create a Cluster (Free Tier).
3.  Get the Connection String (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/job-recommender`).
4.  Update `server/.env`:
    ```env
    MONGO_URI=your_connection_string_here
    ```
5.  Restart the backend server.
