
'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimateInProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in';
    delay?: number;
    threshold?: number;
}

export function AnimateIn({
    children,
    className,
    animation = 'fade-in',
    delay = 0,
    threshold = 0.1,
}: AnimateInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [threshold]);

    const getAnimationClass = () => {
        switch (animation) {
            case 'slide-up': return 'animate-slide-up';
            case 'slide-down': return 'animate-slide-down';
            case 'scale-in': return 'animate-scale-in';
            default: return 'animate-fade-in';
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                isVisible ? getAnimationClass() : 'opacity-0',
                className
            )}
            style={{ animationDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
}
