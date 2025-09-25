# noVNC Launcher Button Plugin

This plugin adds a configurable noVNC launch button to the MeshCentral device view. The button mirrors the existing `Web-VNC` link but allows additional query parameters to be appended to the generated `novnc/vnc.html` URL. This makes it possible to pre-configure features such as automatic connection, view-only mode, or other options supported by noVNC.

## Installation

1. Enable plugins in your `meshcentral-data/config.json` if they are not already enabled:
   ```json
   {
     "plugins": {
       "enabled": true,
       "list": ["novnclauncher"]
     }
   }
   ```
   Alternatively you can upload the plugin bundle through **My Server → Plugins → Download Plugin**.
2. Copy the `plugins/novnclauncher` directory into `meshcentral-data/plugins/novnclauncher`.
3. Restart MeshCentral or refresh the plugin handler from the UI.
4. Enable the *noVNC Launcher Button* plugin from the **My Server → Plugins** page.

## Configuration

The plugin reads its settings from `config.json`. The default configuration is:

```json
{
  "settings": {
    "buttonLabel": "Custom Web-VNC",
    "buttonTooltip": "Launch a noVNC session with custom parameters",
    "appendDefaultName": true,
    "hideDefaultWebVncLink": false,
    "windowNamePrefix": "customnovnc",
    "queryString": "",
    "queryParameters": {
      "autoconnect": "true"
    }
  }
}
```

* **buttonLabel** – Text shown for the new button.
* **buttonTooltip** – Tooltip shown on hover.
* **appendDefaultName** – When `true` the remote device name is added to the URL (same behaviour as the built-in link).
* **hideDefaultWebVncLink** – When `true` the original `Web-VNC` link is hidden once the plugin button is rendered.
* **windowNamePrefix** – Prefix for the browser window/tab name used for the custom session.
* **queryString** – A raw string appended to the URL. If it does not start with `&` one is added automatically.
* **queryParameters** – Key/value pairs converted into query parameters. Values support the placeholders `{{nodeid}}`, `{{name}}`, `{{host}}`, `{{meshid}}`, `{{meshname}}`, and `{{domainid}}`.

### Example: enable view-only mode and provide a custom title

```json
{
  "settings": {
    "buttonLabel": "Web-VNC (View Only)",
    "queryParameters": {
      "view_only": "1",
      "title": "{{meshname}} - {{name}}"
    }
  }
}
```

## Usage

After enabling the plugin, open any device page. When the regular `Web-VNC` link is available you will see the additional button rendered next to it. Clicking the button launches a noVNC session using the configured parameters.
