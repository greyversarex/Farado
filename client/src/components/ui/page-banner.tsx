import { useTranslation } from "@/lib/simple-i18n";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export function PageBanner({ title, subtitle, backgroundImage }: PageBannerProps) {
  const { t } = useTranslation();
  
  return (
    <div className="relative h-64 md:h-80 bg-gradient-to-br from-red-600 via-red-700 to-red-800 overflow-hidden">
      {/* Animated shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-shine"></div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl mx-auto px-4 relative z-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 drop-shadow-lg leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 drop-shadow-md leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}