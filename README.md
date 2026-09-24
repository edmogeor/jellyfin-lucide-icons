# Jellyfin Lucide Icons

`dist/jellyfin-lucide-icons.css` replaces Jellyfin Web's mapped Material Icons with an embedded Lucide compatibility font. Paste its contents into **Dashboard, General, Custom CSS**, then refresh every Jellyfin client.

The compatibility font preserves Material's code points and ligatures, so it also applies to dynamically inserted icon text from third-party Web plugins. Icons without a mapping keep their original Material glyph.

When using ElegantFin, put its `@import` before this generated stylesheet. The generated rules also replace ElegantFin's media-track glyphs and the Jellyfin 12 shim's remote-play and episode-preview pseudo-icons.

## Compatibility

Verified against Jellyfin Web `v12.1` and the current upstream snapshot. It does not depend on a Jellyfin API, only on the `.material-icons.<name>` markup Jellyfin Web uses. Future major releases remain compatible while they retain that markup; regenerate and review `ICON_INDEX.md` when upgrading past the audited version.

## Generate

```sh
npm install
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
git clone --depth 1 https://github.com/jellyfin/jellyfin-web.git reference/jellyfin-web
npm run generate
npm run check
```

Run `npm run update-references` to fast-forward the moving upstream source snapshots and regenerate the artifacts. `reference/jellyfin-web-v12` is deliberately pinned to the `v12.1` release tag for compatibility verification.

`reference/jellyfin-web` is intentionally ignored. It is the audited upstream source snapshot. The generated `ICON_INDEX.md` records every statically discoverable icon reference and its Lucide mapping.

`reference/elegantfin`, `reference/elegantfin-jf12`, `reference/jellyfin-enhanced`, `reference/intro-skipper`, and `reference/seerrfin` are ignored audit inputs. GitHub Actions clones them only while refreshing generated artifacts.

## Limits

Jellyfin's supported server-plugin API can add configuration pages, but cannot globally load a stylesheet or script into Jellyfin Web. Custom CSS is the supported global injection point, so this project does not include a server plugin that would only affect its own settings page.

The CSS maps known Material class names. A third-party plugin using an unknown icon continues using its original Material icon until that name is added to `tools/generate.mjs`.
