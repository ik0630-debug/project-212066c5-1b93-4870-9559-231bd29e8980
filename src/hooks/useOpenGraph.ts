import { useEffect } from 'react';

interface OpenGraphData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const useOpenGraph = (data: OpenGraphData) => {
  useEffect(() => {
    // Update document title
    if (data.title) {
      document.title = data.title;
    }

    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let metaTag = document.querySelector(`meta[property="${property}"]`);
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('property', property);
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
    };

    // Update Open Graph tags
    if (data.title) {
      updateMetaTag('og:title', data.title);
      updateMetaTag('twitter:title', data.title);
    }

    if (data.description) {
      updateMetaTag('og:description', data.description);
      updateMetaTag('twitter:description', data.description);
      
      // Also update regular meta description
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', data.description);
    }

    if (data.image) {
      updateMetaTag('og:image', data.image);
      updateMetaTag('twitter:image', data.image);
      updateMetaTag('twitter:card', 'summary_large_image');
    }

    if (data.url) {
      updateMetaTag('og:url', data.url);
    }

    // Set og:type
    updateMetaTag('og:type', 'website');
  }, [data.title, data.description, data.image, data.url]);
};
