import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { resourceCatalogApi } from '../api/resourceCatalog';
import { bookingRequestsApi } from '../api/bookingRequests';
import BookingRequestModal from '../components/BookingRequestModal';
import toast from 'react-hot-toast';

const FACILITY_TYPES = ['LECTURE_HALL', 'MEETING_ROOM', 'LAB'];
const ASSET_TYPES = ['PROJECTOR', 'CAMERA', 'PRINTER', 'MICROSCOPE', 'NETWORK_DEVICE', 'OTHER'];
const FACILITY_STATUSES = ['ACTIVE', 'OUT_OF_SERVICE'];
const ASSET_STATUSES = ['AVAILABLE', 'OUT_OF_STOCK'];
const FACILITY_LOCATION_OPTIONS = ['New Building', 'Main Building', 'Business Management Building', 'Engineering Building'];
const ASSET_LOCATION_OPTIONS = [
  "Main Building's Stock Room",
  "New Building's Stock Room",
  "Business Management Building's Stock Room",
  "Engineering Building's Stock Room",
];
const TIME_HOUR_OPTIONS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const TIME_TO_HOUR_OPTIONS = [...TIME_HOUR_OPTIONS, '24'];
const TIME_MINUTE_OPTIONS = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, '0'));

const emptyFilters = {
  search: '',
  type: 'ALL',
  location: 'ALL',
  status: 'ALL',
  minCapacity: '',
};

const initialForm = {
  name: '',
  type: '',
  capacity: '',
  location: '',
  availabilityWindow: '',
  availableFromDate: '',
  availableToDate: '',
  unavailableFromDate: '',
  unavailableToDate: '',
  availabilityFrom: '08:00',
  availabilityTo: '18:00',
  status: 'ACTIVE',
};

const getAccentClass = (resourceType, itemType) => {
  if (resourceType === 'ASSET') {
    return 'bg-gradient-to-r from-pink-200 to-rose-300';
  }

  if (itemType === 'LECTURE_HALL') {
    return 'bg-gradient-to-r from-sky-300 to-blue-400';
  }

  if (itemType === 'LAB') {
    return 'bg-gradient-to-r from-emerald-300 to-green-400';
  }

  if (itemType === 'MEETING_ROOM') {
    return 'bg-gradient-to-r from-violet-300 to-purple-400';
  }

  return 'bg-gradient-to-r from-slate-500 to-slate-600';
};

const formatEnumLabel = (value) => value.replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const parseAvailabilityWindow = (availabilityWindow) => {
  if (!availabilityWindow) {
    return { availabilityFrom: '08:00', availabilityTo: '18:00' };
  }

  const matches = availabilityWindow.match(/(\d{2}:\d{2})/g);
  if (matches && matches.length >= 2) {
    return { availabilityFrom: matches[0], availabilityTo: matches[1] };
  }

  return { availabilityFrom: '08:00', availabilityTo: '18:00' };
};

const getTimeParts = (value, allowedHours = TIME_HOUR_OPTIONS) => {
  const [hours = '00', minutes = '00'] = (value || '00:00').split(':');
  const normalizedHours = allowedHours.includes(hours) ? hours : allowedHours[0] || '00';
  const normalizedMinutes = normalizedHours === '24'
    ? '00'
    : TIME_MINUTE_OPTIONS.includes(minutes)
      ? minutes
      : '00';

  return {
    hours: normalizedHours,
    minutes: normalizedMinutes,
  };
};

const buildTimeValue = (hours, minutes) => `${hours}:${hours === '24' ? '00' : minutes}`;

const formatTimeLabel = (value) => {
  if (!value) {
    return '-';
  }

  const [hoursText, minutesText] = value.split(':');
  const hours = Number(hoursText);
  const minutes = Number(minutesText);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return value;
  }

  const meridiem = hours >= 12 ? 'PM' : 'AM';
  return `${hours}.${String(minutes).padStart(2, '0')} ${meridiem}`;
};

const formatAvailabilityWindow = (availabilityWindow) => {
  const { availabilityFrom, availabilityTo } = parseAvailabilityWindow(availabilityWindow);
  return `From ${formatTimeLabel(availabilityFrom)} To ${formatTimeLabel(availabilityTo)}`;
};

