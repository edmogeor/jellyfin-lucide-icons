import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const sourceRoot = process.env.JELLYFIN_WEB_SOURCE ?? join(root, 'reference/jellyfin-web/src');
const stringsRoot = join(root, 'reference/jellyfin-web-v12/src/strings');
const iconRoot = join(root, 'node_modules/lucide-static/icons');
const outputRoot = process.env.OUTPUT_ROOT ?? join(root, 'dist');
const indexFile = process.env.INDEX_FILE ?? join(root, 'ICON_INDEX.md');

const mappings = {
    account_circle: 'circle-user-round', add: 'plus', add_circle: 'circle-plus', album: 'disc-3', animate: 'rotate-cw', animation: 'sparkles', article: 'file-text',
    arrow_back: 'arrow-left', arrow_downward: 'arrow-down', arrow_forward: 'arrow-right', arrow_upward: 'arrow-up',
    audiotrack: 'audio-lines', auto_awesome: 'wand-sparkles', autorenew: 'refresh-cw', backspace: 'delete', block: 'ban', bookmark: 'bookmark', book: 'book-open', brightness_high: 'sun',
    call_merge: 'merge', call_split: 'split', cancel: 'circle-x', cast: 'cast', check: 'check', check_box: 'square-check',
    check_box_outline_blank: 'square', chevron_left: 'chevron-left', chevron_right: 'chevron-right',
    clear: 'x', clear_all: 'list-x', close: 'x', closed_caption: 'captions', content_copy: 'copy',
    dashboard: 'layout-dashboard', delete: 'trash-2', devices_other: 'monitor-smartphone', domino_mask: 'venetian-mask', drag_handle: 'grip-vertical', dvr: 'tv',
    edit: 'pencil', error: 'circle-alert', exit_to_app: 'log-out', expand_less: 'chevron-up', expand_more: 'chevron-down',
    event_busy: 'calendar-x', explore: 'compass', family_restroom: 'users-round', fast_rewind: 'rewind', favorite: 'heart', fiber_smart_record: 'radio', file_download: 'download',
    filter_alt: 'funnel', folder: 'folder', fullscreen: 'maximize', fullscreen_exit: 'minimize', forward_30: 'forward', get_app: 'download', groups: 'users',
    home: 'house', image: 'image', info: 'info', info_outline: 'circle-help', keyboard: 'keyboard',
    keyboard_arrow_down: 'chevron-down', keyboard_arrow_left: 'chevron-left', keyboard_arrow_right: 'chevron-right', keyboard_arrow_up: 'chevron-up', keyboard_return: 'corner-down-left',
    library_add_check: 'list-checks', link: 'link', live_tv: 'tv', local_movies: 'clapperboard', lock: 'lock',
    lyrics: 'music', meeting_room: 'door-open', menu: 'menu', mode_edit: 'pencil', more_horiz: 'ellipsis',
    more_vert: 'ellipsis-vertical', movie: 'clapperboard', music_note: 'music', navigate_before: 'chevron-left',
    navigate_next: 'chevron-right', pause: 'pause', pause_circle_filled: 'circle-pause', person: 'user',
    phonelink_lock: 'smartphone', photo: 'image', play_arrow: 'play', play_circle_filled: 'circle-play',
    history_edu: 'landmark', landscape: 'mountain', local_police: 'shield', menu_book: 'book-open', military_tech: 'shield', mood: 'smile', music_video: 'clapperboard', picture_in_picture_alt: 'picture-in-picture', place: 'map-pin', playlist_add: 'list-plus', playlist_remove: 'list-minus', preview: 'eye', psychology: 'brain', queue_music: 'list-music', radio: 'radio', refresh: 'refresh-cw',
    remove: 'minus', remove_circle: 'circle-minus', remove_circle_outline: 'circle-minus', remove_red_eye: 'eye', repeat_one: 'repeat-1', replay: 'rotate-ccw', replay_10: 'rewind', save: 'save', search: 'search',
    select_all: 'list-checks', settings: 'settings', shuffle: 'shuffle', skull: 'skull', skip_next: 'skip-forward', skip_previous: 'skip-back', sort: 'arrow-down-up', sports_martial_arts: 'dumbbell', sports_soccer: 'goal',
    sort_by_alpha: 'arrow-down-a-z', space_bar: 'space', star: 'star', star_border: 'star', storage: 'hard-drive', theaters: 'clapperboard',
    stop: 'square', subtitles: 'captions', sync: 'refresh-cw', text_decrease: 'text-cursor-input',
    text_increase: 'text-cursor-input', toc: 'list', tv: 'tv', vertical_align_bottom: 'align-vertical-justify-end',
    theater_comedy: 'drama', vertical_align_top: 'align-vertical-justify-start', venetian_mask: 'venetian-mask', video_settings: 'settings-2', view_comfy: 'grid-3x3',
    volume_down: 'volume-1', volume_mute: 'volume-x', volume_off: 'volume-x', volume_up: 'volume-2', wifi: 'wifi'
};

