package com.smartcampus.notification.entity;

/**
 * Types of notifications used in the Smart Campus system.
 * Future modules (Booking, Ticket) will add their notification creation calls
 * via NotificationService using these types.
 */
public enum NotificationType {
    // Booking module (placeholder – integration hook)
    BOOKING_APPROVED,
    BOOKING_REJECTED,

    // Ticket / Help-desk module (placeholder – integration hook)
    TICKET_STATUS_CHANGED,
    TICKET_COMMENT_ADDED,

    // System-wide
    SYSTEM,

    // Profile / Auth module
    PROFILE_VERIFICATION
}
