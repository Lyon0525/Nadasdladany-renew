import { Helmet } from 'react-helmet-async';

interface Props {
    title: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
}

export const Seo = ({ title, description, image, type = 'website', url }: Props) => {
    const siteTitle = "Nádasdladány Község";
    const fullTitle = `${title} | ${siteTitle}`;
    const defaultDesc = "Nádasdladány hivatalos honlapja.";
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || defaultDesc} />

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description || defaultDesc} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            {image && <meta property="og:image" content={image} />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description || defaultDesc} />
            {image && <meta name="twitter:image" content={image} />}
        </Helmet>
    );
};