const muiMappings = {
    AccessTime: 'clock', AccountCircle: 'circle-user-round', Add: 'plus', AddCircle: 'circle-plus', Analytics: 'chart-no-axes-combined', AppSettingsAlt: 'settings-2', ArrowBack: 'arrow-left', ArrowDownward: 'arrow-down', ArrowDropDown: 'chevron-down', ArrowForward: 'arrow-right', ArrowForwardIosSharp: 'chevron-right',
    ArrowUpward: 'arrow-up', Audiotrack: 'audio-lines', Block: 'ban', Bookmark: 'bookmark', Cast: 'cast', Check: 'check',
    Article: 'file-text', Backup: 'hard-drive-download', CallSplit: 'split', CastConnected: 'cast', CheckBox: 'square-check', CheckBoxOutlineBlank: 'square', ChevronLeft: 'chevron-left', ChevronRight: 'chevron-right', Comment: 'message-square', Computer: 'monitor',
    Clear: 'x', Close: 'x', ClosedCaption: 'captions', ContentCopy: 'copy', Dashboard: 'layout-dashboard', Delete: 'trash-2',
    Devices: 'monitor-smartphone', Download: 'download', DownloadDone: 'circle-check', DragHandle: 'grip-vertical', Dvr: 'tv', Edit: 'pencil', Error: 'circle-alert', ExitToApp: 'log-out', ExpandLess: 'chevron-up', ExpandMore: 'chevron-down', Explore: 'compass', Extension: 'puzzle', Favorite: 'heart', FiberManualRecord: 'circle', FiberSmartRecord: 'radio', FileDownload: 'download',
    FilterAlt: 'funnel', Folder: 'folder', Fullscreen: 'maximize', FullscreenExit: 'minimize', GroupAdd: 'user-plus', Groups: 'users', HelpOutline: 'circle-help', Home: 'house',
    Image: 'image', ImageNotSupported: 'image-off', Info: 'info', Keyboard: 'keyboard', Lan: 'network', LibraryAdd: 'list-plus', Link: 'link', LiveTv: 'tv', LocationSearching: 'map-pin', Lock: 'lock', Logout: 'log-out', Memory: 'memory-stick', Menu: 'menu', MoreHoriz: 'ellipsis',
    MoreVert: 'ellipsis-vertical', Movie: 'clapperboard', MusicNote: 'music', MusicVideo: 'clapperboard', NavigateBefore: 'chevron-left', NavigateNext: 'chevron-right', Notifications: 'bell', OpenInNew: 'external-link', Pause: 'pause', PauseCircle: 'circle-pause',
    People: 'users', PermMedia: 'image', Person: 'user', PersonAdd: 'user-plus', PersonOff: 'user-minus', PersonRemove: 'user-minus', PhonelinkLock: 'smartphone', Photo: 'image', PhotoAlbum: 'images', PlayArrow: 'play', PlayCircle: 'circle-play', PlaylistAdd: 'list-plus', PowerSettingsNew: 'power', Queue: 'list-music', Quiz: 'circle-help', Refresh: 'refresh-cw', Remove: 'minus', RemoveCircle: 'circle-minus', Replay: 'rotate-ccw', RestartAlt: 'rotate-cw', Restore: 'history',
    Schedule: 'clock', Search: 'search', Settings: 'settings', SettingsRemote: 'settings-2', Shuffle: 'shuffle', SortByAlpha: 'arrow-down-a-z', Star: 'star', Stop: 'square', StopCircle: 'circle-stop', Storage: 'hard-drive', Subtitles: 'captions',
    Sync: 'refresh-cw', Tablet: 'tablet', Theaters: 'clapperboard', Tune: 'sliders-horizontal', Tv: 'tv', Upload: 'upload', Usb: 'usb', VideoLibrary: 'clapperboard', Videocam: 'video', ViewList: 'list', ViewModule: 'grid-3x3', Visibility: 'eye', VisibilityOff: 'eye-off', VolumeDown: 'volume-1', VolumeMute: 'volume-x', VolumeOff: 'volume-x',
    VolumeUp: 'volume-2', VpnKey: 'key-round', Warning: 'triangle-alert', Wifi: 'wifi'
};

