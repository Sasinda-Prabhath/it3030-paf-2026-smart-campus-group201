package com.smartcampus.resource.controller;

import com.smartcampus.resource.dto.ResourceCatalogDto;
import com.smartcampus.resource.dto.ResourceItemDto;
import com.smartcampus.resource.service.ResourceCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/resources")
public class ResourceCatalogController {

    private final ResourceCatalogService resourceCatalogService;

    public ResourceCatalogController(ResourceCatalogService resourceCatalogService) {
        this.resourceCatalogService = resourceCatalogService;
    }

    @GetMapping("/catalog")
    public ResponseEntity<ResourceCatalogDto> getCatalog() {
        return ResponseEntity.ok(resourceCatalogService.getCatalog());
    }

    @PostMapping("/facilities")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ResourceItemDto> addFacility(@RequestBody ResourceItemDto payload) {
        return ResponseEntity.ok(resourceCatalogService.addFacility(payload));
    }

    @PostMapping("/assets")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ResourceItemDto> addAsset(@RequestBody ResourceItemDto payload) {
        return ResponseEntity.ok(resourceCatalogService.addAsset(payload));
    }

    @PutMapping("/facilities/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ResourceItemDto> updateFacility(
        @PathVariable String id,
        @RequestBody ResourceItemDto payload
    ) {
        return ResponseEntity.ok(resourceCatalogService.updateFacility(id, payload));
    }

    @PutMapping("/assets/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ResourceItemDto> updateAsset(
        @PathVariable String id,
        @RequestBody ResourceItemDto payload
    ) {
        return ResponseEntity.ok(resourceCatalogService.updateAsset(id, payload));
    }

    @DeleteMapping("/facilities/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteFacility(@PathVariable String id) {
        resourceCatalogService.deleteFacility(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/assets/{id}")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Void> deleteAsset(@PathVariable String id) {
        resourceCatalogService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
}
