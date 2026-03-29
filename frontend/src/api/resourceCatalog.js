const STORAGE_KEY = 'smartCampus.resourceCatalog.v1';

const defaultResources = {
  facilities: [
    {
      id: 'f1',
      name: 'Lecture Hall A',
      type: 'LECTURE_HALL',
      capacity: 120,
      location: 'Main Building',
      availabilityWindow: 'Mon-Fri 08:00-18:00',
      status: 'ACTIVE',
    },
    {
      id: 'f2',
      name: 'Computer Lab 1',
      type: 'LAB',
      capacity: 40,
      location: 'Science Wing',
      availabilityWindow: 'Mon-Sat 07:30-20:00',
      status: 'ACTIVE',
    },
    {
      id: 'f3',
      name: 'Meeting Room B',
      type: 'MEETING_ROOM',
      capacity: 20,
      location: 'Admin Block',
      availabilityWindow: 'Mon-Fri 09:00-17:00',
      status: 'OUT_OF_SERVICE',
    },
  ],
  assets: [
    {
      id: 'a1',
      name: 'Projector #1',
      type: 'PROJECTOR',
      capacity: 1,
      location: "Main Building's Stock Room",
      availabilityWindow: '',
      status: 'AVAILABLE',
    },
    {
      id: 'a2',
      name: 'Camera #2',
      type: 'CAMERA',
      capacity: 1,
      location: "New Building's Stock Room",
      availabilityWindow: '',
      status: 'AVAILABLE',
    },
    {
      id: 'a3',
      name: 'Printer #3',
      type: 'PRINTER',
      capacity: 1,
      location: "Engineering Building's Stock Room",
      availabilityWindow: '',
      status: 'OUT_OF_STOCK',
    },
  ],
};

const normalizeAssetStatus = (status) => {
  if (status === 'ACTIVE') {
    return 'AVAILABLE';
  }

  if (status === 'OUT_OF_SERVICE') {
    return 'OUT_OF_STOCK';
  }

  return status;
};

const getStoredResources = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultResources));
      return defaultResources;
    }

    const parsed = JSON.parse(raw);
    return {
      facilities: Array.isArray(parsed.facilities) ? parsed.facilities : defaultResources.facilities,
      assets: Array.isArray(parsed.assets)
        ? parsed.assets.map((asset) => ({
            ...asset,
            status: normalizeAssetStatus(asset.status),
          }))
        : defaultResources.assets,
    };
  } catch {
    return defaultResources;
  }
};

const saveResources = (resources) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resources));
};

const buildId = (prefix) => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

export const resourceCatalogApi = {
  async getCatalog() {
    return { data: getStoredResources() };
  },

  async addFacility(payload) {
    const resources = getStoredResources();
    const facility = {
      ...payload,
      id: buildId('facility'),
      capacity: Number(payload.capacity) || 0,
    };
    resources.facilities = [facility, ...resources.facilities];
    saveResources(resources);
    return { data: facility };
  },

  async addAsset(payload) {
    const resources = getStoredResources();
    const asset = {
      ...payload,
      id: buildId('asset'),
      capacity: Number(payload.capacity) || 0,
    };
    resources.assets = [asset, ...resources.assets];
    saveResources(resources);
    return { data: asset };
  },

  async updateFacility(id, payload) {
    const resources = getStoredResources();
    resources.facilities = resources.facilities.map((facility) =>
      facility.id === id
        ? {
            ...facility,
            ...payload,
            capacity: Number(payload.capacity) || 0,
          }
        : facility
    );
    saveResources(resources);
    return { data: resources.facilities.find((facility) => facility.id === id) || null };
  },

  async updateAsset(id, payload) {
    const resources = getStoredResources();
    resources.assets = resources.assets.map((asset) =>
      asset.id === id
        ? {
            ...asset,
            ...payload,
            capacity: Number(payload.capacity) || 0,
          }
        : asset
    );
    saveResources(resources);
    return { data: resources.assets.find((asset) => asset.id === id) || null };
  },

  async deleteFacility(id) {
    const resources = getStoredResources();
    resources.facilities = resources.facilities.filter((facility) => facility.id !== id);
    saveResources(resources);
    return { data: { deleted: true } };
  },

  async deleteAsset(id) {
    const resources = getStoredResources();
    resources.assets = resources.assets.filter((asset) => asset.id !== id);
    saveResources(resources);
    return { data: { deleted: true } };
  },
};
