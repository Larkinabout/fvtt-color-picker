import JsColor from './lib/jscolor.js'

/**
 * @typedef AbstractFormInputElement
 * @property {string} value  A hexadecimal string representation of the color.
 */

/**
 * A custom HTMLElement used to select a color and alpha
 * @extends {AbstractFormInputElement<string>}
 */
export class HTMLAlphaColorPickerElement extends foundry.applications.elements.AbstractFormInputElement {
  /**
   * @param {HTMLColorPickerOptions} [options]
   */
  constructor({ value, format }={}) {
    super();
    this._setValue(value || this.getAttribute("value")); // Initialize existing color value
    this._format = format || this.getAttribute("format");
  }

  /** @override */
  static tagName = "alpha-color-picker";

  /* -------------------------------------------- */

  /**
   * The input element to define a Document UUID.
   * @type {HTMLInputElement}
   */
  #colorString;

  /* -------------------------------------------- */

  /** @override */
  _buildElements() {
    // Create string input element
    this.#colorString = this._primaryInput = document.createElement("input");
    this.#colorString.type = "text";
    this.#colorString.placeholder = this.getAttribute("placeholder") || "";
    this._applyInputAttributes(this.#colorString);
    return [this.#colorString];
  }

  /* -------------------------------------------- */

  /** @override */
  _refresh() {
    if ( !this.#colorString ) return; // Not yet connected
    this.#colorString.value = this._value;
  }

  /* -------------------------------------------- */

  /** @override */
  _activateListeners() {
    this.pickerOptions = {
      format: this._format ?? "hexa",
      value: this._value
    }

    //This both modifies the element and adds event handlers
    new JsColor(this.#colorString, this.pickerOptions);

    //JsColor will update the HTML input but we still need to handle the change so we can update our value
    const onChange = this.#onChangeInput.bind(this);
    this.#colorString.addEventListener("change", onChange);
  }

  /* -------------------------------------------- */

  /**
   * Handle changes to one of the inputs of the color picker element.
   * @param {InputEvent} event     The originating input change event
   */
  #onChangeInput(event) {
    event.stopPropagation();
    this.value = event.currentTarget.value;
  }

  /* -------------------------------------------- */

  /** @override */
  _toggleDisabled(disabled) {
    this.#colorString.disabled = disabled;
  }

  /* -------------------------------------------- */

  /**
   * Create a HTMLAlphaColorPickerElement using provided configuration data.
   * @param {FormInputConfig} config
   * @returns {HTMLAlphaColorPickerElement}
   */
  static create(config) {
    const picker = new this(config);
    picker.name = config.name;
    picker.setAttribute("value", config.value ?? "");
    picker.setAttribute("format", config.format ?? "");
    foundry.applications.fields.setInputAttributes(picker, config);
    return picker;
  }
}