const ignoredClasses = new Set([
    'material-icons', 'aria-hidden', 'cardImageIcon', 'cardOverlayButtonIcon', 'checkboxIcon', 'checkboxIcon-checked',
    'checkboxIcon-unchecked', 'emby-collapse-expandIcon', 'fiber_manual_record', 'indicatorIcon', 'listItemIcon', 'listItemIcon-transparent',
    'listViewDragHandle', 'metadataSidebarIcon', 'navMenuOptionIcon', 'searchfields-icon', 'selectArrow',
    'slideshowButtonIcon', 'timerIndicator', 'xlargePaperIconButton', 'hide', 'icon', 'undefined'
]);

const elegantFinMappings = [
    ['.selectVideoContainer.trackSelectionFieldContainer > label', 'film', 'Video track'],
    ['.selectAudioContainer.trackSelectionFieldContainer > label', 'audio-lines', 'Audio track'],
    ['.selectSubtitlesContainer.trackSelectionFieldContainer > label', 'captions', 'Subtitle track'],
    ['.selectSourceContainer.trackSelectionFieldContainer > label', 'file-video', 'Media source'],
    ['[aria-controls="app-remote-play-menu"]::before', 'cast', 'Remote play', 'currentColor'],
    ['[aria-controls="app-remote-play-active-menu"] .MuiButton-startIcon::before', 'cast', 'Active remote play', 'currentColor'],
    ['#popupPreviewButton::before', 'clapperboard', 'Episode preview']
];

const seerrFinMappings = [
    ['a[href="#/home?seerrfinTab=movies"] .material-icons', 'clapperboard'],
    ['a[href="#/home?seerrfinTab=tv"] .material-icons', 'tv'],
    ['a[href="#/home?seerrfinTab=discover"] .material-icons', 'compass'],
    ['a[href="#/home?seerrfinTab=requests"] .material-icons', 'download'],
    ['a[href="#/home?seerrfinTab=letterboxd"] .material-icons', 'bookmark'],
    ['.seerrfin-discover-requests .material-icons', 'download']
];

const syncPlayMappings = [
    ['button[aria-controls="app-sync-play-menu"] svg[data-testid="GroupsIcon"]', 'user-group']
];

const mediaBarMappings = [
    ['#slides-container .detail-button::before', 'info'],
    ['#slides-container .play-button::before', 'play'],
    ['#slides-container .favorite-button::before', 'heart']
];

const mediaBarMaterialMappings = [
    ['#slides-container .pause-button .material-icons', 'pause'],
    ['#slides-container.slideshow-paused .pause-button .material-icons', 'play'],
    [localizedMuteSelector('Unmute'), 'volume-x'],
    [localizedMuteSelector('Mute'), 'volume-2']
];

const alignmentOverrides = [
    '.cardIndicators .material-icons.check, .cardOverlayButton .material-icons.check'
];

function filesIn(directory) {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? filesIn(path) : path;
    });
}

function localizedMuteSelector(key) {
    const labels = new Set([key]);
    if (existsSync(stringsRoot)) {
        for (const file of readdirSync(stringsRoot).filter((file) => file.endsWith('.json'))) {
            const label = JSON.parse(readFileSync(join(stringsRoot, file), 'utf8'))[key];
            if (label) labels.add(label);
        }
    }
    return [...labels]
        .map((label) => `#slides-container .mute-button[aria-label=${JSON.stringify(label)}] .material-icons`)
        .join(', ');
}

