package com.wicketlive.live;

import com.wicketlive.api.CricketModels.MatchSummary;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class LiveEventHub {
    private final List<SseEmitter> clients = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(0L);
        clients.add(emitter);
        emitter.onCompletion(() -> clients.remove(emitter));
        emitter.onTimeout(() -> clients.remove(emitter));
        emitter.onError(error -> clients.remove(emitter));
        return emitter;
    }

    public void publish(List<MatchSummary> matches) {
        for (SseEmitter client : clients) {
            try {
                client.send(SseEmitter.event().name("score-update").data(matches));
            } catch (IOException | IllegalStateException exception) {
                clients.remove(client);
            }
        }
    }
}
