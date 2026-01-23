export function playAudio(src: string, volume = 1, loop = false) {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.loop = loop;
    audio.play();
}