const formatDateLabel = (value) => {
  if (!value) {
    return '-';
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString();
};

const ResourceCard = ({ resource, accentClass, canManage, canBook, onEdit, onDelete, onBook }) => (
  <article className="group relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
    <div className={`px-4 py-3 text-white ${accentClass} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <h3 className="font-bold text-lg leading-tight drop-shadow-sm">{resource.name}</h3>
          <p className="text-xs font-medium opacity-90 mt-0.5 tracking-wide">{resource.type.replaceAll('_', ' ')}</p>
        </div>
        <span
          className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-bold shadow-sm ${
            ['ACTIVE', 'AVAILABLE'].includes(resource.status) ? 'bg-emerald-400 text-emerald-950' : 'bg-rose-400 text-rose-950'
          }`}
        >
          {resource.status}
        </span>
      </div>
    </div>

    <div className="px-4 py-4 text-slate-600 space-y-2 text-sm z-10 relative">
      <div className="flex items-center gap-2">
        <span className="p-1.5 bg-slate-100 rounded-md text-slate-500">👥</span>
        <p className="leading-snug">
          <span className="font-semibold text-slate-800">{FACILITY_TYPES.includes(resource.type) ? 'Capacity:' : 'Amount:'}</span> {resource.capacity}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="p-1.5 bg-slate-100 rounded-md text-slate-500">📍</span>
        <p className="leading-snug">
          <span className="font-semibold text-slate-800">Location:</span> {resource.location}
        </p>
      </div>
      
      {resource.availabilityWindow && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
          <span className="p-1.5 bg-blue-50 rounded-md text-blue-500 text-xs">🕒</span>
          <p className="leading-snug text-[13px] font-medium text-slate-700">
            {formatAvailabilityWindow(resource.availabilityWindow)}
          </p>
        </div>
      )}

      {(resource.availableFromDate || resource.availableToDate) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
          <span className="p-1.5 bg-emerald-50 rounded-md text-emerald-500 text-xs">📅</span>
          <p className="leading-snug text-[13px] font-medium text-slate-700">
             {formatDateLabel(resource.availableFromDate)} - {formatDateLabel(resource.availableToDate)}
          </p>
        </div>
      )}

      {(resource.unavailableFromDate || resource.unavailableToDate) && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
          <span className="p-1.5 bg-rose-50 rounded-md text-rose-500 text-xs">⚠️</span>
          <p className="leading-snug text-[13px] font-medium text-slate-700">
            {formatDateLabel(resource.unavailableFromDate)} - {formatDateLabel(resource.unavailableToDate)}
          </p>
        </div>
      )}

      {canManage && (
        <div className="pt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex-1 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
          >
            Delete
          </button>
        </div>
      )}

      {canBook && (
        <div className="pt-4">
          <button
            type="button"
            onClick={onBook}
            className="w-full py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Request Booking
          </button>
        </div>
      )}
    </div>
  </article>
);

