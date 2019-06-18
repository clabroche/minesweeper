function a (width, height) {
  const possibilities = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      possibilities.push([x, y])
    }
  }
  shuffle(possibilities)
  return possibilities
}
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}



const width = 2000
const height = 2000
console.log('generate ', )
console.time('end')
a(width, height)
console.timeEnd('end')