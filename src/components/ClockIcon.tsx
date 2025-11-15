interface ClockIconProps {
  time: string; // "09:00" or "14:30" format
  className?: string;
}

const ClockIcon = ({ time, className = "w-6 h-6" }: ClockIconProps) => {
  // Parse time to get hours and minutes
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
  };

  const { hours, minutes } = parseTime(time);

  // Calculate angles for clock hands
  // Hour hand: 30 degrees per hour + 0.5 degrees per minute
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  // Minute hand: 6 degrees per minute
  const minuteAngle = minutes * 6;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Clock circle */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      
      {/* Hour markers */}
      {[0, 3, 6, 9].map((hour) => {
        const angle = (hour * 30 - 90) * (Math.PI / 180);
        const x1 = 12 + 7.5 * Math.cos(angle);
        const y1 = 12 + 7.5 * Math.sin(angle);
        const x2 = 12 + 9 * Math.cos(angle);
        const y2 = 12 + 9 * Math.sin(angle);
        return (
          <line
            key={hour}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}

      {/* Hour hand */}
      <line
        x1="12"
        y1="12"
        x2={12 + 5 * Math.cos((hourAngle - 90) * (Math.PI / 180))}
        y2={12 + 5 * Math.sin((hourAngle - 90) * (Math.PI / 180))}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Minute hand */}
      <line
        x1="12"
        y1="12"
        x2={12 + 7 * Math.cos((minuteAngle - 90) * (Math.PI / 180))}
        y2={12 + 7 * Math.sin((minuteAngle - 90) * (Math.PI / 180))}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
};

export default ClockIcon;