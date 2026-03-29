import { useEffect, useMemo, useState } from 'react';

const formatMinutes = (value) => {
  if (!Number.isFinite(value) || value < 0) {
    return '-';
  }

  const days = Math.floor(value / 1440);
  const hours = Math.floor((value % 1440) / 60);
  const minutes = value % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
};

const diffMinutes = (startIso, endIso) => {
  if (!startIso) {
    return null;
  }

  const start = new Date(startIso);
  const end = endIso ? new Date(endIso) : new Date();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  return Math.max(0, Math.floor((end.getTime() - start.getTime()) / 60000));
};

const ServiceLevelTimer = ({ ticket }) => {
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => setNowTick(Date.now()), 30000);
    return () => clearInterval(intervalId);
  }, []);

  const metrics = useMemo(() => {
    void nowTick;

    const firstResponseMinutes = diffMinutes(ticket?.createdAt, ticket?.firstResponseAt || null);
    const resolutionMinutes = diffMinutes(ticket?.createdAt, ticket?.resolvedAt || null);

    return {
      firstResponseMinutes,
      resolutionMinutes,
      hasFirstResponse: Boolean(ticket?.firstResponseAt),
      isResolved: Boolean(ticket?.resolvedAt),
    };
  }, [ticket?.createdAt, ticket?.firstResponseAt, ticket?.resolvedAt, nowTick]);

  return (
    <div className="mt-4 p-3 rounded-lg border border-slate-200 bg-slate-50">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h4 className="text-sm font-semibold text-slate-900">Service-Level Timer</h4>
        <span className="text-xs text-slate-500">auto refresh 30s</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div className="rounded border border-blue-200 bg-blue-50 px-3 py-2">
          <p className="text-blue-900 font-medium">Time to First Response</p>
          <p className="text-blue-800 text-lg font-semibold">{formatMinutes(metrics.firstResponseMinutes)}</p>
          <p className="text-xs text-blue-700">{metrics.hasFirstResponse ? 'Responded' : 'Waiting for first response'}</p>
        </div>

        <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2">
          <p className="text-emerald-900 font-medium">Time to Resolution</p>
          <p className="text-emerald-800 text-lg font-semibold">{formatMinutes(metrics.resolutionMinutes)}</p>
          <p className="text-xs text-emerald-700">{metrics.isResolved ? 'Resolved' : 'Resolution timer running'}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceLevelTimer;
