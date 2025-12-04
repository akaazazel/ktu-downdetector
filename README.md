# ![ktu down detector](/frontend/public/logo.svg)

A lightweight uptime monitor that checks whether **app.ktu.edu.in** is online.
It tracks:

-   Current status (up / down)
-   Latency
-   Last downtime time
-   Downtime duration
-   Last check time

All data is returned through an API and displayed in a simple React UI.

## ![ktu down detector](/frontend/public/screenshot.png)

## Tech Stack

-   **Frontend**

    -   React
    -   Chakra UI

-   **Backend**

    -   Express.js

-   **Database**
    -   Upstash Redis (Free)
    -   10k free requests/day → enough for hourly checks.

---

## Automation

Using **cron-job.org**:

1. Cron hits your Express endpoint every half an hour
2. Express runs the uptime check
3. Redis is updated
4. Frontend displays updated results

---

## Working

1. React UI loads → calls your Express API
2. API checks the KTU site + writes results to Redis
3. Cron triggers the same check every hour
4. Redis always holds the latest uptime data
5. UI displays everything live
