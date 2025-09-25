/**
* MeshCentral noVNC launcher plugin
* Adds a configurable button to the device view that opens a noVNC session with additional parameters.
*/

module.exports.novnclauncher = function (pluginHandler) {
    const obj = {};
    obj.parent = pluginHandler.parent;
    obj.exports = ['onWebUIStartupEnd', 'onDeviceRefreshEnd', 'launchCustomNoVnc'];

    const fs = pluginHandler.fs || require('fs');
    const path = pluginHandler.path || require('path');

    const defaults = {
        buttonLabel: 'Custom Web-VNC',
        buttonTooltip: 'Launch a noVNC session with custom parameters',
        appendDefaultName: true,
        hideDefaultWebVncLink: false,
        windowNamePrefix: 'novnclauncher',
        queryString: '',
        queryParameters: { autoconnect: 'true' },
        copyContextMenuFromWebVnc: true
    };

    let configSettings = {};
    try {
        const raw = fs.readFileSync(path.join(__dirname, 'config.json'));
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.settings === 'object') {
            configSettings = parsed.settings;
        }
    } catch (err) {
        if (pluginHandler.parent && typeof pluginHandler.parent.debug === 'function') {
            pluginHandler.parent.debug(1, 'noVNC launcher plugin: unable to read config.json (' + err + ')');
        } else {
            console.log('noVNC launcher plugin: unable to read config.json (' + err + ')');
        }
    }

    const mergedSettings = Object.assign({}, defaults, configSettings || {});

    if ((mergedSettings.queryParameters == null) || (typeof mergedSettings.queryParameters !== 'object') || Array.isArray(mergedSettings.queryParameters)) {
        mergedSettings.queryParameters = {};
    }
    if (typeof mergedSettings.queryString !== 'string') {
        mergedSettings.queryString = '';
    }
    if (typeof mergedSettings.buttonLabel !== 'string' || mergedSettings.buttonLabel.trim().length === 0) {
        mergedSettings.buttonLabel = defaults.buttonLabel;
    }
    if (typeof mergedSettings.buttonTooltip !== 'string' || mergedSettings.buttonTooltip.trim().length === 0) {
        mergedSettings.buttonTooltip = defaults.buttonTooltip;
    }
    if (typeof mergedSettings.windowNamePrefix !== 'string' || mergedSettings.windowNamePrefix.trim().length === 0) {
        mergedSettings.windowNamePrefix = defaults.windowNamePrefix;
    }
    mergedSettings.appendDefaultName = (mergedSettings.appendDefaultName !== false);
    mergedSettings.copyContextMenuFromWebVnc = (mergedSettings.copyContextMenuFromWebVnc !== false);

    const clientSettings = {
        buttonLabel: mergedSettings.buttonLabel,
        buttonTooltip: mergedSettings.buttonTooltip,
        appendDefaultName: mergedSettings.appendDefaultName,
        hideDefaultWebVncLink: mergedSettings.hideDefaultWebVncLink === true,
        windowNamePrefix: mergedSettings.windowNamePrefix,
        queryString: mergedSettings.queryString,
        queryParameters: mergedSettings.queryParameters,
        copyContextMenuFromWebVnc: mergedSettings.copyContextMenuFromWebVnc
    };

    const settingsLiteral = JSON.stringify(clientSettings).replace(/\\/g, '\\\\').replace(/`/g, '\\`');

    obj.onWebUIStartupEnd = new Function(`
        var settings = ${settingsLiteral};
        if (pluginHandler && pluginHandler.novnclauncher) {
            pluginHandler.novnclauncher._clientSettings = settings;
            if (typeof pluginHandler.novnclauncher._pendingNovnc === 'undefined') {
                pluginHandler.novnclauncher._pendingNovnc = null;
            }
        }
        if (!window.meshserver || window.meshserver._novnclauncherWrapped) { return; }
        var originalOnMessage = window.meshserver.onMessage;
        window.meshserver._novnclauncherWrapped = true;
        window.meshserver.onMessage = function(server, message) {
            if (message && message.action === 'getcookie' && message.tag === 'novnc') {
                var pending = (pluginHandler && pluginHandler.novnclauncher) ? pluginHandler.novnclauncher._pendingNovnc : null;
                if (pending) {
                    pluginHandler.novnclauncher._pendingNovnc = null;
                    try {
                        var vncurl = window.location.origin + domainUrl + 'novnc/vnc.html?ws=wss%3A%2F%2F' + window.location.host + encodeURIComponentEx(domainUrl) + (message.localRelay ? 'local' : 'mesh') + 'relay.ashx%3Fauth%3D' + message.cookie + '&show_dot=1' + (urlargs.key ? ('&key=' + urlargs.key) : '') + '&l={{{lang}}}';
                        if (settings.appendDefaultName !== false) {
                            var node = getNodeFromId(message.nodeid);
                            if (node != null && node.name != null) { vncurl += '&name=' + encodeURIComponentEx(node.name); }
                        }
                        if (pending.extraQuery) { vncurl += pending.extraQuery; }
                        var targetWindow = pending.windowName || ('mcnovnc/' + message.nodeid);
                        safeNewWindow(vncurl, targetWindow);
                    } catch (novncErr) {
                        console.error('noVNC launcher plugin could not open window', novncErr);
                    }
                    return;
                }
            }
            return originalOnMessage.apply(this, arguments);
        };
    `);

    obj.onDeviceRefreshEnd = new Function('nodeid', 'panel', 'refresh', 'event', `
        var settings = ${settingsLiteral};
        try {
            var wrapperId = 'novnclauncher-link-wrapper';
            var existingWrapper = document.getElementById(wrapperId);
            if (existingWrapper && existingWrapper.parentNode) { existingWrapper.parentNode.removeChild(existingWrapper); }
            var anchor = Q('rfbLink');
            if (!anchor) { return; }
            if (settings.hideDefaultWebVncLink === true) {
                anchor.style.display = 'none';
            } else {
                anchor.style.display = '';
            }
            var container = anchor.parentNode || Q('p10html3left');
            if (!container) { return; }
            var link = document.createElement('a');
            link.id = 'novnclauncher-link';
            link.href = '#';
            link.textContent = settings.buttonLabel || anchor.textContent || 'Web-VNC';
            if (settings.buttonTooltip) { link.title = settings.buttonTooltip; }
            if (settings.copyContextMenuFromWebVnc && anchor.getAttribute) {
                var cmenuAttr = anchor.getAttribute('cmenu');
                if (cmenuAttr) { link.setAttribute('cmenu', cmenuAttr); }
            }
            link.onclick = function(ev) {
                if (ev) { ev.preventDefault(); }
                if (pluginHandler && pluginHandler.novnclauncher && typeof pluginHandler.novnclauncher.launchCustomNoVnc === 'function') {
                    pluginHandler.novnclauncher.launchCustomNoVnc(nodeid);
                }
                return false;
            };
            var wrapper = document.createElement('span');
            wrapper.id = wrapperId;
            wrapper.style.marginLeft = '6px';
            wrapper.appendChild(link);
            container.appendChild(wrapper);
        } catch (ex) {
            console.error('noVNC launcher plugin could not render button', ex);
        }
    `);

    obj.launchCustomNoVnc = new Function('nodeid', `
        var settings = ${settingsLiteral};
        try {
            var node = getNodeFromId(nodeid);
            if (!node || !window.meshserver) { return false; }
            var mesh = (typeof meshes !== 'undefined') ? meshes[node.meshid] : null;
            var port = (node.rfbport != null) ? node.rfbport : 5900;
            var addr = null;
            var requestNodeId = nodeid;
            if (node.mtype == 3 && mesh && mesh.relayid) { requestNodeId = mesh.relayid; addr = node.host; }
            function applyTemplate(value) {
                if (value == null) { return value; }
                if (typeof value !== 'string') { return value; }
                return value.replace(/\\{\\{([^}]+)\\}\\}/g, function(_m, token) {
                    token = token.trim().toLowerCase();
                    if (token === 'nodeid') { return node._id || ''; }
                    if (token === 'name') { return node.name || ''; }
                    if (token === 'hostname' || token === 'host') { return node.host || ''; }
                    if (token === 'meshid') { return node.meshid || ''; }
                    if (token === 'meshname' || token === 'group') { return (mesh && mesh.name) ? mesh.name : ''; }
                    if (token === 'domainid') { return (mesh && mesh.domain) ? mesh.domain : ''; }
                    var direct = node[token];
                    if (direct === undefined || direct === null) { return ''; }
                    if (typeof direct === 'object') { try { return JSON.stringify(direct); } catch (e) { return ''; } }
                    return '' + direct;
                });
            }
            function normalize(val) {
                if (val === null || val === undefined) { return null; }
                if (typeof val === 'boolean') { return val ? '1' : '0'; }
                if (typeof val === 'number') { return '' + val; }
                if (typeof val === 'string') { return applyTemplate(val); }
                if (Array.isArray(val)) { return val.map(function(v) { return applyTemplate('' + v); }).join(','); }
                if (typeof val === 'object') { return applyTemplate(JSON.stringify(val)); }
                return applyTemplate('' + val);
            }
            var querySuffix = '';
            if (typeof settings.queryString === 'string' && settings.queryString.length > 0) {
                querySuffix += (settings.queryString.charAt(0) === '&' ? settings.queryString : '&' + settings.queryString);
            }
            if (settings.queryParameters && typeof settings.queryParameters === 'object') {
                var parts = [];
                for (var key in settings.queryParameters) {
                    if (!Object.prototype.hasOwnProperty.call(settings.queryParameters, key)) { continue; }
                    var value = normalize(settings.queryParameters[key]);
                    if (value === null || value === undefined || value === '') { continue; }
                    parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
                }
                if (parts.length > 0) {
                    querySuffix += '&' + parts.join('&');
                }
            }
            if (pluginHandler && pluginHandler.novnclauncher) {
                pluginHandler.novnclauncher._pendingNovnc = {
                    nodeid: nodeid,
                    extraQuery: querySuffix,
                    windowName: (settings.windowNamePrefix || 'novnclauncher') + '/' + nodeid
                };
            }
            window.meshserver.send({ action: 'getcookie', nodeid: requestNodeId, tcpport: port, tcpaddr: addr, tag: 'novnc', name: mesh ? mesh.name : null });
        } catch (ex) {
            console.error('noVNC launcher plugin failed to start session', ex);
        }
        return false;
    `);

    return obj;
};
