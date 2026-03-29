package com.smartcampus.resource.service;

import com.smartcampus.resource.dto.ResourceCatalogDto;
import com.smartcampus.resource.dto.ResourceItemDto;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class ResourceCatalogService {

    private final List<ResourceItemDto> facilities = new ArrayList<>();
    private final List<ResourceItemDto> assets = new ArrayList<>();

    @PostConstruct
    public void initDefaults() {
        if (!facilities.isEmpty() || !assets.isEmpty()) {
            return;
        }

        facilities.add(buildDefaultFacility("f1", "Lecture Hall A", "LECTURE_HALL", 120, "Main Building", "08:00 - 18:00", "ACTIVE"));
        facilities.add(buildDefaultFacility("f2", "Computer Lab 1", "LAB", 40, "Science Wing", "07:30 - 20:00", "ACTIVE"));
        facilities.add(buildDefaultFacility("f3", "Meeting Room B", "MEETING_ROOM", 20, "Admin Block", "09:00 - 17:00", "OUT_OF_SERVICE"));

        assets.add(buildDefaultAsset("a1", "Projector #1", "PROJECTOR", 1, "Main Building's Stock Room", "AVAILABLE"));
        assets.add(buildDefaultAsset("a2", "Camera #2", "CAMERA", 1, "New Building's Stock Room", "AVAILABLE"));
        assets.add(buildDefaultAsset("a3", "Printer #3", "PRINTER", 1, "Engineering Building's Stock Room", "OUT_OF_STOCK"));
    }

    public synchronized ResourceCatalogDto getCatalog() {
        ResourceCatalogDto catalog = new ResourceCatalogDto();
        catalog.setFacilities(copyList(facilities));
        catalog.setAssets(copyList(assets));
        return catalog;
    }

    public synchronized ResourceItemDto addFacility(ResourceItemDto payload) {
        ResourceItemDto item = normalizeForCreate(payload, true);
        facilities.add(0, item);
        return copy(item);
    }

    public synchronized ResourceItemDto addAsset(ResourceItemDto payload) {
        ResourceItemDto item = normalizeForCreate(payload, false);
        assets.add(0, item);
        return copy(item);
    }

    public synchronized ResourceItemDto updateFacility(String id, ResourceItemDto payload) {
        return updateById(facilities, id, payload, true);
    }

    public synchronized ResourceItemDto updateAsset(String id, ResourceItemDto payload) {
        return updateById(assets, id, payload, false);
    }

    public synchronized void deleteFacility(String id) {
        deleteById(facilities, id);
    }

    public synchronized void deleteAsset(String id) {
        deleteById(assets, id);
    }

    private ResourceItemDto buildDefaultFacility(String id, String name, String type, int capacity, String location, String availabilityWindow, String status) {
        ResourceItemDto dto = new ResourceItemDto();
        dto.setId(id);
        dto.setName(name);
        dto.setType(type);
        dto.setCapacity(capacity);
        dto.setLocation(location);
        dto.setAvailabilityWindow(availabilityWindow);
        dto.setStatus(status);
        dto.setAvailableFromDate("");
        dto.setAvailableToDate("");
        dto.setUnavailableFromDate("");
        dto.setUnavailableToDate("");
        return dto;
    }

    private ResourceItemDto buildDefaultAsset(String id, String name, String type, int capacity, String location, String status) {
        ResourceItemDto dto = new ResourceItemDto();
        dto.setId(id);
        dto.setName(name);
        dto.setType(type);
        dto.setCapacity(capacity);
        dto.setLocation(location);
        dto.setAvailabilityWindow("");
        dto.setStatus(normalizeAssetStatus(status));
        dto.setAvailableFromDate("");
        dto.setAvailableToDate("");
        dto.setUnavailableFromDate("");
        dto.setUnavailableToDate("");
        return dto;
    }

    private ResourceItemDto normalizeForCreate(ResourceItemDto payload, boolean facility) {
        ResourceItemDto dto = copy(payload);
        dto.setId((facility ? "facility_" : "asset_") + UUID.randomUUID());
        applyNormalization(dto, facility);
        return dto;
    }

    private ResourceItemDto updateById(List<ResourceItemDto> items, String id, ResourceItemDto payload, boolean facility) {
        for (int i = 0; i < items.size(); i++) {
            ResourceItemDto existing = items.get(i);
            if (Objects.equals(existing.getId(), id)) {
                ResourceItemDto merged = merge(existing, payload);
                merged.setId(existing.getId());
                applyNormalization(merged, facility);
                items.set(i, merged);
                return copy(merged);
            }
        }

        throw new IllegalArgumentException("Resource not found");
    }

    private void deleteById(List<ResourceItemDto> items, String id) {
        Iterator<ResourceItemDto> iterator = items.iterator();
        while (iterator.hasNext()) {
            ResourceItemDto item = iterator.next();
            if (Objects.equals(item.getId(), id)) {
                iterator.remove();
                return;
            }
        }
    }

    private ResourceItemDto merge(ResourceItemDto existing, ResourceItemDto payload) {
        ResourceItemDto merged = copy(existing);

        if (payload.getName() != null) {
            merged.setName(payload.getName());
        }
        if (payload.getType() != null) {
            merged.setType(payload.getType());
        }
        if (payload.getCapacity() != null) {
            merged.setCapacity(payload.getCapacity());
        }
        if (payload.getLocation() != null) {
            merged.setLocation(payload.getLocation());
        }
        if (payload.getAvailabilityWindow() != null) {
            merged.setAvailabilityWindow(payload.getAvailabilityWindow());
        }
        if (payload.getStatus() != null) {
            merged.setStatus(payload.getStatus());
        }
        if (payload.getAvailableFromDate() != null) {
            merged.setAvailableFromDate(payload.getAvailableFromDate());
        }
        if (payload.getAvailableToDate() != null) {
            merged.setAvailableToDate(payload.getAvailableToDate());
        }
        if (payload.getUnavailableFromDate() != null) {
            merged.setUnavailableFromDate(payload.getUnavailableFromDate());
        }
        if (payload.getUnavailableToDate() != null) {
            merged.setUnavailableToDate(payload.getUnavailableToDate());
        }

        return merged;
    }

    private void applyNormalization(ResourceItemDto dto, boolean facility) {
        dto.setName(normalizeText(dto.getName()));
        dto.setType(normalizeText(dto.getType()));
        dto.setLocation(normalizeText(dto.getLocation()));
        dto.setAvailabilityWindow(normalizeText(dto.getAvailabilityWindow()));
        dto.setAvailableFromDate(normalizeText(dto.getAvailableFromDate()));
        dto.setAvailableToDate(normalizeText(dto.getAvailableToDate()));
        dto.setUnavailableFromDate(normalizeText(dto.getUnavailableFromDate()));
        dto.setUnavailableToDate(normalizeText(dto.getUnavailableToDate()));
        dto.setCapacity(Math.max(0, dto.getCapacity() == null ? 0 : dto.getCapacity()));

        String status = normalizeText(dto.getStatus()).toUpperCase();
        if (facility) {
            dto.setStatus(status.isBlank() ? "ACTIVE" : status);
        } else {
            dto.setStatus(normalizeAssetStatus(status));
        }
    }

    private String normalizeAssetStatus(String status) {
        if ("ACTIVE".equals(status) || "AVAILABLE".equals(status)) {
            return "AVAILABLE";
        }
        if ("OUT_OF_SERVICE".equals(status) || "OUT_OF_STOCK".equals(status)) {
            return "OUT_OF_STOCK";
        }
        return status.isBlank() ? "AVAILABLE" : status;
    }

    private List<ResourceItemDto> copyList(List<ResourceItemDto> items) {
        return items.stream().map(this::copy).toList();
    }

    private ResourceItemDto copy(ResourceItemDto source) {
        ResourceItemDto dto = new ResourceItemDto();
        dto.setId(source.getId());
        dto.setName(source.getName());
        dto.setType(source.getType());
        dto.setCapacity(source.getCapacity());
        dto.setLocation(source.getLocation());
        dto.setAvailabilityWindow(source.getAvailabilityWindow());
        dto.setStatus(source.getStatus());
        dto.setAvailableFromDate(source.getAvailableFromDate());
        dto.setAvailableToDate(source.getAvailableToDate());
        dto.setUnavailableFromDate(source.getUnavailableFromDate());
        dto.setUnavailableToDate(source.getUnavailableToDate());
        return dto;
    }

    private String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }
}
