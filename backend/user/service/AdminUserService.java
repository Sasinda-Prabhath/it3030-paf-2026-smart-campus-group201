package user.service;

import user.dto.UserListDto;
import user.dto.UpdateRoleDto;
import user.dto.UpdateClassificationDto;
import user.entity.User;
import user.entity.Role;
import user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    public List<UserListDto> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::mapToUserListDto)
            .collect(Collectors.toList());
    }

    public UserListDto updateUserRole(Long id, UpdateRoleDto updateDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(updateDto.getRole());
        // Clear staffType if role is not STAFF
        if (updateDto.getRole() != Role.STAFF) {
            user.setStaffType(null);
        }
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToUserListDto(user);
    }

    public UserListDto updateUserClassification(Long id, UpdateClassificationDto updateDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserType(updateDto.getUserType());
        // Only set staffType if role is STAFF
        if (user.getRole() == Role.STAFF) {
            user.setStaffType(updateDto.getStaffType());
        } else {
            user.setStaffType(null);
        }
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToUserListDto(user);
    }

    private UserListDto mapToUserListDto(User user) {
        UserListDto dto = new UserListDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());
        dto.setUserType(user.getUserType() != null ? user.getUserType().name() : null);
        dto.setStaffType(user.getStaffType() != null ? user.getStaffType().name() : null);
        dto.setEmailVerified(user.getEmailVerified());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null);
        return dto;
    }
}