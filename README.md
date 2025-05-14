# Color Picker for Foundry VTT

A customisable color picker with a built-in opacity (alpha) slider for use as a library in Foundry VTT.

![Color Picker](./images/color-picker.gif)

# Licence

This module uses a modified version of the [jscolor](https://github.com/EastDesire/jscolor) Color Picker by Jan Odvárko (East Desire) under the terms of the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) licence.

For info about **jscolor** Color Picker, see the [jscolor website](https://jscolor.com).

# How to Use
## Registering a Setting
To create a setting that works as a color picker, you just need to set the type on the setting to be `new game.colorPicker.ColorPickerField()`.

Example:
```
game.settings.register("your-module", "your-setting-key", {
    name: "Your Cool Color",
    hint: "This color is used for cool stuff",
    scope: "client",
    config: true,
    type: new game.colorPicker.ColorPickerField(),
});
```
You can optionally provide the [format](#format) you wish to use like so (the default is "hexa"):
```type: new game.colorPicker.ColorPickerField({ format: "hex" })```

## In a Handlebars Template
To use the color picker in any hbs template file (the most common use case being a settings menu), provide the type through the data context with `new game.colorPicker.ColorPickerField()` as above. Then just use either the formInput or formGroup helper. You can learn more about those helpers on the [community wiki](https://foundryvtt.wiki/en/development/api/helpers).


# The Old Way
> [!CAUTION]
> It's highly recommended to use the ColorPickerField directly as described above. The old method remains functional for the time being but mostly as a way to keep existing modules working. THis is also currently the only way to do extra customization on the appearance of the picker itself. This may be deprecated in the future.

## Register a Module Setting
As with FoundryVTT's [ClientSettings.register](https://foundryvtt.com/api/ClientSettings.html#register) function, use the `ColorPicker.register(module, key, {settingOptions}, {pickerOptions})` function to register a new color picker setting for a module. `module` is the ID of the module, `key` is the name of the setting, `{settingOptions}` is a comma-separated list of options related to the `ClientSettings.register` function (see Setting Options) and `{pickerOptions}` is a comma-separated list of options for the picker (see Picker Options).

## Setting Options
### **name**
The name of the setting for end users.

Example: `name: 'Background Color'`

### **hint**
The description of the registered setting and its behavior.

Example: `hint: 'Set the background color'`

### **default**
The default color value, e.g., `'#FF0000FF'` for opaque red. If unset, the default is `'#FFFFFFFF'`.

Example: `default: '#FF0000FF'`

### **scope**
The scope of the setting: 
- **'client':** The setting affects only the client.
- **'world':** The setting affects all clients.

Example: `scope: 'world'`

### **config**
Whether to display the setting in the configuration view. If set to `false`, the color picker will not be available. Default is `true`.

Example: `config: false`

## Module Setting Examples
````
ColorPicker.register(
  'my-module',
  'background-color', 
  {
    name: 'Background Color',
    hint: 'Set the background color'
    scope: 'world',
    config: true
  },
  {
    format: 'hexa',
    alphaChannel: true
  }
)
````
## Add an Input
1. Add the following html to your template file: 
   ````
   <input type="text" data-color-picker="{pickerOptions}" value="">
   ````
   - *`pickerOptions` is a list of comma-separated options in the format: `option: value`. See "Picker Options" for a list of options*
   - *`type` does not need to be defined, but Foundry VTT will automatically format the element if it is included.*
2. Add `ColorPicker.install()` to your script after the template is rendered.

# Picker Options
### **alpha**
The initial alpha (opacity) value.

Example: `alpha: 0.5`

### **alphaChannel**
Whether the alpha (opacity) channel is enabled and the alpha slider is visible. The default is `auto`.

- **'auto':** The alpha channel is enabled if the current format supports it.
- **true:** The alpha channel is enabled.
- **false:** The alpha channel is disabled.

Example: `alphaChannel: true`

### **alphaElement**
The DOM element that will be used to edit and display the alpha value (opacity).

### **backgroundColor**
The background color of the color picker (in CSS color notation). Default is `'rgba(255, 255, 255, 1)'`.

Example: `backgroundColor: 'rgba(218, 216, 204, 1`

### **borderColor**
The border color of the color picker (in CSS color notation). Default is `'rgba(187, 187, 187 ,1)'`.

Example: `borderColor: 'rgba(122, 121, 113, 1)'`

### **borderRadius**
The border radius of the color picker (in pixels). Default is `5`.

Example: `borderRadius: 10`

### **borderWidth**
The border width of the color pickeer (in pixels). Default is `1`.

Example: `borderWidth: 2`

### **buttonColor**
The text and border color of the Close button (in CSS notation). Default is `'rgba(0, 0, 0, 1)'`

Example: `buttonColor: 'rgba(0, 0, 0, 1)'`

### **buttonHeight**
The height of the Close button (in pixels). Default is `18`.

Example: `buttonHeight: 25`

### **closeButton**
Whether the Close button is displayed. Default is `false`.

Example: `closeButton: true`

### **closeText**
The text of the Close button. Default is `Close`.

Example: `closeText: 'Exit'`

### **controlBorderColor**
The border color of the color picker's controls (in CSS color notation). Default is `'rgba(187, 187, 187, 1)'`.

Example: `controlBorderColor: 'rgba(122, 121, 113, 1)'`

### **controlBorderWidth**
The border width of the color picker's controls (in pixels). Default is `1`.

Example: `controlBorderWidth: 2`

### **crossSize**
The size of the crosshair cursor (in pixels). Default is `8`.

### **forceStyle**
Whether to overwrite the CSS style of the previewElement using the !important flag. Default is `true`.

Example: `forceStyle: false`

### **format**
The format of the displayed color value.
- **'auto':** Base the format on the initial color value.
- **'any':** Any supported format.
- **'hex':** Hex color: #RRGGBB
- **'hexa':** Hex color with alpha channel: #RRGGBBAA
- **'rgb':** RGB color: rgb(R, G, B)
- **'rgba':** RGB color with alpha channel: rgba(R, G, B, A)

Example: `format: 'hexa'`

### **hash**
Whether the valueElement should be prefixed with #. Default is `true`

Example: `hash: false`

### **height**
The height of the color spectrum area (in pixels). Default is `101`.

Example: `height: 200`

### **hideOnLeave**
Whether to hide the color picker when clicking away from the target element. Default is `true`.

Example: `hideOnleave: false`

### **hideOnPaletteClick**
Whether to hide the color picker when clicking the palette. Default is `false`.

Example: `hideOnPaletteClick: true`

### **mode**
The layout of the color picker controls. Default is `HSV`.
- **'HSV':** Hue and saturation are controlled with a 2D gradient and value (brightness) is controlled with a slider.
- **'HVS':** Huse and value (brightness) are controlled with a 2D gradient and saturation is controlled with a slider.
- **'HS':** Hude and saturation are conrolled with a 2D gradient and value (brightness) is not controlled.
- **'HV':** Hude and value are conrolled with a 2D gradient and value saturation is not controlled.

Example: `mode: 'HVS'`

### **onChange**
A callback function called when the color is changed.

### **onInput**
A callback function called repeatedly as the color is changed.

### **padding**
The padding of the color picker (in pixels). Default is `12`

Example: `padding: 5`

### **palette**
The colors to be displayed in the palette (in array or space-separated string notation).

Array notation example: `palette: ['#ffe438', '#88dd20', 'rgba(0,154,255,0.6)', 'rgba(187,0,255,0.3)']`
String notation example: `palette: '#ffe438 #88dd20 rgba(0,154,255,0.6) rgba(187,0,255,0.3)'`

### **paletteCols**
The number of columns in the palette. Default is `10`.

Example: `paletteCols: 5`

### **paletteHeight**
The maximum height of a row in the palette (in pixels). Default is `16`.

Example: `paletteHeight: 10`

### **paletteSetsAlpha**
Whether the palette colors will set alpha. Default is `auto`.
- **'auto':** Palette colors will set alpha if the palette contains at least one color with alpha.
- **true:** Palette colors will set alpha.
- **false:** Palette color will not set alpha.

Example: `paletteSetsAlpha: true`

### **paletteSpacing**
The distance between color samples in the palette. Default is `4`.

Example: `paletteSpacing: 2`

### **pointerBorderColor**
The border color of the pointers inside the color picker's controls (in CSS color notation). Default is `'rgba(255, 255, 255, 1)'`

Example: `pointerBorderColor: 'rgba(0, 14, 238, 1)'`
### **pointerBorderWidth**
The border width of the pointers inside the color picker's controls. Default is `1`.

Example: `pointerBorderColor: 2`

### **pointerColor**
The color of the pointers iside the color picker's controls (in CCS color notation). Default is `'rgba(76,76,76,1)'`.

### **pointerThickness**
The thickness of the pointers inside the color picker's controls (in pixels). Default is `2`

Example: `pointerThickness: 1`

### **position**
The position of the color pickeer relative to the target element. Default is: `'bottom'`.

Available values:
- 'left'
- 'right'
- 'top'
- 'bottom'

Example: `position: 'right'`

### **previewElement**
The DOM element that will contain a preview of the picked color using CSS background image. Default is `targetElement`.

### **previewPadding**
The space between the color preview image and content of the `previewElement` (in pixels). Default is `8`.

Example: `previewPadding: 20`

### **previewPosition**
The position of the color preview image in the `previewElement`. Default is `'left'`.

Available values:
- 'left'
- 'right'

Example: `previewPosition: 'right'`

### **previewSize**
The width of the color preview image in the `previewElement` (in pixels). Default is `32`

Example: `previewSize: 50`

### **random**
Whether to generate a random initial color. Default is `false`.

Example: `random: false`

### **required**
Whether the `valueElement` must always contain a color value. Default is `true`.

Example: `required: false`

### **shadow**
Whether to display a shadow behind the color picker. Default is `true`.

Example: `shadow: false`

### **shadowBlur**
The blur radius of the color picker's shadow (in pixels). Default is `15`.

Example: `shadowBlur: 5`

### **shadowColor**
The color of the color picker's shadow (in CSS color notation). Default is `'rgba(0,0,0,0.2)'`.

Example: `shadowColor: 'rgba(255, 0, 0 , 1)'`

### **showOnClick**
Whether to display the color picker on clicking the target element. Default is `true`.

Example: `showOnClick: false`

### **sliderSize**
The width of the sliders (in pixels). Default is `16`.

Example: `sliderSize: 10`

### **smartPosition**
Whether to automatically move the position of the color picker when there is not enough space for it at the specified `position`. Default is `true`.

Example: `smartPosition: false`

### **uppercase**
Whether to display the hex color code in uppercase. Default is `true`.

Example: `uppercase: false`

### **value**
The initial color value in any support formatted. If not set, the **value** attribute of the `valueElement` will be used.

Example: `value: '#ffffffff'`

### **valueElement**
The DOM element that will contain the color code. Default is the target element.

### **width**
The width of the color spectrum area (in pixels). Default is `181`.

Example: `width: 200`

### **zIndex**
The z-index of the color picker box. Default is `5000`.

Example: `zIndex: 1`
