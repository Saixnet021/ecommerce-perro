
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    className?: string;
    variant?: 'outline' | 'flat';
}

export function FeatureCard({
    icon: Icon,
    title,
    description,
    className,
    variant = 'flat'
}: FeatureCardProps) {
    return (
        <div className={cn(
            'p-6 rounded-lg transition-all duration-300 transform',
            variant === 'outline' && 'bg-white border-2 border-blue-200 hover:bg-blue-50 hover:scale-105 hover:shadow-lg',
            variant === 'flat' && 'text-center group',
            className
        )}>
            {variant === 'outline' ? (
                <>
                    <Icon className="w-8 h-8 text-blue-600 mb-2 animate-pulse" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-gray-700">{description}</p>
                </>
            ) : (
                <>
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-all duration-300 transform group-hover:scale-110">
                        <Icon className="w-8 h-8 text-blue-950" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                </>
            )}
        </div>
    );
}
