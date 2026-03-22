package user.dto;

import user.entity.UserType;
import user.entity.StaffType;

public class UpdateClassificationDto {
    private UserType userType;
    private StaffType staffType;

    // Constructors
    public UpdateClassificationDto() {}

    // Getters and Setters
    public UserType getUserType() { return userType; }
    public void setUserType(UserType userType) { this.userType = userType; }

    public StaffType getStaffType() { return staffType; }
    public void setStaffType(StaffType staffType) { this.staffType = staffType; }
}