# Gnome Shell Extension Guide

You'll be writing in JavaScript, CSS, and it's all ready for you. Even
with a simple example!

## You Use Two Main Libraries

### Clutter for Functionality
You will be references the graphics library Clutter for **Functionality** .
Clutter is implemented in the `C`language but you will write your 
extensions in `JavaScript` with the built-in bindings.

- Don't get overwhelmed by the size of this, it's organized nicely and you won't use all tools.
- [https://developer.gnome.org/clutter/stable/ClutterActor.html](https://developer.gnome.org/clutter/stable/ClutterActor.html)

> **Description** Clutter is a GObject-based graphics library for 
> creating hardware-accelerated user interfaces. Clutter is an OpenGL-based 'interactive canvas' library and does not contain any graphical control elements. It relies upon OpenGL (1.4+) or OpenGL ES (1.1 or 2.0) for rendering,[citation needed]. It also supports media playback using GStreamer and 2D graphics rendering using Cairo.[4]
> (Source: Wikipedia)

### ST For UI Elements
Second, you will use `ST` For creating Drawable UI **Elements**, this is a lot smaller than the above.

- Main: [http://developer.gnome.org/st/stable/](http://developer.gnome.org/st/stable/)
- Btn Example: [https://developer.gnome.org/st/stable/StBin.html](https://developer.gnome.org/st/stable/StBin.html)
- When Lost Finding Functions: [https://developer.gnome.org/st/stable/api-index-full.html](https://developer.gnome.org/st/stable/api-index-full.html)

## (Optional) Tween For Animations 
If you are so inclined to use animations, using Tweener is what Gnome is using. The references are here:

- [http://hosted.zeh.com.br/tweener/docs/en-us/](http://hosted.zeh.com.br/tweener/docs/en-us/)

# Create an Extension
```
gnome-shell-extension-tool --create-extension
``` 

Fill out the info, and you'll get a popup. Your files are located at:

```
~/.local/share/gnome-shell/extensions/<yourUID@yourEmail>
```

# Activate your Extension

To activate the extension, the easiest problem-free way is to load 
Firefox or Chrome (with the gnome-extension plugin for the browser) and 
turn it on here: [https://extensions.gnome.org/local/](https://extensions.gnome.org/local/).

Once on, you'll see a simple item in your task bar that looks like **Gears**. This
is your plugin.

## New Extension Files

You will have 3 files to start with within your folder:

| File              | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `extensions.js`   | Required, entry point for extension in JS  |
| `metadata.json`   | Context about extension, email, uid, etc   |
| `stylesheet.css`  | The appearance of the UI |

## Required for Development

Must obey the connector and disconnect to signals with enable/disable.

- **Extensions have 3 mandatory function**
- `init()`
  - Don't do anything major in here
- `enable()`
  - Anything enabled in here, **must** be disabled in `disable()`
- `disable()`
  - All signals **must** be disconnected here from anything enabled.
  - This also applies to **ALL** timers/timeouts, and so forth.

**Proper Example:**

```js
let _windowCreatedId;

// Notice this CONNECTS to the global display
function enable() {
    _windowCreatedId = global.display.connect('window-created', onWindowCreated);
}


// This DISCONNECTS from the global display
function disable() {
    global.display.disconnect(_windowCreatedId);
}

## UI Elements

This allows us to create UI elements
```js
const St = imports.gi.St;
```

This class contains all the UI Elements, which we add all elements into:
```js
const Main = imports.ui.main;
```

This is used for animating.
```js
const Tweener = imports.ui.tweener;
```

Setting global variables is ok:
```
let text, button, input;
```

## Cleaned up Example Application 
This is from the guide which is hard to follow, cleaned up and organized.

```js
// Entry Method
function init() {
  /*
  We create a button for the top panel. We pass to the constructor a map of properties, properties from St.bin and its
  parent classes, like stWidget. So we declare this properties: a style class(from css theming of gnome shell), we made it reactive
  so the button respond for the mouse clicks, we made it that can focus, so marks the button as being able to receive keyboard focus
  via keyboard navigation, we made the button to fill the x space, and we don't want to fill the y space, so we set the values trues and false respectively
  and we want that the button be reactive to the hover of the mouse, so we set the value of the track_hover property to true.
  */
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    /*
      We create an icon with the system-status-icon icon and give it the name "system-run"
     */
    let icon = new St.Icon({ icon_name: 'system-run',
                             style_class: 'system-status-icon' });
    /*
      we put as a child of the button the icon, so, in the structure of actors we have the icon inside the button that is a
      container.
     */
    button.set_child(icon);
    /*
      we connect the actor signal "button-press-event" from the button to the funcion _showHello. In this manner,
      when we press the button, this signal is emitted, and we captured it and execute the _showHello function.
      You can see all signals in the clutter reference(because we are using St that implements actors from clutter, and
      this signals comes from the actor class): http://developer.gnome.org/clutter/stable/ClutterActor.html#ClutterActor.signals
     */
    button.connect('button-press-event', _showHello);
    ```
