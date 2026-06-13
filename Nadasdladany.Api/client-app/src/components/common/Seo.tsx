import { Helmet } from 'react-helmet-async';

interface Props {
    title: string;
    description?: string;
    image?: string;
}

export const Seo = ({ title, description, image }: Props) => {
    const siteTitle = "Nádasdladány Község";
    const fullTitle = `${title} | ${siteTitle}`;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description || "Nádasdladány hivatalos honlapja."} />

            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
        </Helmet>
    );
};