// Libraries
import LoggerUtils from "./LoggerUtils";

// Sounds
import soundAlert from "../sounds/Funk.mp3";
import soundSuccess from "../sounds/Ding.mp3";

const ERROR_UNABLE_TO_PLAY_SOUND = "Failed to play sound";

class SoundUtils {
  static playSound(sound) {
    const newSound = new Audio(sound);
    newSound.play().catch((error) => {
      LoggerUtils.error(`${ERROR_UNABLE_TO_PLAY_SOUND}: ${newSound.name}. \n${error}`);
    });
  }

  static soundAlert() {
    SoundUtils.playSound(soundAlert);
  }

  static soundSuccess() {
    SoundUtils.playSound(soundSuccess);
  }
}
export default SoundUtils;
