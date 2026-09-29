import { useEffect } from 'react';

let scriptLoaded = false;

export default function InstagramPost({ url }) {
  useEffect(() => {
    if (scriptLoaded) {
      if (window.instgrm) window.instgrm.Embeds.process();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      if (window.instgrm) window.instgrm.Embeds.process();
    };
    document.body.appendChild(script);
  }, [url]);

  return (
    <div>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
      />
    </div>
  );
}