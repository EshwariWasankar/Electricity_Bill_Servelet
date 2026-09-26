# Wicket Live

A Spring Boot cricket score management demo with a responsive IPL-inspired dashboard. It seeds fictional matches locally, simulates live ball-by-ball updates, exposes REST endpoints, and broadcasts changes to connected browsers with Server-Sent Events. No external data provider, database, or API key is required.

## Requirements

- Java 21
- Maven 3.9+

## Run

```powershell
mvn spring-boot:run
```

Open `http://localhost:8080` in a browser. The app advances live matches automatically every 12 seconds. Use the scorer controls to post a specific delivery outcome.

## API

- `GET /api/matches` returns match summaries, including the current chase target.
- `GET /api/matches/{matchId}` returns a match, batting and bowling statistics, recent balls, and commentary.
- `POST /api/matches/{matchId}/score` records a ball. Send `{"outcome":"4"}`; supported outcomes are `0`, `1`, `2`, `3`, `4`, `6`, `W`, `Wd`, and `Nb`. Omit the body to advance the simulator.
- `POST /api/matches/{matchId}/innings/complete` ends the current innings. Ending the first innings starts the chase; ending the second innings records the final result.
- `GET /api/events` streams match summary updates as `text/event-stream`.

The seeded match IDs are `live-01`, `live-02`, and `final-01`.

## Test and package

```powershell
mvn test
mvn package
```