const AddResourceModal = ({
  isOpen,
  title,
  submitLabel,
  typeOptions,
  resourceType,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialForm);
  const [nameError, setNameError] = useState('');
  const [capacityError, setCapacityError] = useState('');
  const isFacility = resourceType === 'FACILITY';
  const statusOptions = isFacility ? FACILITY_STATUSES : ASSET_STATUSES;
  const locationOptions = isFacility ? FACILITY_LOCATION_OPTIONS : ASSET_LOCATION_OPTIONS;
  const today = new Date().toISOString().split('T')[0];
  const availabilityFromParts = getTimeParts(form.availabilityFrom, TIME_TO_HOUR_OPTIONS);
  const availabilityToParts = getTimeParts(form.availabilityTo, TIME_TO_HOUR_OPTIONS);

  const validateName = (value) => {
    if (!value) {
      return '';
    }

    if (isFacility && value.length > 5) {
      return 'Facility name cannot exceed 5 characters.';
    }

    if (!isFacility && value.length > 30) {
      return 'Asset name cannot exceed 30 characters.';
    }

    if (/^\d+$/.test(value)) {
      return 'Name cannot be numbers only. It must contain letters.';
    }

    if (!/^[A-Z]/.test(value)) {
      return `${isFacility ? 'Facility' : 'Asset'} name must start with a capital letter.`;
    }

    return '';
  };

  const validateCapacity = (value, statusValue = form.status) => {
    if (value === '' || value === null || value === undefined) {
      return '';
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return 'Amount must be a valid number.';
    }

    if (isFacility && numericValue < 1) {
      return 'Value cannot be less than 1.';
    }

    if (!isFacility && statusValue === 'OUT_OF_STOCK') {
      if (numericValue !== 0) {
        return 'Out of Stock amount must be 0.';
      }
      return '';
    }

    if (!isFacility && statusValue === 'AVAILABLE' && numericValue <= 0) {
      return 'Available amount must be greater than 0.';
    }

    return '';
  };

  useEffect(() => {
    if (isOpen) {
      const parsedWindow = parseAvailabilityWindow(initialValues?.availabilityWindow || '');
      setForm({
        ...initialForm,
        ...initialValues,
        type: initialValues?.type || typeOptions[0] || '',
        location: initialValues?.location || locationOptions[0],
        status: initialValues?.status || statusOptions[0],
        ...parsedWindow,
      });
      setNameError('');
      setCapacityError('');
    }
  }, [initialValues, isOpen, locationOptions, statusOptions, typeOptions]);

  useEffect(() => {
    if (!isFacility && form.status === 'OUT_OF_STOCK' && form.capacity !== '0') {
      setForm((prev) => ({ ...prev, capacity: '0' }));
      setCapacityError('');
    }
  }, [form.capacity, form.status, isFacility]);

  if (!isOpen) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    const currentNameError = validateName(form.name);
    const currentCapacityError = validateCapacity(form.capacity);
    setNameError(currentNameError);
    setCapacityError(currentCapacityError);

    if (currentNameError || currentCapacityError) {
      return;
    }

    if (isFacility && ['ACTIVE', 'AVAILABLE'].includes(form.status)) {
      if (!form.availableFromDate || !form.availableToDate) {
        toast.error('Please select Available From Date and Available To Date.');
        return;
      }

      if (form.availableToDate < form.availableFromDate) {
        toast.error('Available To Date cannot be before Available From Date.');
        return;
      }
    }

    if (isFacility && ['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(form.status)) {
      if (!form.unavailableFromDate || !form.unavailableToDate) {
        toast.error('Please select Unavailable From and Unavailable To dates.');
        return;
      }

      if (form.unavailableToDate < form.unavailableFromDate) {
        toast.error('Unavailable To cannot be before Unavailable From.');
        return;
      }
    }

    const shouldUseAvailableDates = isFacility && ['ACTIVE', 'AVAILABLE'].includes(form.status);
    const shouldUseUnavailableDates = isFacility && ['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(form.status);

    const payload = {
      ...form,
      capacity: !isFacility && form.status === 'OUT_OF_STOCK' ? '0' : form.capacity,
      availabilityWindow: isFacility ? `${form.availabilityFrom} - ${form.availabilityTo}` : '',
      availableFromDate: shouldUseAvailableDates ? form.availableFromDate : '',
      availableToDate: shouldUseAvailableDates ? form.availableToDate : '',
      unavailableFromDate: shouldUseUnavailableDates ? form.unavailableFromDate : '',
      unavailableToDate: shouldUseUnavailableDates ? form.unavailableToDate : '',
    };
    await onSubmit(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-[2px] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
          <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 text-sm text-slate-700">
            {resourceType === 'FACILITY' ? 'Facility Name' : 'Asset Name'}: *
            <input
              required
              placeholder={resourceType === 'FACILITY' ? 'Enter facility name' : 'Enter asset name'}
              value={form.name}
              onChange={(event) => {
                const value = event.target.value;
                setForm((prev) => ({ ...prev, name: value }));
                setNameError(validateName(value));
              }}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                nameError ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-500'
              }`}
            />
            {nameError && <p className="text-xs text-red-600 mt-0.5">{nameError}</p>}
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Type: *
            <select
              required
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {formatEnumLabel(option)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-2 text-sm text-slate-700">
            {isFacility ? 'Seating Capacity' : 'Available Amount'}: *
            <input
              required
              min={isFacility ? '1' : form.status === 'OUT_OF_STOCK' ? '0' : '1'}
              type="number"
              placeholder={isFacility ? 'Enter seating capacity' : 'Enter available amount'}
              value={form.capacity}
              disabled={!isFacility && form.status === 'OUT_OF_STOCK'}
              onChange={(event) => {
                const value = event.target.value;
                setForm((prev) => ({ ...prev, capacity: value }));
                setCapacityError(validateCapacity(value));
              }}
              className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                capacityError ? 'border-red-500 focus:ring-red-400' : 'border-slate-300 focus:ring-blue-500'
              } ${!isFacility && form.status === 'OUT_OF_STOCK' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}`}
            />
            {capacityError && <p className="text-xs text-red-600 mt-0.5">{capacityError}</p>}
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Location: *
            <select
              required
              value={form.location}
              onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </label>

          {isFacility && (
            <label className="flex flex-col gap-2 text-sm text-slate-700 md:col-span-2">
              {['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(form.status) ? 'Unavailability Window' : 'Availability Window'}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs text-slate-500">
                  From
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <select
                      required
                      value={availabilityFromParts.hours}
                      onChange={(event) => setForm((prev) => ({
                        ...prev,
                        availabilityFrom: buildTimeValue(event.target.value, availabilityFromParts.minutes),
                      }))}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TIME_TO_HOUR_OPTIONS.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm font-medium text-slate-500">:</span>
                    <select
                      required
                      value={availabilityFromParts.minutes}
                      onChange={(event) => setForm((prev) => ({
                        ...prev,
                        availabilityFrom: buildTimeValue(availabilityFromParts.hours, event.target.value),
                      }))}
                      disabled={availabilityFromParts.hours === '24'}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {(availabilityFromParts.hours === '24' ? ['00'] : TIME_MINUTE_OPTIONS).map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
                <label className="flex flex-col gap-1 text-xs text-slate-500">
                  To
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <select
                      required
                      value={availabilityToParts.hours}
                      onChange={(event) => setForm((prev) => ({
                        ...prev,
                        availabilityTo: buildTimeValue(event.target.value, availabilityToParts.minutes),
                      }))}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {TIME_TO_HOUR_OPTIONS.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm font-medium text-slate-500">:</span>
                    <select
                      required
                      value={availabilityToParts.minutes}
                      onChange={(event) => setForm((prev) => ({
                        ...prev,
                        availabilityTo: buildTimeValue(availabilityToParts.hours, event.target.value),
                      }))}
                      disabled={availabilityToParts.hours === '24'}
                      className="px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                    >
                      {(availabilityToParts.hours === '24' ? ['00'] : TIME_MINUTE_OPTIONS).map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>
            </label>
          )}

          <div className="md:col-span-2">
            <p className="text-sm text-slate-700 mb-2">Status: *</p>
            <div className="flex flex-wrap items-center gap-4">
              {statusOptions.map((status) => (
                <label key={status} className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    value={status}
                    checked={form.status === status}
                    onChange={(event) => {
                      const nextStatus = event.target.value;
                      const nextCapacity = !isFacility
                        ? nextStatus === 'OUT_OF_STOCK'
                          ? '0'
                          : form.capacity === '0'
                            ? ''
                            : form.capacity
                        : form.capacity;

                      setForm((prev) => ({
                        ...prev,
                        status: nextStatus,
                        capacity: nextCapacity,
                        availableFromDate: ['ACTIVE', 'AVAILABLE'].includes(nextStatus) ? prev.availableFromDate : '',
                        availableToDate: ['ACTIVE', 'AVAILABLE'].includes(nextStatus) ? prev.availableToDate : '',
                        unavailableFromDate: ['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(nextStatus) ? prev.unavailableFromDate : '',
                        unavailableToDate: ['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(nextStatus) ? prev.unavailableToDate : '',
                      }));

                      if (!isFacility) {
                        setCapacityError(validateCapacity(nextCapacity, nextStatus));
                      }
                    }}
                    className="accent-blue-600"
                  />
                  {formatEnumLabel(status)}
                </label>
              ))}
            </div>
          </div>

          {isFacility && ['ACTIVE', 'AVAILABLE'].includes(form.status) && (
            <>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Available From Date: *
                <input
                  required
                  type="date"
                  min={today}
                  value={form.availableFromDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, availableFromDate: event.target.value }))}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Available To Date: *
                <input
                  required
                  type="date"
                  min={form.availableFromDate || today}
                  value={form.availableToDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, availableToDate: event.target.value }))}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </>
          )}

          {isFacility && ['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(form.status) && (
            <>
              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Unavailable From: *
                <input
                  required
                  type="date"
                  min={today}
                  value={form.unavailableFromDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, unavailableFromDate: event.target.value }))}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                Unavailable To: *
                <input
                  required
                  type="date"
                  min={form.unavailableFromDate || today}
                  value={form.unavailableToDate}
                  onChange={(event) => setForm((prev) => ({ ...prev, unavailableToDate: event.target.value }))}
                  className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </>
          )}

          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ResourceCatalogPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('FACILITY');
  const [catalog, setCatalog] = useState({ facilities: [], assets: [] });
  const [filters, setFilters] = useState(emptyFilters);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: 'ADD',
    resourceType: 'FACILITY',
    resource: null,
  });
  const [bookingState, setBookingState] = useState({ isOpen: false, resource: null, mode: 'CREATE', request: null });
  const [studentRequests, setStudentRequests] = useState([]);

  const isManager = user?.role === 'MANAGER';
  const isStudent = user?.role === 'USER';

  const loadCatalog = async () => {
    const response = await resourceCatalogApi.getCatalog();
    setCatalog(response.data);
  };

  const loadStudentRequests = async () => {
    if (!isStudent) {
      setStudentRequests([]);
      return;
    }

    const response = await bookingRequestsApi.getAll();
    const requests = (response.data || []).filter(
      (request) => request.requesterEmail === user?.email
    );
    setStudentRequests(requests);
  };

  useEffect(() => {
    loadCatalog();
  }, [user?.role]);

  useEffect(() => {
    const refreshCatalog = () => {
      loadCatalog();
    };

    window.addEventListener('focus', refreshCatalog);
    window.addEventListener('storage', refreshCatalog);

    return () => {
      window.removeEventListener('focus', refreshCatalog);
      window.removeEventListener('storage', refreshCatalog);
    };
  }, []);

  useEffect(() => {
    loadStudentRequests();
  }, [isStudent, user?.email]);

  const currentItems = activeTab === 'FACILITY' ? catalog.facilities : catalog.assets;
  const currentStatusOptions = activeTab === 'FACILITY' ? FACILITY_STATUSES : ASSET_STATUSES;
  const currentLocationOptions = activeTab === 'FACILITY' ? FACILITY_LOCATION_OPTIONS : ASSET_LOCATION_OPTIONS;

  const locationOptions = useMemo(() => {
    return ['ALL', ...currentLocationOptions];
  }, [currentLocationOptions]);

  const filteredItems = useMemo(() => {
    return currentItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.type.toLowerCase().includes(filters.search.toLowerCase());
      const matchesType = filters.type === 'ALL' || item.type === filters.type;
      const matchesLocation = filters.location === 'ALL' || item.location === filters.location;
      const matchesStatus = filters.status === 'ALL' || item.status === filters.status;
      const matchesCapacity = !filters.minCapacity || item.capacity >= Number(filters.minCapacity);

      return matchesSearch && matchesType && matchesLocation && matchesStatus && matchesCapacity;
    });
  }, [currentItems, filters]);

  const typeOptions = activeTab === 'FACILITY' ? FACILITY_TYPES : ASSET_TYPES;

  const openAddModal = () => {
    if (!isManager) {
      return;
    }

    setModalState({
      isOpen: true,
      mode: 'ADD',
      resourceType: activeTab,
      resource: null,
    });
  };

  const openEditModal = (resource) => {
    if (!isManager) {
      return;
    }

    setModalState({
      isOpen: true,
      mode: 'EDIT',
      resourceType: activeTab,
      resource,
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, mode: 'ADD', resourceType: activeTab, resource: null });
  };

  const saveResource = async (formData) => {
    const { mode, resourceType, resource } = modalState;

    if (mode === 'ADD' && resourceType === 'FACILITY') {
      await resourceCatalogApi.addFacility(formData);
    } else if (mode === 'ADD' && resourceType === 'ASSET') {
      await resourceCatalogApi.addAsset(formData);
    } else if (mode === 'EDIT' && resourceType === 'FACILITY' && resource?.id) {
      await resourceCatalogApi.updateFacility(resource.id, formData);
    } else if (mode === 'EDIT' && resourceType === 'ASSET' && resource?.id) {
      await resourceCatalogApi.updateAsset(resource.id, formData);
    }

    await loadCatalog();
  };

  const deleteResource = async (resourceId) => {
    if (!isManager) {
      return;
    }

    if (!window.confirm('Delete this resource?')) {
      return;
    }

    if (activeTab === 'FACILITY') {
      await resourceCatalogApi.deleteFacility(resourceId);
    } else {
      await resourceCatalogApi.deleteAsset(resourceId);
    }

    await loadCatalog();
  };

  const openBookModal = (resource) => {
    if (!isStudent) {
      return;
    }

    if (['OUT_OF_SERVICE', 'OUT_OF_STOCK'].includes(resource.status)) {
      toast.error('This resource is currently unavailable for booking.');
      return;
    }

    setBookingState({ isOpen: true, resource });
  };

  const closeBookModal = () => {
    setBookingState({ isOpen: false, resource: null, mode: 'CREATE', request: null });
  };

  const openEditBookingModal = (request) => {
    if (!isStudent || request.status !== 'PENDING') {
      return;
    }

    setBookingState({
      isOpen: true,
      mode: 'EDIT',
      request,
      resource: {
        id: request.resourceId,
        name: request.resourceName,
        type: request.resourceType,
      },
    });
  };

  const submitBooking = async (bookingFormData) => {
    if (!bookingState.resource) {
      return;
    }

    try {
      if (bookingState.mode === 'EDIT' && bookingState.request?.id) {
        await bookingRequestsApi.update(bookingState.request.id, {
          bookingDate: bookingFormData.bookingDate,
          timeRange: bookingFormData.timeRange,
          purpose: bookingFormData.purpose,
          attendees: bookingFormData.attendees,
          expectedAmount: bookingFormData.expectedAmount,
        });
        await loadStudentRequests();
        toast.success('Booking request updated successfully.');
        return;
      }

      await bookingRequestsApi.create({
        resourceId: bookingState.resource.id,
        resourceName: bookingState.resource.name,
        resourceType: bookingState.resource.type,
        location: bookingState.resource.location,
        requesterName: user?.fullName || 'Student',
        requesterEmail: user?.email || '',
        bookingDate: bookingFormData.bookingDate,
        timeRange: bookingFormData.timeRange,
        purpose: bookingFormData.purpose,
        attendees: bookingFormData.attendees,
        expectedAmount: bookingFormData.expectedAmount,
      });

      await loadStudentRequests();
      toast.success('Booking request submitted successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process booking request due to a scheduling conflict or server error.');
    }
  };

  const deleteBookingRequest = async (requestId) => {
    if (!isStudent) {
      return;
    }

    if (!window.confirm('Delete this booking request?')) {
      return;
    }

    await bookingRequestsApi.delete(requestId);
    await loadStudentRequests();
    toast.success('Booking request deleted successfully.');
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-slate-500 mb-2">Resource Management / Catalogue</p>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Facilities and Assets</h1>
        <p className="text-slate-600 mb-6">Maintain separate catalogues for bookable facilities and equipment resources.</p>

        <div className="mb-4 text-sm">
          {isManager && <p className="text-blue-700">Manager mode: You can add, edit, and delete resources.</p>}
          {isStudent && <p className="text-indigo-700">Student mode: You can view resources and submit booking requests.</p>}
          {!isManager && !isStudent && <p className="text-slate-700">View mode: Use admin booking review to approve or reject requests.</p>}
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-4 md:p-6 mb-8 transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2" />
          <div className="flex flex-wrap items-center gap-3 mb-6 relative z-10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('FACILITY');
                setFilters(emptyFilters);
              }}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'FACILITY' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 transform -translate-y-0.5' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
              }`}
            >
              Facility Catalogue
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('ASSET');
                setFilters(emptyFilters);
              }}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${
                activeTab === 'ASSET' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 transform -translate-y-0.5' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-transparent'
              }`}
            >
              Asset Catalogue
            </button>

            {isManager && (
              <div className="ml-auto">
                <button
                  type="button"
                  onClick={openAddModal}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold shadow-md transition-transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <span className="text-lg leading-none">+</span> {activeTab === 'FACILITY' ? 'Add Facility' : 'Add Asset'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            <div className="relative">
              <input
                placeholder="Search resources..."
                value={filters.search}
                onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
              <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <select
              value={filters.type}
              onChange={(event) => setFilters((prev) => ({ ...prev, type: event.target.value }))}
              className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="ALL">All Types</option>
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll('_', ' ')}
                </option>
              ))}
            </select>

            <select
              value={filters.location}
              onChange={(event) => setFilters((prev) => ({ ...prev, location: event.target.value }))}
              className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location === 'ALL' ? 'All Locations' : location}
                </option>
              ))}
            </select>

            <div className="relative">
              <input
                type="number"
                min="1"
                placeholder="Min Capacity"
                value={filters.minCapacity}
                onChange={(event) => setFilters((prev) => ({ ...prev, minCapacity: event.target.value }))}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
              />
              <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400">👥</span>
            </div>

            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              {currentStatusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
          {filteredItems.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              accentClass={getAccentClass(activeTab, resource.type)}
              canManage={isManager}
              canBook={isStudent}
              onEdit={() => openEditModal(resource)}
              onDelete={() => deleteResource(resource.id)}
              onBook={() => openBookModal(resource)}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="mt-8 bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-600">
            No resources found for the selected filters.
          </div>
        )}

        {isStudent && (
          <section className="mt-12 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden">
            <div className="px-6 py-5 bg-white/40 border-b border-slate-200/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg text-sm">🎫</span>
                My Booking Requests
              </h2>
              <p className="text-sm text-slate-500 mt-1 pl-11">Track admin decisions for your submitted requests.</p>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {studentRequests.map((request) => (
                <article key={request.id} className="relative bg-white border border-slate-200/70 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 rounded-l-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <p className="font-bold text-slate-900 text-lg">{request.resourceName}</p>
                    <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide shadow-sm ${
                      request.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      request.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                      'bg-amber-100 text-amber-700 border border-amber-200 animate-pulse'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Date & Time</p>
                      <p className="font-medium text-slate-700">{request.bookingDate}</p>
                      {request.timeRange && <p className="text-slate-500">{request.timeRange}</p>}
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold uppercase mb-0.5">Details</p>
                      {request.attendees && <p>👥 {request.attendees} Attendees</p>}
                      {request.expectedAmount && <p>📦 {request.expectedAmount} Items</p>}
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-700"><span className="font-semibold">Purpose:</span> {request.purpose}</p>
                    {request.adminReason && (
                      <div className="mt-2 p-2 bg-rose-50 border border-rose-100 rounded-lg">
                        <p className="text-rose-800 text-xs"><span className="font-bold">Admin Note:</span> {request.adminReason}</p>
                      </div>
                    )}
                  </div>
                  {request.status === 'PENDING' && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => openEditBookingModal(request)}
                        className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBookingRequest(request.id)}
                        className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                  {['REJECTED', 'CANCELLED'].includes(request.status) && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => deleteBookingRequest(request.id)}
                        className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                      >
                        Dismiss Record
                      </button>
                    </div>
                  )}
                </article>
              ))}

              {studentRequests.length === 0 && (
                <div className="col-span-1 lg:col-span-2 py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
                  <div className="text-4xl mb-2">🎫</div>
                  <p className="text-slate-600 font-medium">No booking requests yet</p>
                  <p className="text-slate-400 text-sm mt-1">When you request a resource, it will appear here.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <AddResourceModal
        isOpen={modalState.isOpen}
        title={`${modalState.mode === 'EDIT' ? 'Edit' : 'Add'} ${
          modalState.resourceType === 'FACILITY' ? 'Facility' : 'Asset'
        }`}
        submitLabel={modalState.mode === 'EDIT' ? 'Update' : `Add ${modalState.resourceType === 'FACILITY' ? 'Facility' : 'Asset'}`}
        typeOptions={modalState.resourceType === 'FACILITY' ? FACILITY_TYPES : ASSET_TYPES}
        resourceType={modalState.resourceType}
        initialValues={modalState.resource || {}}
        onClose={closeModal}
        onSubmit={saveResource}
      />

      <BookingRequestModal
        isOpen={bookingState.isOpen}
        resource={bookingState.resource}
        initialValues={bookingState.mode === 'EDIT' ? bookingState.request : null}
        title={bookingState.mode === 'EDIT' ? `Update ${bookingState.resource?.name || 'Booking'}` : `Book ${bookingState.resource?.name || ''}`}
        submitLabel={bookingState.mode === 'EDIT' ? 'Update Request' : 'Submit Request'}
        onClose={closeBookModal}
        onSubmit={submitBooking}
      />
    </div>
  );
};

export default ResourceCatalogPage;
