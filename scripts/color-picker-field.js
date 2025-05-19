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

  /** @inheritdoc */
  static get _defaults() {
    return foundry.utils.mergeObject(super._defaults, {
      nullable: true,
      initial: null,
      blank: false,
      validationError: "is not a valid color string"
    });
  }

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

    const pickerOptions = structuredClone(this.pickerOptions);

    const value = config.value ?? pickerOptions.value ?? "";
    pickerOptions.value = config.value = value;

    return HTMLAlphaColorPickerElement.create(config, pickerOptions);
  }
}