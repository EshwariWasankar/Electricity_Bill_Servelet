package com.wicketlive.api;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class MatchNotFoundException extends RuntimeException {
    public MatchNotFoundException(String matchId) {
        super("Match not found: " + matchId);
    }
}
