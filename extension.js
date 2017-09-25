/**
 * -----------------------------------------------------------------
 * Brought to you by: Mr. Jesse Boyer <https://jream.com>
 * -----------------------------------------------------------------
 * This is the default example file broken down with many comments
 * and links to resources.
 *
 * This will help you get started as it's a little odd to begin with
 * and the documentation is lacking in my opinion.
 *
 * When Lost finding a function,, Search this page:
 *   - https://developer.gnome.org/st/stable/api-index-full.html
 * -----------------------------------------------------------------
 * @Note: We can greatly organize and improve extensions :)
 * -----------------------------------------------------------------
 */

// ST: For UI Drawable Elements
const St = imports.gi.St;

// ui.main: This is the Main Window
const Main = imports.ui.main;

// Tweener: This is For Animations (If you want to use them)
const Tweener = imports.ui.tweener;

// These are just global variables, as they are passed from
// several functions in this example.
let text, button;

/**
 * -----------------------------------------------------------------
 * Required Functions
 * -----------------------------------------------------------------
 * 1: init()
 * 2: enable()
 * 3: disable()
 * -----------------------------------------------------------------
 */
function init() {
  /**
   * -----------------------------------------------------------------
   * Purpose: Create a top panel button (Empty Icon by Default).
   * -----------------------------------------------------------------
   * StBin is a simple container with one actor, the hierarchy inherits
   * more from StWidget, see the graph below. This is common for the
   * St Items.
   *
   * -----------------------------------------------------------------
   * Structure: Making Sense of the Object
   * -----------------------------------------------------------------
   * GObject
   * ╰── GInitiallyUnowned
   *     ╰── ClutterActor
   *         ╰── StWidget           <-- Properties Inherited
   *             ╰── StBin
   *                 ╰──  StButton  <-- Item we Created
   *
   * - StWidget Parent Properties Used:
   *     style_class, reactive, can_focus,track_hover
   * - StBin Properties Used:
   *     x_fill, y_fill
   *
   * -----------------------------------------------------------------
   * Answers: What's Happening
   * -----------------------------------------------------------------
   * - Creates a Single Element
   * - Parameters pass do the following:
   *   - style_class: refers to your stylesheets.css, aka .panel-button styles`
   *   - reactive: ST Parameter which allows responding to Mouse Clicks.
   *   - can_focus: ST Parameter which allows responding to Keyboard.
   *   - x_fill: (Default false)
   *             Whether the child should fill the horizontal allocation
   *   - y_fill: (Default false, shouldnt need to be here)
   *             Whether the child should fill the vertical allocation
   *   - track_hover: ST Parameter which allows Reacting to Mouse Hover.
   *
   * -----------------------------------------------------------------
   * References
   * -----------------------------------------------------------------
   * StBin: https://developer.gnome.org/st/stable/StBin.html
   * StWidget (Inherited): https://developer.gnome.org/st/stable/StWidget.html
   *   - See the Properties
   * -----------------------------------------------------------------
   */
  button = new St.Bin({
    style_class: 'panel-button',
    reactive: true,
    can_focus: true,
    x_fill: true,
    y_fill: false,
    track_hover: true
  });


  /**
   * -----------------------------------------------------------------
   * Purpose: Creates an Icon
   * -----------------------------------------------------------------
   * This create an Icon and placed it in the button we created above.
   *
   * -----------------------------------------------------------------
   * Structure: Making Sense of the Object
   * -----------------------------------------------------------------
   * GObject
   *   ╰── GInitiallyUnowned
   *       ╰── ClutterActor
   *           ╰── StWidget     <-- Properties Inherited
   *               ╰── StIcon   <-- Item we Create
   *
   * -----------------------------------------------------------------
   * Answers: What's Happening
   * -----------------------------------------------------------------
   * - Create a new Icon
   *   - icon_name: A name of the icon
   *   - style_class: CSS Style for Icon (From extended StWiget)
   *                  Appears to be a built in style somewhere.
   *
   * -----------------------------------------------------------------
   * References
   * -----------------------------------------------------------------
   * StIcon: https://developer.gnome.org/st/stable/st-st-icon.html
   * StWidget (Inherited): https://developer.gnome.org/st/stable/StWidget.html
   *   - See the Properties
   */
  let icon = new St.Icon({
    icon_name: 'system-run',
    style_class: 'system-status-icon'
  });


  /**
   * -----------------------------------------------------------------
   * Purpose: Append the icon to the botton.
   * -----------------------------------------------------------------
   * This is called an "Actor" because it "Acts as Someting"
   *
   * @TODO Figure out where this is defined?
   * @TODO Asked at SO:
   * https://stackoverflow.com/questions/46399598/gnome-shell-extension-library-beginner-where-is-the-button-connect-defined
   * -----------------------------------------------------------------
   * References
   * -----------------------------------------------------------------
   * - [https://developer.gnome.org/st/stable/StBin.html#st-bin-set-child](https://developer.gnome.org/st/stable/StBin.html#st-bin-set-child)
   *   - set_child comes from StBin, it omits 'st_bin' from 'st_bin_set_child()'
   *     thus only using set_child().
   */
  button.set_child(icon);

  /**
   * -----------------------------------------------------------------
   * Purpose: Connect the button to an Event (Make it do something)
   * -----------------------------------------------------------------
   * Action: button-press-event
   * Custom Function: _showHello
   *
   * This "Emits" a "Signal" for the UI.
   *
   * Signals come from the "ClutterActor.Signals", most things are
   * in the "Clutter" class which is a C library we speak to with JS bindings.
   */
  button.connect('button-press-event', _showHello);
}

