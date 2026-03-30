package com.smartcampus.user.service;

import com.smartcampus.user.dto.UserListDto;
import com.smartcampus.user.dto.UpdateRoleDto;
import com.smartcampus.user.dto.UpdateClassificationDto;
import com.smartcampus.user.dto.UpdateStatusDto;
import com.smartcampus.user.entity.User;
import com.smartcampus.user.entity.AccountStatus;
import com.smartcampus.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private UserRepository userRepository;

    private static final DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    public List<UserListDto> getAllUsers() {
        return userRepository.findAll()
            .stream()
            .map(this::mapToUserListDto)
            .collect(Collectors.toList());
    }

    public UserListDto updateUserRole(@NonNull Long id, UpdateRoleDto updateDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(updateDto.getRole());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToUserListDto(user);
    }

    public UserListDto updateUserClassification(@NonNull Long id, UpdateClassificationDto updateDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setUserType(updateDto.getUserType());
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToUserListDto(user);
    }

    public UserListDto updateUserStatus(@NonNull Long id, UpdateStatusDto updateDto) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountStatus(AccountStatus.valueOf(updateDto.getAccountStatus()));
        user.setUpdatedAt(LocalDateTime.now());

        user = userRepository.save(user);
        return mapToUserListDto(user);
    }

    public void deleteUser(@NonNull Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(user);
    }

    private UserListDto mapToUserListDto(User user) {
        UserListDto dto = new UserListDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setFullName(user.getFullName());
        dto.setRole(user.getRole().name());
        dto.setUserType(user.getUserType() != null ? user.getUserType().name() : null);
        dto.setStaffType(user.getStaffType() != null ? user.getStaffType().name() : null);
        dto.setAccountStatus(user.getAccountStatus() != null ? user.getAccountStatus().name() : null);
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().format(formatter) : null);
        return dto;
    }
}