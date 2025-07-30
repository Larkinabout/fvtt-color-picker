import { HTMLAlphaColorPickerElement } from './alpha-color-picker-element.js';

/**
 * A field for picking a color and alpha
 * @extends {foundry.data.fields.StringField}
 */
export class ColorPickerField extends foundry.data.fields.StringField {

  constructor(options={}, context={}) {
    super(options, context);
    this.pickerOptions = options ?? {};
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  static get _defaults() {
    return foundry.utils.mergeObject(super._defaults, {
      nullable: true,
      initial: null,
      blank: false,
      validationError: "is not a valid color string"
    });
  }

  /* -------------------------------------------- */

  /** @inheritdoc */
  _validateType(value, options) {
    let valid = true;
    switch(this.pickerOptions.format) {
      case "hex": valid = /^#[0-9A-Fa-f]{6}$/.test(value); break;
      case "hexa": valid = /^#[0-9A-Fa-f]{8}$/.test(value); break;
      case "rgb": valid = /rgb\(\s*(?:(\d{1,3})\s*,?){3}\)/i.test(value); break;
      case "rgba": valid = /rgba\(\s*(?:(\d{1,3})\s*,?){4}\)/i.test(value); break;
    }
    if (!valid) throw new Error(`must be a valid ${this.pickerOptions.format} color string`);
    return super._validateType(value, options);
  }

  /* -------------------------------------------- */

  createPickerInput(config) {
    const input = document.createElement("input");
    input.type = "text";
    input.name = config.name;
    input.setAttribute("value", config.value ?? "");
    foundry.applications.fields.setInputAttributes(input, config);
    return input;
  }

  /* -------------------------------------------- */
  /*  Form Field Integration                      */
  /* -------------------------------------------- */

  /** @override */
  _toInput(config) {
    if ((config.placeholder === undefined) && !this.nullable && !(this.initial instanceof Function)) {
      config.placeholder = this.initial;
    }

    if ( config.pickerOptions ) {
      const configPickerOptions = this._convertStringToObject(config.pickerOptions);
      this.pickerOptions = foundry.utils.mergeObject(this.pickerOptions, configPickerOptions);
    }

    const pickerOptions = structuredClone(this.pickerOptions);

    const value = config.value ?? pickerOptions.value ?? "";
    pickerOptions.value = config.value = value;

    return HTMLAlphaColorPickerElement.create(config, pickerOptions);
  }

  /* -------------------------------------------- */
  /* Functions                                    */
  /* -------------------------------------------- */

  _convertStringToObject(str) {
    let obj = {};

    str = str.trim().replace(/;$/, '');

    str.split(';').forEach(pair => {
        try {
            let [key, value] = pair.trim().split(':').map(item => item.trim());

            // Skip empty pairs or malformed ones
            if (!key || !value) {
                throw new Error(`Invalid pair: '${pair}'`);
            }

            // Check if the value is a boolean
            if (value === 'true' || value === 'false') {
                obj[key] = value === 'true';
            }
            // Check if the value is a number (i.e., can be parsed as a float)
            else if (!isNaN(value)) {
                obj[key] = parseFloat(value);
            }
            // Check if the value is a string (wrapped in single quotes)
            else if (value.startsWith("'") && value.endsWith("'")) {
                obj[key] = value.slice(1, -1); // Remove single quotes
            } else {
                // Default to treating the value as a string if no other condition matches
                obj[key] = value;
            }
        } catch (error) {
            console.error("Error processing pair:", error.message);
        }
    });

    return obj;
  }
}