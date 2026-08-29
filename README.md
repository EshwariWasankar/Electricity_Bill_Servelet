# VIT Semester Result Register

A full-stack MERN-style (minus the M-for-node, using Java instead) app for preparing one semester's
result for a VIT student across **four subjects**, using:

- **Frontend:** React 18 + Vite (plain CSS, no UI framework)
- **Backend:** Spring Boot 3 (Java 17), REST API
- **Database:** MongoDB

## Marking scheme

For each subject:

```
mseWeighted  = (MSE marks / 50)  × 30     // MSE is out of 50, worth 30%
eseWeighted  = (ESE marks / 100) × 70     // ESE is out of 100, worth 70%
subjectTotal = mseWeighted + eseWeighted  // out of 100
```

A subject is a **pass** if `subjectTotal >= 40`. The student's overall percentage is the average of
the four `subjectTotal` values, and SGPA is `percentage / 9.5` (capped at 10). The overall result is
`PASS` only if all four subjects individually pass.

All of this is computed server-side in `StudentResultService.java` — the frontend only sends raw
MSE/ESE marks per subject.

## Project structure

```
vit-result-system/
├── backend/                          Spring Boot API (import this into STS)
│   ├── pom.xml
│   └── src/main/java/com/vit/result/
│       ├── ResultManagementApplication.java
│       ├── model/          Subject.java, StudentResult.java
│       ├── repository/     StudentResultRepository.java
│       ├── service/        StudentResultService.java   ← calculation logic lives here
│       ├── controller/     StudentResultController.java
│       ├── config/         WebConfig.java (CORS)
│       └── exception/      GlobalExceptionHandler.java + custom exceptions
│   └── src/main/resources/application.properties
└── frontend/                         React + Vite app
    ├── package.json
    ├── index.html
    └── src/
        ├── main.jsx, App.jsx
        ├── api/resultApi.js          Axios client
        ├── components/Navbar.jsx, SubjectRow.jsx
        ├── pages/AddResult.jsx, ResultsList.jsx, ResultDetail.jsx
        └── styles/index.css
```

## Prerequisites

Install these before starting:

1. **Java 17–21** — `java -version`. Spring Boot 3.3.4 is built and tested against these versions;
   a much newer JDK (e.g. Java 24+) can trigger obscure build/plugin failures. If `where java` /
   `which java` lists more than one JDK, make sure `JAVA_HOME` points at a 17–21 install (see below).
2. **Maven** — not required system-wide; this project includes the **Maven Wrapper** (see below), so
   `mvnw`/`mvnw.cmd` will download the right Maven version automatically.
3. **Spring Tool Suite (STS)** — you said you'll use this for the backend
4. **Node.js 18+** and npm — `node -v`
5. **MongoDB Community Server**, running locally (or a free MongoDB Atlas cluster)

### Pointing Maven/STS at the right JDK (Windows example)

If `java -version` shows something newer than 21 but you also have an older JDK installed (e.g.
`C:\Program Files\Java\jdk-21.0.12.1`), set `JAVA_HOME` to that folder before building, so Maven and
STS both use it:

```cmd
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.12.1
set PATH=%JAVA_HOME%\bin;%PATH%
java -version
```

(Set this permanently via *System Properties → Environment Variables* if you don't want to repeat it
every session.) In STS, you can also set the JDK per-project: right-click `backend` project →
**Properties → Java Build Path → Libraries**, and separately **Properties → Java Compiler**, and pick
the 21 JDK there; or **Window → Preferences → Java → Installed JREs** to register it and make it the
default STS uses for new/imported projects.

---

## Part 1 — Run MongoDB

**Option A: Local MongoDB**
Install MongoDB Community Edition, then start it:

```bash
# Linux/Mac
mongod --dbpath /path/to/data

# Or if installed as a service
sudo systemctl start mongod
```

It should be listening on `mongodb://localhost:27017`. No manual database/collection creation is
needed — Spring Data MongoDB creates the `vit_result_db` database and `student_results` collection
automatically on first save.

**Option B: MongoDB Atlas (cloud, no local install)**
Create a free cluster at mongodb.com/atlas, get your connection string, and update
`backend/src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@<cluster-url>/vit_result_db
```

---

## Part 2 — Run the backend in STS

