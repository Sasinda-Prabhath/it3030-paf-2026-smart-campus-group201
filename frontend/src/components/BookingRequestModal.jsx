import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
      toast.error('You cannot select a previous date.');
      return;
    }

    if (isFacilityBooking && form.timeFrom >= form.timeTo) {
      toast.error('End time must be later than start time.');
      return;
    }

    if (isFacilityBooking && Number(form.attendees) > Number(resource.capacity)) {
      toast.error(`Expected attendees cannot exceed the facility's capacity of ${resource.capacity}.`);
      return;
    }

    if (!isFacilityBooking && Number(form.expectedAmount) > Number(resource.capacity)) {
      toast.error(`Expected amount cannot exceed the available asset amount of ${resource.capacity}.`);
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 transform transition-all">
        <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {title || `Book ${resource.name}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Booking Date
            <input
              required
              type="date"
              min={getTodayDateString()}
              value={form.bookingDate}
              onChange={(event) => setForm((prev) => ({ ...prev, bookingDate: event.target.value }))}
              className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
            />
          </label>

          {isFacilityBooking && (
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              From Time
              <input
                required
                type="time"
                value={form.timeFrom}
                onChange={(event) => setForm((prev) => ({ ...prev, timeFrom: event.target.value }))}
                className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
              />
            </label>
          )}

          {isFacilityBooking && (
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              To Time
              <input
                required
                type="time"
                value={form.timeTo}
                onChange={(event) => setForm((prev) => ({ ...prev, timeTo: event.target.value }))}
                className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
              />
            </label>
          )}

          {isFacilityBooking && (
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Expected Attendees
              <input
                required
                min="1"
                type="number"
                value={form.attendees}
                onChange={(event) => setForm((prev) => ({ ...prev, attendees: event.target.value }))}
                className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
              />
            </label>
          )}

          {!isFacilityBooking && (
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Expected Amount
              <input
                required
                min="1"
                type="number"
                value={form.expectedAmount}
                onChange={(event) => setForm((prev) => ({ ...prev, expectedAmount: event.target.value }))}
                className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700 md:col-span-2">
            Purpose
            <textarea
              required
              value={form.purpose}
              onChange={(event) => setForm((prev) => ({ ...prev, purpose: event.target.value }))}
              className="px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 min-h-[100px] resize-y"
              placeholder="Briefly describe the purpose of your booking..."
            />
          </label>

          <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold border border-transparent text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0"
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