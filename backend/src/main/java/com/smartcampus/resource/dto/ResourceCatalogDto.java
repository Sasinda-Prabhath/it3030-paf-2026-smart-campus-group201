package com.smartcampus.resource.dto;

import java.util.ArrayList;
import java.util.List;

public class ResourceCatalogDto {
    private List<ResourceItemDto> facilities = new ArrayList<>();
    private List<ResourceItemDto> assets = new ArrayList<>();

    public List<ResourceItemDto> getFacilities() {
        return facilities;
    }

    public void setFacilities(List<ResourceItemDto> facilities) {
        this.facilities = facilities;
    }

    public List<ResourceItemDto> getAssets() {
        return assets;
    }

    public void setAssets(List<ResourceItemDto> assets) {
        this.assets = assets;
    }
}
