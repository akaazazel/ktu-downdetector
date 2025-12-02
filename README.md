# KTU Down Detector

A lightweight uptime-monitoring tool that checks whether **app.ktu.edu.in** is online and records:

-   Last downtime timestamp
-   Last downtime duration
-   Last check timestamp
-   Current status (up / down)
-   Current latency

The project exposes these details through a small API and displays them on a React frontend.

---

## Purpose

Government/university portals often go down without warning.
This website provides a simple, fast way to:

-   View the current server status
-   Know exactly when the site last went down
-   Know how long it was down
-   Track uptime history passively without needing to open the site

A background job automatically pings the official KTU site every hour and logs status changes.

---

# Tech Stack

## **Frontend**

-   **React**

    -   Fetches data from the backend
    -   Displays live status and uptime information
    -   Simple UI built for clarity and reliability

## **Backend**

-   **Serverless API (Vercel Functions)**

    -   Provides `/api/check` endpoint
    -   Performs the uptime check on API requests
    -   Stores/returns each uptime field

## **Database**

-   **Upstash Redis (free tier)**

    -   Key-value database
    -   Stores

        -   `last_down_time`
        -   `last_down_duration`
        -   `last_check`

    -   Optimized for serverless functions
    -   10k free requests/day → more than enough for hourly checks

---

# Uptime Monitoring (Cron Job)

The site is checked _automatically_ every hour using:

### **cron-job.org**

A free online cron scheduler that sends HTTP requests to your API endpoint.

**How it works:**

1. cron-job.org triggers checking every hour
2. Serverless function runs immediately
3. It pings `https://app.ktu.edu.in`
4. It updates Redis with:

    - last check time
    - current status
    - if down → saves down timestamps
    - if recovered → calculates downtime duration

5. Frontend automatically shows updated results

This makes the system fully automated and free.

# How It Works – Summary

1. React loads → calls `/api/check`
2. The API:

    - measures latency
    - checks site status
    - writes results to Upstash Redis

3. `cron-job.org` runs the same check every hour
4. Down data and timestamps always stay updated
5. React UI displays the latest values
