package com.wicketlive.api;

import java.util.List;

public final class CricketModels {
    private CricketModels() { }

    public record TeamScore(String name, String shortName, int runs, int wickets, String overs, int extras) { }

    public record MatchSummary(
            String id, String tournament, String venue, String status, String result,
            TeamScore home, TeamScore away, String battingTeam, String currentOver,
            int targetRuns, String requiredRate, String updatedAt) { }

    public record PlayerStat(
            String name, String role, int runs, int balls, int fours, int sixes,
            int wickets, String economy, String status) { }

    public record Commentary(String over, String text, String kind, String time) { }

    public record MatchDetail(
            MatchSummary match, List<PlayerStat> battingCard, List<PlayerStat> bowlingCard,
            List<String> recentBalls, List<Commentary> commentary) { }

    public record ScoreUpdateRequest(String outcome) { }
}
