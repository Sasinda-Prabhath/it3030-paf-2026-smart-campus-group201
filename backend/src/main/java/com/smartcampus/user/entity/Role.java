package com.smartcampus.user.entity;

/**
 * User roles in the Smart Campus system.
 * - USER: covers students, lecturers, and university staff (subtypes can be added later)
 * - ADMIN: system administrators with elevated access
 */
public enum Role {
    USER,
    ADMIN
}
