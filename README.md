# dmenu-json

Create nested menus using dmenu and a json file.

## Usage example

Using as an application starter with i3:

in .config/i3/config:

```
# Application dialog on mod+t
bindsym $mod+t exec $(cat ~/.apps.json | dmenu-json)
```

.apps.json

```
{
    "session": {
        "power off": "shutdown now",
        "i3lock": null
    },
    "editors": ["gvim", "code"]
}
```
