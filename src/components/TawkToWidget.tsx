import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

declare global {
    interface Window {
        Tawk_API?: {
            hideWidget?: () => void;
            showWidget?: () => void;
            onLoad?: () => void;
        };
        Tawk_LoadStart?: Date;
    }
}

export function TawkToWidget() {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        // Only load Tawk.to for authenticated users
        if (!isAuthenticated) {
            // Hide widget if it exists
            if (window.Tawk_API?.hideWidget) {
                window.Tawk_API.hideWidget();
            }
            return;
        }

        // Check if script already loaded
        if (document.getElementById('tawkto-script')) {
            // Show widget if user is now authenticated
            if (window.Tawk_API?.showWidget) {
                window.Tawk_API.showWidget();
            }
            return;
        }

        // Load Tawk.to script for authenticated users
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const script = document.createElement('script');
        script.id = 'tawkto-script';
        script.async = true;
        script.src = 'https://embed.tawk.to/6968903860e4ba197ef3bfa5/1jf076oa6';
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        document.body.appendChild(script);

        return () => {
            // Hide widget on unmount or when user logs out
            if (window.Tawk_API?.hideWidget) {
                window.Tawk_API.hideWidget();
            }
        };
    }, [isAuthenticated]);

    return null; // This component doesn't render anything visible
}