1. Open **Spring Tool Suite**.
2. `File → Import → Maven → Existing Maven Projects`.
3. Browse to the `backend` folder inside this project and click **Finish**. STS will download all
   dependencies from `pom.xml` automatically (first import can take a minute or two).
4. Confirm `application.properties` points at your MongoDB (default is
   `mongodb://localhost:27017/vit_result_db` — fine for local Mongo, no changes needed).
5. In the **Package Explorer**, right-click `ResultManagementApplication.java` →
   `Run As → Spring Boot App`.
6. Confirm it started cleanly — the STS console should show:
   ```
   Tomcat started on port 8080
   Started ResultManagementApplication in X seconds
   ```
7. Sanity check in a browser or curl:
   ```bash
   curl http://localhost:8080/api/results
   ```
   You should get back `[]` (empty array) on first run.

If you'd rather not use STS's GUI — or Maven isn't installed system-wide — use the included
**Maven Wrapper** from a terminal inside `backend/`. It downloads the correct Maven version on first
run, so you don't need `mvn` on your PATH at all:

```cmd
:: Windows
mvnw.cmd spring-boot:run
```

```bash
# Mac/Linux
./mvnw spring-boot:run
```

Make sure `JAVA_HOME` is set to a 17–21 JDK first (see the Prerequisites section above) — the wrapper
uses whatever `JAVA_HOME` points to.

### API reference

| Method | Endpoint                                  | Description                          |
|--------|--------------------------------------------|---------------------------------------|
| POST   | `/api/results`                             | Create a new result (computes it)     |
| GET    | `/api/results`                             | List all results                      |
| GET    | `/api/results/{id}`                        | Get one result by id                  |
| GET    | `/api/results/register/{registrationNumber}` | Get one result by reg. number       |
| PUT    | `/api/results/{id}`                        | Update & recompute a result           |
| DELETE | `/api/results/{id}`                        | Delete a result                       |

Example request body for `POST /api/results`:
```json
{
  "studentName": "Aarav Sharma",
  "registrationNumber": "22BCE1234",
  "branch": "SCOPE - CSE",
  "semester": "Fall Semester 2025-26",
  "subjects": [
    { "subjectName": "Data Structures", "subjectCode": "CSE2001", "mseMarks": 42, "eseMarks": 78 },
    { "subjectName": "Operating Systems", "subjectCode": "CSE2002", "mseMarks": 38, "eseMarks": 65 },
    { "subjectName": "DBMS", "subjectCode": "CSE2003", "mseMarks": 45, "eseMarks": 82 },
    { "subjectName": "Computer Networks", "subjectCode": "CSE2004", "mseMarks": 30, "eseMarks": 55 }
  ]
}
```

---

## Part 3 — Run the frontend

Open a normal terminal (VS Code, or your OS terminal — this part doesn't need STS):

```bash
cd frontend
npm install
npm run dev
```

Vite will start the dev server at **http://localhost:5173**. Open that URL in your browser. It's
already wired to call the backend at `http://localhost:8080` (see `src/api/resultApi.js` — change
`API_BASE_URL` there if you deploy the backend elsewhere).

Make sure the backend (Part 2) and MongoDB (Part 1) are both running before you submit the form.

---

## Using the app

1. **New Entry** page (`/`) — enter student name, registration number, branch, semester, and marks
   for four subjects (MSE out of 50, ESE out of 100). Submitting computes and saves the result, then
   takes you straight to its detail page.
2. **Register** page (`/results`) — a searchable table of every saved result, with a PASS/FAIL pill,
   percentage, and SGPA at a glance. You can open or delete any entry from here.
3. **Result detail** page (`/results/:id`) — a per-subject breakdown (MSE→weighted, ESE→weighted,
   subject total, grade) plus an overall summary and a pass/fail seal.

## Troubleshooting

- **CORS errors in the browser console** — confirm the backend is running on port 8080 and the
  frontend on 5173/3000; `WebConfig.java` only allows those two origins by default.
- **"Connection refused" from the frontend** — the backend isn't running yet, or MongoDB isn't
  reachable (check the STS console for a Mongo connection stack trace on startup).
- **Duplicate result error** — the app enforces one result per registration number + semester
  combination; delete the old entry or use a different semester value to test again.
- **Port 8080 already in use** — change `server.port` in `application.properties`, and update
  `API_BASE_URL` in `frontend/src/api/resultApi.js` to match.
