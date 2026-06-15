export default function LEDNavbar() {
  return (
    <div className="fixed top-0 left-0 w-full bg-black h-20 overflow-hidden flex items-center border-b border-[#222] z-50">
      <div className="animate-marquee inline-block whitespace-nowrap pt-2">
        {/* We use two identical blocks. The CSS translates the container by exactly -50% to loop infinitely. */}
        
        <span className="inline-flex space-x-16 pr-16">
          {[...Array(6)].map((_, i) => (
            <span 
              key={`a-${i}`} 
              className="text-red-500 text-[48px] tracking-[0.1em] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] uppercase leading-none"
              style={{ fontFamily: 'var(--font-led)' }}
            >
              LITERALLY NOTHING TO WATCH
            </span>
          ))}
        </span>

        <span className="inline-flex space-x-16 pr-16">
          {[...Array(6)].map((_, i) => (
            <span 
              key={`b-${i}`} 
              className="text-red-500 text-[48px] tracking-[0.1em] drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] uppercase leading-none"
              style={{ fontFamily: 'var(--font-led)' }}
            >
              LITERALLY NOTHING TO WATCH
            </span>
          ))}
        </span>

      </div>
    </div>
  );
}
