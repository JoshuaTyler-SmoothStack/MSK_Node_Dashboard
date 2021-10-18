class AnimationUtils {
  static lerp(
    currentValue,
    endValue,
    stepValue,
    stepTime,
    isSubtractive,
    stopAnimation,
    onChange
  ) {
    if(!stopAnimation) {
      currentValue = isSubtractive
      ? parseFloat(currentValue) - parseFloat(stepValue)
      : parseFloat(currentValue) + parseFloat(stepValue);

      if(onChange instanceof Function) {
        onChange(currentValue);
      }

      const valueReached = isSubtractive
        ? currentValue <= endValue
        : currentValue >= endValue;

      if (!valueReached) {
        setTimeout(() => AnimationUtils.lerp(
            currentValue,
            endValue,
            stepValue,
            stepTime,
            isSubtractive,
            onChange
        ), stepTime);
      }
    }
  }
}
export default AnimationUtils;
