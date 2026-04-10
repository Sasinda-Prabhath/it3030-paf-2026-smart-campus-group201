import { useEffect, useState } from 'react';

const FACILITY_TYPES = ['LECTURE_HALL', 'MEETING_ROOM', 'LAB'];

const initialBookingForm = {
  bookingDate: '',
  timeFrom: '08:00',
  timeTo: '10:00',
  purpose: '',
  attendees: 1,
  expectedAmount: 1,
};

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const parseTimeRange = (timeRange) => {
  if (!timeRange) {
    return { timeFrom: '08:00', timeTo: '10:00' };
  }

  const parts = timeRange.split('-').map((value) => value.trim());
  if (parts.length === 2) {
    return { timeFrom: parts[0], timeTo: parts[1] };
  }

  return { timeFrom: '08:00', timeTo: '10:00' };
};

const BookingRequestModal = ({
  isOpen,
  resource,
  initialValues,
  title,
  submitLabel,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState(initialBookingForm);
  const isFacilityBooking = resource ? FACILITY_TYPES.includes(resource.type) : true;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const parsedTime = parseTimeRange(initialValues?.timeRange || '');
    setForm({
      ...initialBookingForm,
      bookingDate: initialValues?.bookingDate || '',
      purpose: initialValues?.purpose || '',
      attendees: initialValues?.attendees ?? 1,
      expectedAmount: initialValues?.expectedAmount ?? 1,
      ...parsedTime,
    });
  }, [initialValues, isOpen]);

  if (!isOpen || !resource) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    if (form.bookingDate < getTodayDateString()) {
      window.alert('You cannot select a previous date.');
      return;
    }

    if (isFacilityBooking && form.timeFrom >= form.timeTo) {
      window.alert('End time must be later than start time.');
      return;
    }

    if (isFacilityBooking && Number(form.attendees) > Number(resource.capacity)) {
      window.alert(`Expected attendees cannot exceed the facility's capacity of ${resource.capacity}.`);
      return;
    }

    if (!isFacilityBooking && Number(form.expectedAmount) > Number(resource.capacity)) {
      window.alert(`Expected amount cannot exceed the available asset amount of ${resource.capacity}.`);
      return;
    }

    await onSubmit({
      bookingDate: form.bookingDate,
      timeRange: isFacilityBooking ? `${form.timeFrom} - ${form.timeTo}` : '',
      purpose: form.purpose,
      attendees: isFacilityBooking ? form.attendees : null,
      expectedAmount: isFacilityBooking ? null : form.expectedAmount,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title || `Book ${resource.name}`}</h3>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700"
          >
            Close
          </button>
        </div>

        <form onSubmit={submit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-2 text-sm text-slate-700">
            Booking Date
            <input
              required
              type="date"
              min={getTodayDateString()}
              value={form.bookingDate}
              onChange={(event) => setForm((prev) => ({ ...prev, bookingDate: event.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-md"
            />
          </label>

          {isFacilityBooking && (
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              From Time
              <input
                required
                type="time"
                value={form.timeFrom}
                onChange={(event) => setForm((prev) => ({ ...prev, timeFrom: event.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-md"
              />
            </label>
          )}

          {isFacilityBooking && (
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              To Time
              <input
                required
                type="time"
                value={form.timeTo}
                onChange={(event) => setForm((prev) => ({ ...prev, timeTo: event.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-md"
              />
            </label>
          )}

          {isFacilityBooking && (
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Expected Attendees
              <input
                required
                min="1"
                type="number"
                value={form.attendees}
                onChange={(event) => setForm((prev) => ({ ...prev, attendees: event.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-md"
              />
            </label>
          )}

          {!isFacilityBooking && (
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              Expected Amount
              <input
                required
                min="1"
                type="number"
                value={form.expectedAmount}
                onChange={(event) => setForm((prev) => ({ ...prev, expectedAmount: event.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-md"
              />
            </label>
          )}

          <label className="flex flex-col gap-2 text-sm text-slate-700 md:col-span-2">
            Purpose
            <textarea
              required
              value={form.purpose}
              onChange={(event) => setForm((prev) => ({ ...prev, purpose: event.target.value }))}
              className="px-3 py-2 border border-slate-300 rounded-md min-h-[90px]"
            />
          </label>

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
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {submitLabel || 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingRequestModal;