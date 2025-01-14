export default function PageSpinner() {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-primary animate-spin"></div>
        <div className="absolute inset-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary animate-spin" style={{ animationDirection: 'reverse', opacity: 0.6 }}></div>
        <div className="absolute inset-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-primary animate-spin" style={{ animationDelay: '-0.3s', opacity: 0.3 }}></div>
      </div>
    </div>
  );
}
