/**
* MeshCentral wdVncPlugin
* Adds a configurable button to the device view that opens a noVNC session with additional parameters.
*/

module.exports.wdVncPlugin = function (pluginHandler) {
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
        windowNamePrefix: 'wdvncplugin',
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
            pluginHandler.parent.debug(1, 'wdVncPlugin: unable to read config.json (' + err + ')');
        } else {
            console.log('wdVncPlugin: unable to read config.json (' + err + ')');
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

    // NOTE: MeshCentral serializes these handler functions and injects them into the
    // browser. They must therefore be defined from string sources (using template
    // literals so that the computed client settings can be embedded directly into the
    // emitted script) rather than by referencing local closures.
    obj.onWebUIStartupEnd = new Function(`
        var settings = ${settingsLiteral};
        if (pluginHandler && pluginHandler.wdVncPlugin) {
            pluginHandler.wdVncPlugin._clientSettings = settings;
            if (typeof pluginHandler.wdVncPlugin._pendingNovnc === 'undefined') {
                pluginHandler.wdVncPlugin._pendingNovnc = null;
            }
        }
        if (!window.meshserver || window.meshserver._wdVncPluginWrapped) { return; }
        var originalOnMessage = window.meshserver.onMessage;
        window.meshserver._wdVncPluginWrapped = true;
        window.meshserver.onMessage = function(server, message) {
            if (message && message.action === 'plugin' && message.plugin === 'wdVncPlugin' && message.method === 'passwordResponse') {
                var pending = (pluginHandler && pluginHandler.wdVncPlugin) ? pluginHandler.wdVncPlugin._pendingNovnc : null;
                if (pending && pending.requestId && pending.requestId === message.requestId) {
                    try {
                        pending.password = (typeof message.password === 'string') ? atob(message.password) : '';
                    } catch (decodeErr) {
                        pending.password = (typeof message.password === 'string') ? message.password : '';
                    }
                    pending.passwordReady = true;
                    if (pluginHandler && pluginHandler.wdVncPlugin && pluginHandler.wdVncPlugin._passwordTimer) {
                        clearTimeout(pluginHandler.wdVncPlugin._passwordTimer);
                        pluginHandler.wdVncPlugin._passwordTimer = null;
                    }
                    try {
                        window.meshserver.send({ action: 'getcookie', nodeid: pending.requestNodeId || pending.nodeid, tcpport: pending.port, tcpaddr: pending.addr, tag: 'novnc', name: pending.meshName || null });
                    } catch (sendErr) {
                        console.error('wdVncPlugin could not request cookie', sendErr);
                    }
                }
                return;
            }
            if (message && message.action === 'getcookie' && message.tag === 'novnc') {
                var pending = (pluginHandler && pluginHandler.wdVncPlugin) ? pluginHandler.wdVncPlugin._pendingNovnc : null;
                if (pending) {
                    if (pluginHandler && pluginHandler.wdVncPlugin && pluginHandler.wdVncPlugin._passwordTimer) {
                        clearTimeout(pluginHandler.wdVncPlugin._passwordTimer);
                        pluginHandler.wdVncPlugin._passwordTimer = null;
                    }
                    pluginHandler.wdVncPlugin._pendingNovnc = null;
                    try {
                        var vncurl = window.location.origin + domainUrl + 'novnc/vnc.html?ws=wss%3A%2F%2F' + window.location.host + encodeURIComponentEx(domainUrl) + (message.localRelay ? 'local' : 'mesh') + 'relay.ashx%3Fauth%3D' + message.cookie + '&show_dot=1' + (urlargs.key ? ('&key=' + urlargs.key) : '') + '&l={{{lang}}}';
                        if (settings.appendDefaultName !== false) {
                            var node = getNodeFromId(message.nodeid);
                            if (node != null && node.name != null) { vncurl += '&name=' + encodeURIComponentEx(node.name); }
                        }
                        if (pending.extraQuery) { vncurl += pending.extraQuery; }
                        if (pending.passwordReady && typeof pending.password === 'string' && pending.password.length > 0) {
                            vncurl += '&password=' + encodeURIComponent(pending.password);
                        }
                        var targetWindow = pending.windowName || ('mcnovnc/' + message.nodeid);
                        safeNewWindow(vncurl, targetWindow);
                    } catch (novncErr) {
                        console.error('wdVncPlugin could not open window', novncErr);
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
            var wrapperId = 'wdvncplugin-link-wrapper';
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
            link.id = 'wdvncplugin-link';
            link.href = '#';
            link.textContent = settings.buttonLabel || anchor.textContent || 'Web-VNC';
            if (settings.buttonTooltip) { link.title = settings.buttonTooltip; }
            if (settings.copyContextMenuFromWebVnc && anchor.getAttribute) {
                var cmenuAttr = anchor.getAttribute('cmenu');
                if (cmenuAttr) { link.setAttribute('cmenu', cmenuAttr); }
            }
            link.onclick = function(ev) {
                if (ev) { ev.preventDefault(); }
                if (pluginHandler && pluginHandler.wdVncPlugin && typeof pluginHandler.wdVncPlugin.launchCustomNoVnc === 'function') {
                    pluginHandler.wdVncPlugin.launchCustomNoVnc(nodeid);
                }
                return false;
            };
            var wrapper = document.createElement('span');
            wrapper.id = wrapperId;
            wrapper.style.marginLeft = '6px';
            wrapper.appendChild(link);
            container.appendChild(wrapper);
        } catch (ex) {
            console.error('wdVncPlugin could not render button', ex);
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
            if (pluginHandler && pluginHandler.wdVncPlugin) {
                var requestId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                pluginHandler.wdVncPlugin._pendingNovnc = {
                    nodeid: nodeid,
                    requestNodeId: requestNodeId,
                    extraQuery: querySuffix,
                    windowName: (settings.windowNamePrefix || 'wdvncplugin') + '/' + nodeid,
                    port: port,
                    addr: addr,
                    meshName: mesh ? mesh.name : null,
                    requestId: requestId,
                    passwordReady: false
                };
                if (pluginHandler.wdVncPlugin._passwordTimer) {
                    clearTimeout(pluginHandler.wdVncPlugin._passwordTimer);
                    pluginHandler.wdVncPlugin._passwordTimer = null;
                }
                pluginHandler.wdVncPlugin._passwordTimer = setTimeout(function() {
                    if (!pluginHandler || !pluginHandler.wdVncPlugin) { return; }
                    var pending = pluginHandler.wdVncPlugin._pendingNovnc;
                    if (!pending || pending.requestId !== requestId || pending.passwordReady) { return; }
                    try {
                        window.meshserver.send({ action: 'getcookie', nodeid: pending.requestNodeId || pending.nodeid, tcpport: pending.port, tcpaddr: pending.addr, tag: 'novnc', name: pending.meshName || null });
                    } catch (timeoutErr) {
                        console.error('wdVncPlugin timeout requesting cookie', timeoutErr);
                    }
                }, 5000);
                window.meshserver.send({ action: 'plugin', plugin: 'wdVncPlugin', method: 'requestPassword', nodeid: nodeid, requestId: requestId });
            } else {
                window.meshserver.send({ action: 'getcookie', nodeid: requestNodeId, tcpport: port, tcpaddr: addr, tag: 'novnc', name: mesh ? mesh.name : null });
            }
        } catch (ex) {
            console.error('wdVncPlugin failed to start session', ex);
        }
        return false;
    `);

    obj.serveraction = function (command, wsobj) {
        try {
            if (!command || command.method !== 'requestPassword') { return; }
            if (typeof command.nodeid !== 'string') { return; }
            var password = 'password';
            var encoded = Buffer.from(password, 'utf8').toString('base64');
            var response = {
                action: 'plugin',
                plugin: 'wdVncPlugin',
                method: 'passwordResponse',
                nodeid: command.nodeid,
                requestId: command.requestId || null,
                password: encoded
            };
            wsobj.send(response);
        } catch (err) {
            if (pluginHandler.parent && typeof pluginHandler.parent.debug === 'function') {
                pluginHandler.parent.debug(1, 'wdVncPlugin: password request failed (' + err + ')');
            } else {
                console.error('wdVncPlugin: password request failed', err);
            }
        }
    };

    return obj;
};