function addIcon(icons, name, file) {
    if (!name || ignoredClasses.has(name) || name.includes('${') || !/^[a-z][a-z0-9_]*$/.test(name)) return;
    const item = icons.get(name) ?? { files: new Set(), occurrences: 0 };
    item.files.add(relative(sourceRoot, file));
    item.occurrences++;
    icons.set(name, item);
}

function audit() {
    const icons = new Map();
    const muiIcons = new Map();
    for (const file of filesIn(sourceRoot).filter((path) => /\.(?:html|js|jsx|ts|tsx)$/.test(path) && !path.endsWith('.test.ts'))) {
        const text = readFileSync(file, 'utf8');
        for (const match of text.matchAll(/(?:class|className)\s*=\s*(["'`])([^"'`]*)\1/g)) {
            const classes = match[2].split(/\s+/);
            if (classes.includes('material-icons')) {
                for (const name of classes) addIcon(icons, name, file);
            }
        }
        for (const match of text.matchAll(/\bicon\s*[:=]\s*['"]([a-z][a-z0-9_]*)['"]/g)) addIcon(icons, match[1], file);
        for (const match of text.matchAll(/from\s+['"]@mui\/icons-material\/([A-Za-z0-9]+)['"]/g)) {
            const name = match[1];
            const item = muiIcons.get(name) ?? { files: new Set(), occurrences: 0 };
            item.files.add(relative(sourceRoot, file));
            item.occurrences++;
            muiIcons.set(name, item);
        }
    }
    return { icons, muiIcons };
}

function svgDataUrl(icon) {
    const svg = readFileSync(join(iconRoot, `${icon}.svg`), 'utf8')
        .replace(/<\?xml[^>]*>\s*/, '')
        .replace(/\s+/g, ' ')
        .trim();
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function kebabCase(name) {
    return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function resolveMaterial(name) {
    const icon = mappings[name] ?? name.replaceAll('_', '-');
    return existsSync(join(iconRoot, `${icon}.svg`)) ? icon : null;
}

function resolveMui(name) {
    const icon = muiMappings[name] ?? kebabCase(name);
    return existsSync(join(iconRoot, `${icon}.svg`)) ? icon : null;
}

function buildCss(auditResult) {
    const header = `/* Generated by tools/generate.mjs. Paste into Jellyfin Dashboard > General > Custom CSS. */\n\n`;
    const materialNames = new Set([...Object.keys(mappings), ...auditResult.icons.keys()]);
    const rules = [...materialNames].sort((a, b) => a.localeCompare(b)).flatMap((material) => {
        const lucide = resolveMaterial(material);
        if (!lucide) return [];
        const selector = `.material-icons.${material}`;
        return `${selector} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  overflow: hidden;\n  font-family: inherit;\n  line-height: 1;\n  text-indent: -9999px;\n  vertical-align: -0.125em;\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / 1em 1em no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / 1em 1em no-repeat !important;\n}\n\n${selector}::before {\n  content: none;\n}`;
    });
    const muiNames = new Set([...Object.keys(muiMappings), ...auditResult.muiIcons.keys()]);
    for (const mui of [...muiNames].sort((a, b) => a.localeCompare(b))) {
        const lucide = resolveMui(mui);
        if (!lucide) continue;
        const selector = `svg[data-testid="${mui}Icon"]`;
        rules.push(`${selector} {\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n}\n\n${selector} > * {\n  display: none;\n}`);
    }
    for (const [selector, lucide] of syncPlayMappings) {
        rules.push(`${selector} {\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n}`);
    }
    for (const [selector, lucide] of seerrFinMappings) {
        rules.push(`${selector} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  overflow: hidden;\n  font-family: inherit;\n  line-height: 1;\n  text-indent: -9999px;\n  vertical-align: -0.125em;\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / 1em 1em no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / 1em 1em no-repeat !important;\n}\n\n${selector}::before {\n  content: none;\n}`);
    }
    for (const [selector, lucide] of mediaBarMappings) {
        rules.push(`${selector} {\n  content: "";\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n}`);
    }
    for (const [selector, lucide] of mediaBarMaterialMappings) {
        rules.push(`${selector} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  overflow: hidden;\n  font-family: inherit;\n  line-height: 1;\n  text-indent: -9999px;\n  vertical-align: -0.125em;\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / 1em 1em no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / 1em 1em no-repeat !important;\n}\n\n${selector}::before {\n  content: none;\n}`);
    }
    rules.push(`${alignmentOverrides.join(',\n')} {\n  -webkit-mask-position: calc(50% - 0.5px) calc(50% + 0.5px) !important;\n  mask-position: calc(50% - 0.5px) calc(50% + 0.5px) !important;\n}`);
    for (const [selector, lucide, , color = '#d1d5db'] of elegantFinMappings) {
        if (!existsSync(join(iconRoot, `${lucide}.svg`))) throw new Error(`Missing Lucide icon: ${lucide}`);
        const pseudo = selector.endsWith('::before');
        rules.push(`${selector} {\n  ${pseudo ? 'content: "";\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  ' : ''}background-image: none !important;\n  background-color: ${color} !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n}`);
    }
    for (const [selector, lucide] of [['.ts-search-icon', 'search'], ['.tab-warning-icon', 'triangle-alert']]) {
        rules.push(`${selector} {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  overflow: hidden;\n  font-size: 0;\n  background-color: currentColor !important;\n  -webkit-mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n  mask: url("${svgDataUrl(lucide)}") center / contain no-repeat !important;\n}`);
    }
    return header + rules.join('\n\n') + '\n';
}

function buildIndex({ icons, muiIcons }) {
    const materialRows = [...icons].sort(([a], [b]) => a.localeCompare(b)).map(([material, usage]) => {
        const lucide = resolveMaterial(material) ?? 'Unmapped';
        return `| \`${material}\` | ${lucide === 'Unmapped' ? lucide : `\`${lucide}\``} | ${usage.occurrences} | ${usage.files.size} |`;
    });
    const muiRows = [...muiIcons].sort(([a], [b]) => a.localeCompare(b)).map(([mui, usage]) => {
        const lucide = resolveMui(mui) ?? 'Unmapped';
        return `| \`${mui}Icon\` | ${lucide === 'Unmapped' ? lucide : `\`${lucide}\``} | ${usage.occurrences} | ${usage.files.size} |`;
    });
    const elegantFinRows = elegantFinMappings.map(([selector, lucide, usage]) => `| ${usage} | \`${lucide}\` | \`${selector}\` |`);
    return `# Jellyfin Web Icon Index\n\nGenerated from \`reference/jellyfin-web/src\` by \`tools/generate.mjs\`. Counts cover statically discoverable legacy Material icon names and MUI icon imports. Dynamic names from third-party plugins cannot be known until they are observed.\n\n## Legacy Material Icons\n\n| Material icon | Lucide alternative | References | Source files |\n| --- | --- | ---: | ---: |\n${materialRows.join('\n')}\n\n## MUI SvgIcon Imports\n\nMUI renders these imports with a stable \`data-testid\` such as \`GroupsIcon\`, which the stylesheet targets without relying on hashed Emotion classes.\n\n| MUI data-testid | Lucide alternative | References | Source files |\n| --- | --- | ---: | ---: |\n${muiRows.join('\n')}\n\n## ElegantFin Overrides\n\nElegantFin draws these with inline SVG backgrounds or the Jellyfin 12 shim's Material-font pseudo-elements, so they are not visible in Jellyfin's DOM icon audit.\n\n| Theme icon | Lucide alternative | CSS selector |\n| --- | --- | --- |\n${elegantFinRows.join('\n')}\n`;
}

if (!existsSync(sourceRoot)) throw new Error('Missing reference/jellyfin-web. Clone Jellyfin Web first.');
if (!existsSync(iconRoot)) throw new Error('Missing lucide-static. Run npm install first.');

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(outputRoot, { recursive: true });
const icons = audit();
writeFileSync(join(outputRoot, 'jellyfin-lucide-icons.css'), buildCss(icons));
writeFileSync(indexFile, buildIndex(icons));
writeFileSync(join(outputRoot, 'material-to-lucide.json'), JSON.stringify(Object.fromEntries(
    [...new Set([...Object.keys(mappings), ...icons.icons.keys()])]
        .map((material) => [material, resolveMaterial(material)])
        .filter(([, lucide]) => lucide)
), null, 2) + '\n');
console.log(`Generated ${Object.keys(mappings).length + Object.keys(muiMappings).length} CSS mappings and indexed ${icons.icons.size} Material and ${icons.muiIcons.size} MUI icon names.`);
