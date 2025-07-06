import { cn } from "@/lib/utils";
import {
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconTerminal2,
} from "@tabler/icons-react";

export function Features({ enableAnimation = false }: { enableAnimation?: boolean }) {
  const features = [
    {
      title: "Built for developers",
      description:
        "Comprehensive SDKs to integrate MAYLNG with your favorite tools and platforms effortlessly.",
      icon: <IconTerminal2 />,
    },
    {
      title: "Better Email Client",
      description:
        "A superior email experience that surpasses Gmail with modern features designed for today's workflows.",
      icon: <IconEaseInOut />,
    },
    {
      title: "Agent Identities",
      description:
        "Create permanent or temporary identities for your AI agents, giving them the email presence they need.",
      icon: <IconCurrencyDollar />,
    },
    {
      title: "Seamless Integration",
      description: "Simple and seamless integration process that gets you up and running in minutes, not hours.",
      icon: <IconCloud />,
    }
  ];
  
  if (enableAnimation) {
    // For animation mode, render cards stacked in center with proper z-indexes
    return (
      <div className="relative w-full h-96 max-w-7xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className={`feature-card absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0`}
            style={{ 
              zIndex: 15 - index,
              width: '280px'
            }}
          >
            <Feature {...feature} index={index} isAnimated={true} />
          </div>
        ))}
      </div>
    );
  }
  
  // Default grid mode
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} isAnimated={false} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
  isAnimated = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
  isAnimated?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col relative group/feature",
        isAnimated 
          ? "bg-white p-6 rounded-lg border border-gray-600" // No background for animated cards
          : "py-10 lg:border-r dark:border-neutral-800",
        !isAnimated && (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        !isAnimated && index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {!isAnimated && index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {!isAnimated && index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      
      {/* Icon */}
      <div className={cn(
        "mb-4 relative z-10 text-neutral-600 dark:text-neutral-400",
        isAnimated ? "text-left" : "px-10"
      )}>
        {icon}
      </div>
      
      {/* Title */}
      <div className={cn(
        "text-lg font-bold mb-2 relative z-10",
        isAnimated ? "text-left" : "px-10"
      )}>
        <div className="absolute -left-5 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className={cn(
          "transition duration-200 inline-block text-neutral-800 dark:text-neutral-100",
          !isAnimated && "group-hover/feature:translate-x-2"
        )}>
          {title}
        </span>
      </div>
      
      {/* Description */}
      <p className={cn(
        "text-sm text-neutral-600 dark:text-neutral-300 relative z-10",
        isAnimated ? "text-left max-w-none" : "max-w-xs px-10"
      )}>
        {description}
      </p>
    </div>
  );
};
{/* <div
  className={cn(
    "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
    (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
    index < 4 && "lg:border-b dark:border-neutral-800"
  )}
>
  {index < 4 && (
    <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
  )}
  {index >= 4 && (
    <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
  )}
  <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
    {icon}
  </div>
  <div className="text-lg font-bold mb-2 relative z-10 px-10">
    <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
    <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
      {title}
    </span>
  </div>
  <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
    {description}
  </p>
</div> */}
