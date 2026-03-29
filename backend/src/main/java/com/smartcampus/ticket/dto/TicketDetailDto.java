package com.smartcampus.ticket.dto;

import java.util.List;

public class TicketDetailDto extends TicketDto {

    private List<TicketCommentDto> comments;
    private List<TicketAttachmentDto> attachments;

    public List<TicketCommentDto> getComments() { return comments; }
    public void setComments(List<TicketCommentDto> comments) { this.comments = comments; }

    public List<TicketAttachmentDto> getAttachments() { return attachments; }
    public void setAttachments(List<TicketAttachmentDto> attachments) { this.attachments = attachments; }
}
