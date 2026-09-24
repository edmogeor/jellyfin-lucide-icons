"""Build a Material Icons-compatible font with exact Lucide SVG glyphs."""

import json
import re
from pathlib import Path

from fontTools.ttLib import TTFont, newTable

ROOT = Path(__file__).parents[1]
MATERIAL_CSS = ROOT / "node_modules/material-design-icons-iconfont/dist/material-design-icons.css"
MATERIAL_FONT = ROOT / "node_modules/material-design-icons-iconfont/dist/fonts/MaterialIcons-Regular.ttf"
LUCIDE_ICONS = ROOT / "node_modules/lucide-static/icons"
MAPPINGS = ROOT / "dist/material-to-lucide.json"
OUTPUT = ROOT / "dist/jellyfin-lucide-icons.woff2"


def material_codepoints():
    css = MATERIAL_CSS.read_text()
    return {
        name: int(codepoint, 16)
        for name, codepoint in re.findall(
            r"\.material-icons\.([a-z0-9_]+):before\s*\{\s*content:\s*\"\\([a-f0-9]+)\"",
            css,
        )
    }


def main():
    mappings = json.loads(MAPPINGS.read_text())
    codepoints = material_codepoints()
    font = TTFont(MATERIAL_FONT)
    cmap = font.getBestCmap()
    glyph_order = font.getGlyphOrder()
    documents = []

    for material, lucide in mappings.items():
        codepoint = codepoints.get(material)
        glyph_name = cmap.get(codepoint) if codepoint else None
        icon = LUCIDE_ICONS / f"{lucide}.svg"
        if glyph_name is None or not icon.exists():
            continue
        glyph_id = glyph_order.index(glyph_name)
        # The source SVG is retained verbatim inside the OpenType-SVG glyph.
        documents.append((icon.read_text().encode(), glyph_id, glyph_id))

    svg_table = newTable("SVG ")
    svg_table.docList = documents
    font["SVG "] = svg_table
    font.flavor = "woff2"
    font.save(OUTPUT)
    print(f"Generated {OUTPUT.name} with {len(documents)} exact Lucide SVG glyphs.")


if __name__ == "__main__":
    main()
