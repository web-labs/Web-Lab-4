import {AbstractControl, ValidationErrors} from "@angular/forms";

export function numberValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null

  const isNumber = !isNaN(parseFloat(control.value)) && isFinite(control.value)

  return isNumber ? null : {'notANumber': true}
}
