package com.smartcampus.user.dto;

public class UpdateStatusDto {
    private String accountStatus; // ACTIVE, PENDING_APPROVAL, SUSPENDED

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }
}
