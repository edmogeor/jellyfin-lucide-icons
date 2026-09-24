# Jellyfin Lucide Icons

Use Lucide icons in Jellyfin without JavaScript. This stylesheet replaces supported Material icons with Lucide SVG masks.

## Install

Add this to Jellyfin custom CSS:

```css
@import url("https://cdn.jsdelivr.net/gh/edmogeor/jellyfin-lucide-icons@main/dist/jellyfin-lucide-icons.css");
```

Open **Dashboard > General > Branding > Custom CSS**, paste the import, and save. In each user's display settings, leave **Disable custom CSS** off.

Put this import after your theme imports, but before normal CSS rules.

## Supported Targets

- Jellyfin Web current upstream and 12.1
- ElegantFin
- ElegantFin for Jellyfin 12
- Jellyfin Enhanced
- Intro Skipper
- SeerrFin
- Media Bar Enhanced

The stylesheet covers normal Material icon classes, MUI SVG icons, and known theme or plugin icon selectors. Unknown icons keep their original appearance.

## Limits

This is CSS only. It cannot select an icon by its text content. Plugins need a class, attribute, pseudo-element, or other stable selector for an exact replacement.

## Credits

Icons by [Lucide](https://lucide.dev). See [NOTICE](NOTICE).

## Support

<a href="https://www.buymeacoffee.com/edmogeor" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important; width: 217px !important;"></a>
