package com.smartcampus.ticket.dto;

import jakarta.validation.constraints.NotBlank;

public class AddTicketCommentDto {

    @NotBlank
    private String comment;

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
