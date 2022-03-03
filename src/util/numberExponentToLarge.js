/* eslint-disable */

// https://codereview.stackexchange.com/questions/243164/convert-exponential-e-notation-numbers-to-decimals

/** ******************************************************
 * Converts Exponential (e-Notation) Numbers to Decimals
 ********************************************************
 * @function numberExponentToLarge()
 * @version  1.00
 * @param   {string}  Number in exponent format.
 *                   (other formats returned as is).
 * @return  {string}  Returns a decimal number string.
 * @author  Mohsen Alyafei
 * @date    12 Jan 2020
 *
 * Notes: No check is made for NaN or undefined inputs
 *
 ****************************************************** */

function numberExponentToLarge(numIn) {
  numIn += '' // To cater to numric entries
  let sign = '' // To remember the number sign
  numIn.charAt(0) == '-' && ((numIn = numIn.substring(1)), (sign = '-')) // remove - sign & remember it
  let str = numIn.split(/[eE]/g) // Split numberic string at e or E
  if (str.length < 2) return sign + numIn // Not an Exponent Number? Exit with orginal Num back
  const power = str[1] // Get Exponent (Power) (could be + or -)
  if (power == 0 || power == -0) return sign + str[0] // If 0 exponents (i.e. 0|-0|+0) then That's any easy one

  const deciSp = (1.1).toLocaleString().substring(1, 2) // Get Deciaml Separator
  str = str[0].split(deciSp) // Split the Base Number into LH and RH at the decimal point
  let baseRH = str[1] || '' // RH Base part. Make sure we have a RH fraction else ""
  let baseLH = str[0] // LH base part.

  if (power > 0) {
    // ------- Positive Exponents (Process the RH Base Part)
    if (power > baseRH.length) baseRH += '0'.repeat(power - baseRH.length) // Pad with "0" at RH
    baseRH = baseRH.slice(0, power) + deciSp + baseRH.slice(power) // Insert decSep at the correct place into RH base
    if (baseRH.charAt(baseRH.length - 1) == deciSp) { baseRH = baseRH.slice(0, -1) } // If decSep at RH end? => remove it
  } else {
    // ------- Negative Exponents (Process the LH Base Part)
    const num = Math.abs(power) - baseLH.length // Delta necessary 0's
    if (num > 0) baseLH = '0'.repeat(num) + baseLH // Pad with "0" at LH
    baseLH = baseLH.slice(0, power) + deciSp + baseLH.slice(power) // Insert "." at the correct place into LH base
    if (baseLH.charAt(0) == deciSp) baseLH = `0${baseLH}` // If decSep at LH most? => add "0"
  }
  return sign + baseLH + baseRH // Return the long number (with sign)
}

export default numberExponentToLarge
