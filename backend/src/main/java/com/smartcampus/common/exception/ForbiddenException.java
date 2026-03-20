package com.smartcampus.common.exception;

/** Thrown when a user tries to access a resource they don't own. Results in a 403 response. */
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}
