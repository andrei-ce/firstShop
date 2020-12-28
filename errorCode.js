function add(a, b) {
  try {
    let msg = 'hi';
    return console.log(a + b);
  } catch (err) {
    console.log('WOW');
    console.log(msg);
  }
}

add(3, 2);
console.log('======');
add(2);
console.log('======');
