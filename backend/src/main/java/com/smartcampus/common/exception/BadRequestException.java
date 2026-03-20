package com.smartcampus.common.exception;

/** Thrown for invalid request data or states. Results in a 400 response. */
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
