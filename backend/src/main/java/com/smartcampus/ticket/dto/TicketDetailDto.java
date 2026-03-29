package com.smartcampus.ticket.dto;

import java.util.List;

public class TicketDetailDto extends TicketDto {

    private List<TicketCommentDto> comments;

    public List<TicketCommentDto> getComments() { return comments; }
    public void setComments(List<TicketCommentDto> comments) { this.comments = comments; }
}
