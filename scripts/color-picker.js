import JsColor from './lib/jscolor.js'
import { ColorPickerField } from './color-picker-field.js';
import { HTMLAlphaColorPickerElement } from './alpha-color-picker-element.js';

Hooks.once('init', function () {
  window.ColorPicker = {
    register,
    install: JsColor.install
  }
  window.customElements.define(HTMLAlphaColorPickerElement.tagName, HTMLAlphaColorPickerElement);
  game.colorPicker = {};
  game.colorPicker.ColorPickerField = ColorPickerField;
  Hooks.callAll('colorPickerReady', window.ColorPicker)
})

function register (module, key, settingOptions, pickerOptions) {
  // eslint-disable-next-line no-new
  new Setting(module, key, settingOptions, pickerOptions)
}

class Setting {
  /**
   * @param {String} module The namespace under which the setting/menu is registered
   * @param {String} key The key name for the setting under the namespace module
   * @param {Object} settingOptions The settings options
   * @param {String} settingOptions.name The name
   * @param {String} settingOptions.hint The hint
   * @param {String} settingOptions.label The label
   * @param {String} settingOptions.scope The scope
   * @param {Boolean} settingOptions.restricted Is restricted
   * @param {function(String)} settingOptions.onChange The onChange function
   * @param {String} settingOptions.insertAfter Insert after another setting
   * @param {Object} pickerOptions The picker options
   * @param {String} pickerOptions.format The picker format
   * @param {Number} pickerOptions.previewSize The color preview size
   * @param {string|boolean} pickerOptions.alphaChannel Specifies whether the alpha channel is enabled and the alpha slider is visible.
   * @param {string} pickerOptions.backgroundColor Color picker's background color (in CSS color notation)
   * @param {string} pickerOptions.borderColor Border color of the color picker box (in CSS color notation)
   * @param {number} pickerOptions.borderRadius Border color of the color picker box (in CSS color notation)
   *
   */
  constructor (module, key, settingOptions = {}, pickerOptions = {}) {
    this.defaultSettingOptions = {
      name: '',
      hint: undefined,
      label: 'Color Picker',
      restricted: false,
      scope: 'client',
      config: true,
      type: String,
      default: '#FFFFFFFF',
      onChange: undefined
    }
    this.module = module
    this.key = key
    this.settingOptions = { ...this.defaultSettingOptions, ...settingOptions }
    this.pickerOptions = pickerOptions
    this.jsColor = null
    this.currentColor = this.pickerOptions.value ?? this.settingOptions.default ?? '#FFFFFFFF'
    // add onchange capability
    if (this.settingOptions.onChange !== undefined) {
      this.settingOptions = { ...this.settingOptions, ...{ onChange: this.settingOptions.onChange } }
    }

    // Register placeholder setting
    game.settings.register(this.module, this.key, {
      hint: this.settingOptions.hint,
      name: this.settingOptions.name,
      label: this.settingOptions.label,
      scope: this.settingOptions.scope,
      config: this.settingOptions.config,
      type: String,
      restricted: this.settingOptions.restricted,
      default: this.settingOptions.default,
      onChange: this.settingOptions.onChange,
      pickerOptions: this.pickerOptions
    })

    // Retrieve stored value
    this.currentColor = (game.settings.settings.get(`${module}.${key}`)) ? game.settings.get(module, key) : this.currentColor

    Hooks.on('renderSettingsConfig', (event) => {
      const element = event.element[0].querySelector(`[name='${this.module}.${this.key}']`)
      if (!element) return
      // Replace placeholder element
      const newElement = $(element).replaceWith(`<input type="text" id="color-picker-${this.module}-${this.key}" name="${this.module}.${this.key}" value="${this.currentColor}">`)
      if (!newElement) return
      // Attach jscolor to element
      this.pickerOptions.value = this.currentColor
      this.jsColor = new JsColor(`#color-picker-${this.module}-${this.key}`, this.pickerOptions)

      // Set colors when 'Save Changes' button is pressed
      $(event.element[0].querySelector("form.categories footer button[type=submit]")).on('click', () => {
        this.currentColor = this.jsColor.toString()
        game.settings.set(this.module, this.key, this.currentColor)
      })

      // Reset colors to defaults when 'Reset Defaults' button is pressed
      $(event.element[0].querySelector("aside.sidebar button.reset-all")).on('click', () => {
        this.currentColor = this.settingOptions.default ?? '#FFFFFFFF'
        this.jsColor.fromString(this.currentColor)
        game.settings.set(this.module, this.key, this.currentColor)
      })
    })
  }
}
