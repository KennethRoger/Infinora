const Spinner = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div
        className="w-4 h-4 bg-white rounded-full animate-bounceDelay"
        style={{ animationDelay: "-0.32s" }}
      ></div>
      <div
        className="w-4 h-4 bg-white rounded-full animate-bounceDelay"
        style={{ animationDelay: "-0.16s" }}
      ></div>
      <div className="w-4 h-4 bg-white rounded-full animate-bounceDelay"></div>
    </div>
  );
};

export default Spinner;
