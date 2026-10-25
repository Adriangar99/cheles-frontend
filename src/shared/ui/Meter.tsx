type Props = {
  label: string;
  value: number;
  max: number;
  color: string;
  // horizontal: a full-width track; vertical: a column bar `length` px tall at `max`; segment: a piece of a strip
  orientation?: "horizontal" | "vertical" | "segment";
  length?: number;
};

// A bar exposed as a meter (its accessible value is `value` out of `max`). An ARIA meter rather than a native <meter>,
// which cannot be drawn vertical or category-colored consistently across browsers.
export function Meter({ label, value, max, color, orientation = "horizontal", length = max }: Props) {
  const share = max > 0 ? value / max : 0;
  const meter = {
    role: "meter",
    "aria-label": label,
    "aria-valuemin": 0,
    "aria-valuemax": max,
    "aria-valuenow": value,
  } as const;
  if (orientation === "segment") {
    return <span className="seg" {...meter} style={{ width: `${share * 100}%`, background: color }} />;
  }
  if (orientation === "vertical") {
    return <div className="b" {...meter} style={{ height: `${share * length}px`, background: color }} />;
  }
  return (
    <div className="bar">
      <span {...meter} style={{ width: `${share * 100}%`, background: color }} />
    </div>
  );
}
