import { HTMLAlphaColorPickerElement } from './alpha-color-picker-element.js';

/**
 * A field for picking a color and alpha
 * @extends {foundry.data.fields.StringField}
 */
export class ColorPickerField extends foundry.data.fields.StringField {

  /** @inheritdoc */
  static get _defaults() {
    return foundry.utils.mergeObject(super._defaults, {
      nullable: true,
      initial: null,
      blank: false,
      validationError: "is not a valid hexadecimal color string"
    });
  }

  /** @inheritdoc */
  _validateType(value, options) {
    if (!this.isAlphaColorString(value)) throw new Error("must be a valid color string");
    return super._validateType(value, options);
  }

  isAlphaColorString(color) {
    return /^#[0-9A-Fa-f]{8}$/.test(color);
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
    return HTMLAlphaColorPickerElement.create(config);
  }
}