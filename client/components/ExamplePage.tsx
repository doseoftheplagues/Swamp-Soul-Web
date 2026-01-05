import { TimeDisplay } from './SmallerComponents/TimeDisplay';

export function ExamplePage() {
  // Use current date for relative testing
  const now = new Date();

  // Define some example timestamps for testing
  const recentTimestamp = now.toISOString(); // Just now
  const fewMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
  const fewHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(); // 3 hours ago
  const fewDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(); // 4 days ago
  const exactlySevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(); // Exactly 7 days ago
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString(); // A month ago
  const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString(); // A year ago

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Time Display Examples</h1>
      <ul className="list-disc pl-5">
        <li className="mb-2">
          <strong>Just now:</strong> <TimeDisplay timestamp={recentTimestamp} />
        </li>
        <li className="mb-2">
          <strong>5 minutes ago:</strong> <TimeDisplay timestamp={fewMinutesAgo} />
        </li>
        <li className="mb-2">
          <strong>3 hours ago:</strong> <TimeDisplay timestamp={fewHoursAgo} />
        </li>
        <li className="mb-2">
          <strong>4 days ago:</strong> <TimeDisplay timestamp={fewDaysAgo} />
        </li>
        <li className="mb-2">
          <strong>Exactly 7 days ago:</strong> <TimeDisplay timestamp={exactlySevenDaysAgo} />
        </li>
        <li className="mb-2">
          <strong>A month ago:</strong> <TimeDisplay timestamp={monthAgo} />
        </li>
        <li className="mb-2">
          <strong>A year ago:</strong> <TimeDisplay timestamp={yearAgo} />
        </li>
      </ul>
    </div>
  );
}