/**
 * Enable should apply all needed items for the extensions,
 * Main extension code goes here -- But I would abstract it out to sub-files.
 * - This is what MAKES the extension WORK
 * - Add UI Elements, Signals, etc.
 */
function enable() {
  /**
   * Add the button to the TOP PANEL (on the right) with index 0
   */
  Main.panel._rightBox.insert_child_at_index(button, 0);
}

/**
 * REQUIRED: Delete all connections, and things related to our extension.
 * The System must behave as it did prior to installing this extension.
 * - Disconnect all Signals
 * - Delete all UI elements
 * - Delete all Timers (If Any)
 * Failure to do so will be rejected by Gnome Extensions.
 */
function disable() {
  Main.panel._rightBox.remove_child(button);
}

// -----------------------------------------------------------------
// Custom Functions
// -----------------------------------------------------------------

/**
 * - Hides the Hello Element when the opacity is 0%.
 *   - This is done by the animation library Tweener in _showText.
 * - It still remains a UI element, just not visible.
 * - It must be explicitly deleted from the Main instance.
 */
function _hideHello() {
  Main.uiGroup.remove_actor(text);
  text = null;
}

/**
 * Creates Text if not exists, thus creating a new UI element.
 * - Uses ST Library, we create UI Elements for Gnome Shell.
 * - ST References: http://developer.gnome.org/st/stable/
 */
function _showHello() {
  if (!text) {
    text = new St.Label({style_class: 'helloworld-label', text: 'Hello, world!'});
    Main.uiGroup.add_actor(text);
  }

  /**
   * Notice text.opacity at 255 (to me that's white, maybe it is?)
   * Rather than 100 or 1 in CSS.. Interesting.
   */
  text.opacity = 255;

  /**
   * We can choose a monitor (for multi-display) to display
   * our "Show Hello" label. This uses the primaryMonitor from settings
   * and there always it one, so it's a safe bet.
   */
  let monitor = Main.layoutManager.primaryMonitor;

  /**
   * This moves the text to the horizontal/vertical center of screen.
   */
  text.set_position(
      Math.floor(monitor.width / 2 - text.width / 2),
      Math.floor(monitor.height / 2 - text.height / 2)
  );

  /**
   * Using Tween, for whatever reason it animates the "Hello" element.
   * - First, this creates a new element totally visible.
   * Tweener does the following:
   * - Opacity: Where to animate the opacity to, in this case: From 255 to Invisible
   * - Time: How long to show the element transition
   * - Transition: The Effect, Like many JS Libraries
   * - OnComplete: Call method (After 2 seconds it seems it reaches 0%)
   */
  Tweener.addTween(text, {
    opacity: 0,
    time: 2,
    transition: 'easeOutQuad',
    onComplete: _hideHello
  });
}
