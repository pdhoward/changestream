
// execute node add.js from this directory

const After2Seconds = (x) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x * 3);
    }, 2000);
  });
}

const addAsync = async (x) => {
  const a = await After2Seconds(x);
  const b = await After2Seconds(20);
  const c = await After2Seconds(30);
  return x + a + b + c;
}


addAsync(10).then((sum) => {
  console.log(sum);
});