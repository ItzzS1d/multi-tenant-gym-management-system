interface HeroSectionProps {
    title: string;
    description: string;
    img?: string
}
export const HeroSection = ({ title, description, img }: HeroSectionProps) => {
    return (
        <section
            className="hidden lg:flex lg:w-1/2 relative h-full bg-cover bg-center overflow-hidden bg-gray-900"
            style={{
                backgroundImage: img ? `url(${img})` : "url('/register-hero-section.avif')",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-dark/40 via-brand-dark/30 to-transparent"></div>

            <div className="relative z-10 flex flex-col justify-end p-20 h-full max-w-2xl">
                <h1 className="text-6xl font-extrabold text-white leading-[1.15] mb-8">
                    {title}
                </h1>
                <p className="text-xl text-gray-200 font-body leading-relaxed max-w-md">
                    {description}
                </p>
            </div>

            <div className="absolute top-10 left-10 z-10">
                <div className="flex items-center gap-2 text-white">
                    <div className="p-2 bg-brand-primary rounded-lg">
                        <svg
                            className="w-6 h-6 text-brand-dark"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                            />
                        </svg>
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight">
                        Gym Mart
                    </span>
                </div>
            </div>
        </section>
    );
};
