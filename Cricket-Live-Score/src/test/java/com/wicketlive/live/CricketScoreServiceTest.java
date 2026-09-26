package com.wicketlive.live;

import com.wicketlive.api.CricketModels.MatchDetail;
import com.wicketlive.api.CricketModels.MatchSummary;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CricketScoreServiceTest {
    private final CricketScoreService service = new CricketScoreService(new LiveEventHub());

    @Test
    void recordsARequestedBallAndKeepsScorecardInSync() {
        MatchSummary before = service.getMatches().getFirst();

        MatchSummary after = service.advance(before.id(), "4");
        MatchDetail detail = service.getMatch(before.id());

        assertEquals(before.away().runs() + 4, after.away().runs());
        assertEquals(after.away().runs(), detail.match().away().runs());
        assertNotEquals(before.away().overs(), after.away().overs());
        assertEquals("4", detail.recentBalls().getLast());
    }

    @Test
    void rejectsUnsupportedBallOutcomes() {
        assertThrows(ResponseStatusException.class, () -> service.advance("live-01", "5"));
    }

    @Test
    void completingFirstInningsStartsChaseWithCorrectTarget() {
        MatchSummary completed = service.completeInnings("live-02");
        MatchDetail detail = service.getMatch("live-02");

        assertEquals("LIVE", completed.status());
        assertEquals("Delhi Dynamos", completed.battingTeam());
        assertEquals(110, completed.targetRuns());
        assertTrue(detail.commentary().getFirst().text().contains("need 110 to win"));
    }

    @Test
    void retainsFullCommentaryAndCompletesSecondInningsWithResult() {
        for (int ball = 0; ball < 10; ball++) {
            service.advance("live-01", "1");
        }
        MatchSummary completed = service.completeInnings("live-01");
        MatchDetail detail = service.getMatch("live-01");

        assertEquals("RESULT", completed.status());
        assertEquals("Mumbai Meteors won by 36 runs", completed.result());
        assertTrue(detail.commentary().size() > 8);
        assertEquals("RESULT", detail.commentary().getFirst().over());
    }
}
