package com.wicketlive.api;

import com.wicketlive.api.CricketModels.MatchDetail;
import com.wicketlive.api.CricketModels.MatchSummary;
import com.wicketlive.api.CricketModels.ScoreUpdateRequest;
import com.wicketlive.live.CricketScoreService;
import com.wicketlive.live.LiveEventHub;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MatchController {
    private final CricketScoreService scoreService;
    private final LiveEventHub eventHub;

    public MatchController(CricketScoreService scoreService, LiveEventHub eventHub) {
        this.scoreService = scoreService;
        this.eventHub = eventHub;
    }

    @GetMapping("/matches")
    public List<MatchSummary> matches() {
        return scoreService.getMatches();
    }

    @GetMapping("/matches/{matchId}")
    public MatchDetail match(@PathVariable String matchId) {
        return scoreService.getMatch(matchId);
    }

    @PostMapping("/matches/{matchId}/score")
    public MatchSummary score(@PathVariable String matchId, @RequestBody(required = false) ScoreUpdateRequest request) {
        return scoreService.advance(matchId, request == null ? null : request.outcome());
    }

    @PostMapping("/matches/{matchId}/innings/complete")
    public MatchSummary completeInnings(@PathVariable String matchId) {
        return scoreService.completeInnings(matchId);
    }

    @GetMapping(value = "/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter events() {
        return eventHub.subscribe();
    }
}
