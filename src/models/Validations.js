class Validations {
  static colorHex(value) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(value);
  }

  static float(value) {
    try {
      return !isNaN(parseFloat(value));
    } catch (error) {
      return false;
    }
  }

  static integer(value) {
    try {
      return !isNaN(parseInt(value));
    } catch (error) {
      return false;
    }
  }

  static number(value) {
    return Validations.float(value);
  }

  static string(value) {
    return value !== undefined && value !== null && value.toString().trim() !== "";
  }
}
export default Validations;
