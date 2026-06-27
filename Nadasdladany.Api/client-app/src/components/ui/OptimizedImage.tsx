import { useState } from 'react';
import { getImageUrl } from '../../lib/imageUtils';
import { cn } from '../../lib/utils';

interface Props extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
    src?: string | null;
    alt: string;
    isHero?: boolean;
    fallbackSrc?: string;
}

export const OptimizedImage = ({
    src,
    alt,
    isHero = false,
    fallbackSrc = '/Nadasdladany-hero-banner.jpg',
    className,
    ...props
}: Props) => {
    const [hasError, setHasError] = useState(false);

    const finalSrc = hasError ? fallbackSrc : getImageUrl(src);

    return (
        <img
            src={finalSrc}
            alt={alt}
            loading={isHero ? "eager" : "lazy"}
            decoding={isHero ? "sync" : "async"}
            fetchPriority={isHero ? "high" : "auto"}
            onError={() => setHasError(true)}
            className={cn("object-cover", className)}
            {...props}
        />
    );
};