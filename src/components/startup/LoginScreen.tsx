import Image from "next/image";

interface LoginScreenProps {
  onLogin: () => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="w-full h-full bg-[#1b3a9a] flex flex-col relative select-none">
      {/* Background Texture/Grid (Simulated using CSS) */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '4px 4px'
        }}
      ></div>

      {/* Top Header Bar */}
      <div className="w-full h-16 bg-gradient-to-r from-[#001082] to-[#1231a4] shadow-md z-10 flex items-center shrink-0"></div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 px-8">
        
        {/* Left Side: Logo */}
        <div className="flex flex-col items-end justify-center w-1/2 max-w-[500px]">
          <div className="flex items-start gap-6 mb-4">
            <Image 
              src="/icons/Start-icon.png" 
              alt="Windows Logo" 
              width={72} 
              height={72}
              className="drop-shadow-md shrink-0 mt-1"
            />
            
            <div className="flex flex-col justify-center mb-10 md:mb-0">
              <h1 
                className="text-white text-3xl md:text-4xl tracking-tight drop-shadow-md mb-2"
                style={{ fontFamily: "'Trebuchet MS', sans-serif", fontWeight: "bold", fontStyle: "italic" }}
              >
                Uganthan&apos;s<span className="font-light"> Portfolio</span>
              </h1>
              <div className="h-[2px] w-full max-w-[400px] bg-gradient-to-r from-transparent via-[#2b7194] to-transparent my-1"></div>
              <p className="text-white/90 italic text-base tracking-wide drop-shadow-md max-w-[320px] leading-snug">
                Student, AI engineer, Software developer, Graphic designer
              </p>
              
              <p className="text-white text-sm mt-8 font-sans drop-shadow-md">
                To begin, click on Uganthan to log in
              </p>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <div className="hidden md:block w-[1px] h-1/2 bg-white/20 shrink-0 mx-4"></div>

        {/* Right Side: User List */}
        <div className="flex flex-col items-start justify-center w-1/2 max-w-[500px]">
          
          {/* User Card */}
          <button 
            onClick={onLogin}
            className="group flex items-center gap-8 p-4 rounded-xl border border-transparent hover:border-white/30 hover:bg-white/10 transition-all cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-white/50 w-full max-w-[420px]"
          >
            {/* Profile Picture */}
            <div className="w-20 h-20 rounded border-[3px] border-white/80 overflow-hidden shadow-lg shrink-0 relative bg-black/20">
              <Image 
                src="/profile-picture.jpg" 
                alt="Uganthan Profile" 
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center text-left">
              <h2 className="text-white text-xl md:text-2xl font-medium drop-shadow-md group-hover:text-[#ffe400] transition-colors truncate mb-1">
                uganthan_m
              </h2>
              <p className="text-white/80 text-sm font-sans leading-snug">
                Student, AI engineer, Software developer, Graphic designer
              </p>
            </div>
          </button>
          
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="w-full h-16 bg-gradient-to-r from-[#001082] to-[#1231a4] shadow-md z-10 flex items-center justify-between px-8 shrink-0 border-t border-[#f7a249]">
        <div className="flex items-center space-x-2 text-white/90">
          <div className="w-6 h-6 rounded bg-green-500 border border-white/50 shadow flex items-center justify-center">
            <div className="w-3 h-3 border-t-2 border-l-2 border-white rounded-tl-sm rotate-45 transform translate-x-[2px] translate-y-[2px]"></div>
          </div>
          <span className="text-sm">Restart Uganthan Vistas</span>
        </div>
        
        <div className="text-white/80 text-xs text-right leading-tight font-sans">
          After you log on, the system&apos;s yours to explore.<br/>
          Every detail has been designed with a purpose.
        </div>
      </div>
    </div>
  );
}
