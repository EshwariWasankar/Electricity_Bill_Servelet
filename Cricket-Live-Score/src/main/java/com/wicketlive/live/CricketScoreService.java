package com.wicketlive.live;

import com.wicketlive.api.CricketModels.Commentary;
import com.wicketlive.api.CricketModels.MatchDetail;
import com.wicketlive.api.CricketModels.MatchSummary;
import com.wicketlive.api.CricketModels.PlayerStat;
import com.wicketlive.api.CricketModels.TeamScore;
import com.wicketlive.api.MatchNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CricketScoreService {
    private static final DateTimeFormatter CLOCK = DateTimeFormatter.ofPattern("HH:mm:ss");
    private static final List<String> AUTO_OUTCOMES = List.of("1", "0", "4", "1", "2", "W", "1", "0", "6", "1", "Wd", "2");
    private static final int MAX_COMMENTARY_ENTRIES = 250;
    private final Map<String, MatchState> matches = new ConcurrentHashMap<>();
    private final LiveEventHub eventHub;

    public CricketScoreService(LiveEventHub eventHub) {
        this.eventHub = eventHub;
        matches.put("live-01", new MatchState("live-01", "IPL • MATCH 48", "Harbour Oval, Mumbai", "Mumbai Meteors", "MUM", 178, 5, 20, 0, 12,
            "Chennai Chargers", "CHE", 132, 4, 13, 2, 5, false, "55 runs needed from 40 balls", true));
        matches.put("live-02", new MatchState("live-02", "IPL • MATCH 49", "M. Chinnaswamy Stadium, Bengaluru", "Bengaluru Bears", "BLR", 109, 3, 12, 0, 7,
                "Delhi Dynamos", "DEL", 0, 0, 0, 0, 0, true, "First innings", true));
        matches.put("final-01", new MatchState("final-01", "IPL • MATCH 47", "Sawai Mansingh Stadium, Jaipur", "Jaipur Royals", "JAI", 172, 8, 20, 0, 12,
                "Hyderabad Hawks", "HYD", 176, 4, 19, 1, 0, false, "Hyderabad won by 6 wickets", false));
    }

    public List<MatchSummary> getMatches() {
        return List.of(summary(matches.get("live-01")), summary(matches.get("live-02")), summary(matches.get("final-01")));
    }

    public MatchDetail getMatch(String matchId) {
        MatchState match = find(matchId);
        return new MatchDetail(summary(match), battingCard(match), bowlingCard(match), List.copyOf(match.recentBalls), List.copyOf(match.commentary));
    }

    public synchronized MatchSummary advance(String matchId, String requestedOutcome) {
        MatchState match = find(matchId);
        if (!match.live) {
            throw new IllegalArgumentException("This match is not live.");
        }
        String outcome = requestedOutcome == null || requestedOutcome.isBlank()
                ? AUTO_OUTCOMES.get(match.autoIndex++ % AUTO_OUTCOMES.size()) : requestedOutcome;
        if (!List.of("0", "1", "2", "3", "4", "6", "W", "Wd", "Nb").contains(outcome)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Outcome must be 0, 1, 2, 3, 4, 6, W, Wd, or Nb.");
        }
        match.apply(outcome);
        MatchSummary updated = summary(match);
        eventHub.publish(getMatches());
        return updated;
    }

    public synchronized MatchSummary completeInnings(String matchId) {
        MatchState match = find(matchId);
        if (!match.live) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This match is already complete.");
        }
        match.completeInnings();
        MatchSummary updated = summary(match);
        eventHub.publish(getMatches());
        return updated;
    }

    @Scheduled(fixedDelay = 12000, initialDelay = 12000)
    public void simulateLiveMatches() {
        for (MatchState match : matches.values()) {
            if (match.live) {
                advance(match.id, null);
            }
        }
    }

    private MatchState find(String id) {
        MatchState match = matches.get(id);
        if (match == null) {
            throw new MatchNotFoundException(id);
        }
        return match;
    }

    private MatchSummary summary(MatchState match) {
        TeamScore home = match.teamScore(true);
        TeamScore away = match.teamScore(false);
        String battingTeam = match.battingHome ? match.homeName : match.awayName;
        return new MatchSummary(match.id, match.tournament, match.venue, match.live ? "LIVE" : "RESULT",
            match.result, home, away, battingTeam, match.currentOver(), match.battingHome ? 0 : match.homeRuns + 1,
            match.requiredRate, match.updatedAt);
    }

    private List<PlayerStat> battingCard(MatchState match) {
        if (match.battingHome) {
            return List.of(
                    new PlayerStat("A. Mehta", "Opener", 68, 39, 7, 3, 0, "", "Not out"),
                    new PlayerStat("R. Iyer", "Opener", 42, 28, 4, 2, 0, "", "Caught"),
                    new PlayerStat("J. Khan", "All-rounder", 22, 14, 2, 1, 0, "", "Not out"),
                    new PlayerStat("S. Nair", "Batter", 17, 9, 1, 1, 0, "", "Bowled"));
        }
        return List.of(
                new PlayerStat("R. Gaikwad", "Opener", 71, 42, 8, 2, 0, "", "Caught"),
                new PlayerStat("D. Conway", "Opener", 48, 31, 5, 2, 0, "", "Bowled"),
                new PlayerStat("S. Dube", "All-rounder", 35, 18, 2, 3, 0, "", "Not out"),
                new PlayerStat("M. Ali", "All-rounder", 18, 9, 1, 1, 0, "", "Not out"));
    }

    private List<PlayerStat> bowlingCard(MatchState match) {
        return List.of(
                new PlayerStat("M. Pathirana", "Fast", 0, 0, 0, 0, 2, "8.40", "Bowling"),
                new PlayerStat("R. Jadeja", "Spin", 0, 0, 0, 0, 1, "7.75", ""),
                new PlayerStat("T. Deshpande", "Fast", 0, 0, 0, 0, 1, "9.20", ""));
    }

    private static final class MatchState {
        private final String id;
        private final String tournament;
        private final String venue;
        private final String homeName;
        private final String homeCode;
        private final String awayName;
        private final String awayCode;
        private int homeRuns;
        private int homeWickets;
        private int homeBalls;
        private int homeExtras;
        private int awayRuns;
        private int awayWickets;
        private int awayBalls;
        private int awayExtras;
        private boolean battingHome;
        private boolean live;
        private String result;
        private String requiredRate;
        private int autoIndex;
        private String updatedAt = LocalTime.now().format(CLOCK);
        private final Deque<String> recentBalls = new ArrayDeque<>(6);
        private final Deque<Commentary> commentary = new ArrayDeque<>();

        private MatchState(String id, String tournament, String venue, String homeName, String homeCode,
                           int homeRuns, int homeWickets, int homeOvers, int homeBallsInOver, int homeExtras,
                           String awayName, String awayCode, int awayRuns, int awayWickets, int awayOvers,
                           int awayBallsInOver, int awayExtras, boolean battingHome, String requiredRate, boolean live) {
            this.id = id;
            this.tournament = tournament;
            this.venue = venue;
            this.homeName = homeName;
            this.homeCode = homeCode;
            this.homeRuns = homeRuns;
            this.homeWickets = homeWickets;
            this.homeBalls = homeOvers * 6 + homeBallsInOver;
            this.homeExtras = homeExtras;
            this.awayName = awayName;
            this.awayCode = awayCode;
            this.awayRuns = awayRuns;
            this.awayWickets = awayWickets;
            this.awayBalls = awayOvers * 6 + awayBallsInOver;
            this.awayExtras = awayExtras;
            this.battingHome = battingHome;
            this.requiredRate = requiredRate;
            this.live = live;
            this.result = live ? "" : requiredRate;
            for (String ball : List.of("1", "0", "4", "1", "2", "1")) {
                recentBalls.addLast(ball);
            }
            commentary.add(new Commentary("19.2", "A sharp single into the covers. The chase is right on the edge.", "run", "LIVE"));
            commentary.add(new Commentary("19.1", "Full and straight, worked away for two.", "run", "LIVE"));
            commentary.add(new Commentary("19.0", "A yorker squeezed out to deep third.", "dot", "LIVE"));
        }

        private TeamScore teamScore(boolean home) {
            int balls = home ? homeBalls : awayBalls;
            return new TeamScore(home ? homeName : awayName, home ? homeCode : awayCode,
                    home ? homeRuns : awayRuns, home ? homeWickets : awayWickets,
                    balls / 6 + "." + balls % 6, home ? homeExtras : awayExtras);
        }

        private String currentOver() {
            int balls = battingHome ? homeBalls : awayBalls;
            return (balls / 6) + "." + (balls % 6);
        }

        private void apply(String outcome) {
            boolean home = battingHome;
            int runs = switch (outcome) {
                case "W", "0" -> 0;
                case "Wd", "Nb" -> 1;
                default -> Integer.parseInt(outcome);
            };
            if (home) {
                homeRuns += runs;
                if (outcome.equals("W")) homeWickets++;
                if (outcome.equals("Wd") || outcome.equals("Nb")) homeExtras++;
                if (!outcome.equals("Wd")) homeBalls++;
            } else {
                awayRuns += runs;
                if (outcome.equals("W")) awayWickets++;
                if (outcome.equals("Wd") || outcome.equals("Nb")) awayExtras++;
                if (!outcome.equals("Wd")) awayBalls++;
            }
            String ballLabel = outcome.equals("Wd") ? "Wd" : outcome.equals("Nb") ? "Nb" : outcome;
            recentBalls.addLast(ballLabel);
            while (recentBalls.size() > 6) recentBalls.removeFirst();
            String over = currentOver();
            String text = switch (outcome) {
                case "W" -> "OUT! The stumps are disturbed and the crowd erupts.";
                case "4" -> "FOUR! Crunched through the gap and races to the rope.";
                case "6" -> "SIX! High, handsome, and into the stands.";
                case "0" -> "Good length, defended back to the bowler.";
                case "Wd" -> "Wide down the leg side. Extra run and another ball.";
                case "Nb" -> "Overstepped. No-ball called, free hit coming up.";
                default -> "Pushed into the gap for " + runs + (runs == 1 ? " run." : " runs.");
            };
            String kind = outcome.equals("W") ? "wicket" : outcome.equals("4") || outcome.equals("6") ? "boundary" : outcome.equals("0") ? "dot" : "run";
            commentary.addFirst(new Commentary(over, text, kind, LocalTime.now().format(CLOCK)));
            trimCommentary();
            updatedAt = LocalTime.now().format(CLOCK);
            int currentBalls = home ? homeBalls : awayBalls;
            int target = homeRuns + 1;
            if (!battingHome && awayRuns >= target) {
                live = false;
                result = awayName + " won by " + (10 - awayWickets) + " wickets";
            } else if (currentBalls >= 120 || (home ? homeWickets : awayWickets) >= 10) {
                completeInnings();
            }
            if (!battingHome && live) {
                int remaining = Math.max(0, target - awayRuns);
                int ballsLeft = Math.max(1, 120 - awayBalls);
                requiredRate = remaining + " runs needed from " + ballsLeft + " balls";
            }
        }

        private void completeInnings() {
            String time = LocalTime.now().format(CLOCK);
            if (battingHome) {
                battingHome = false;
                requiredRate = "Target: " + (homeRuns + 1);
                commentary.addFirst(new Commentary("INNINGS", "Innings break. " + awayName + " need " + (homeRuns + 1) + " to win.", "innings", time));
            } else {
                live = false;
                if (awayRuns == homeRuns) {
                    result = "Match tied";
                } else if (awayRuns > homeRuns) {
                    result = awayName + " won by " + (10 - awayWickets) + " wickets";
                } else {
                    result = homeName + " won by " + (homeRuns - awayRuns) + " runs";
                }
                requiredRate = result;
                commentary.addFirst(new Commentary("RESULT", result, "result", time));
            }
            trimCommentary();
            updatedAt = time;
        }

        private void trimCommentary() {
            while (commentary.size() > MAX_COMMENTARY_ENTRIES) commentary.removeLast();
        }
    }
}
