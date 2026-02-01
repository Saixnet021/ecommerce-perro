
import { cn } from '@/lib/utils';
import { AnimateIn } from './animate-in';

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    container?: boolean;
    background?: 'white' | 'gray' | 'gradient';
}

export function Section({
    children,
    className,
    container = true,
    background = 'white',
    ...props
}: SectionProps) {
    const bgColors = {
        white: 'bg-white',
        gray: 'bg-slate-50',
        gradient: 'bg-gradient-to-br from-gray-100 to-gray-50',
    };

    return (
        <section
            className={cn(
                'w-full py-16 md:py-20',
                bgColors[background],
                className
            )}
            {...props}
        >
            {children}
        </section>
    );
}

interface SectionHeaderProps {
    title: string;
    description?: string;
    className?: string;
    titleClassName?: string;
    descriptionClassName?: string;
    align?: 'left' | 'center' | 'right';
    textColor?: 'dark' | 'light';
}

export function SectionHeader({
    title,
    description,
    className,
    titleClassName,
    descriptionClassName,
    align = 'center',
    textColor = 'dark'
}: SectionHeaderProps) {
    return (
        <AnimateIn animation="fade-in" className={cn('mb-12', className)}>
            <div className={cn(
                'flex flex-col gap-4',
                align === 'center' && 'items-center text-center',
                align === 'right' && 'items-end text-right',
            )}>
                <h2 className={cn(
                    'text-3xl md:text-4xl font-bold',
                    textColor === 'dark' ? 'text-gray-900' : 'text-white',
                    titleClassName
                )}>
                    {title}
                </h2>
                {description && (
                    <p className={cn(
                        'text-lg max-w-2xl',
                        textColor === 'dark' ? 'text-gray-600' : 'text-gray-200',
                        descriptionClassName
                    )}>
                        {description}
                    </p>
                )}
            </div>
        </AnimateIn>
    );
}
