wfwfwfwfwfwf.js

egeg.js



// 1. 
function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

// 2. reverseString
function reverseString(str) {
  return str.split('').reverse().join('');
}

// 3. 
function countVowels(str) {
  const vowels = 'aeiou';
  let count = 0;
  for (let char of str.toLowerCase()) {
    if (vowels.includes(char)) {
      count++;
    }
  }
  return count;
}

// 4.
function truncateText(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

// 5. removeSpaces
function removeSpaces(str) {
  return str.replace(/\s+/g, '');
}



// 1. 
function sumArray(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum;
}

// 2. 
function filterEvenNumbers(arr) {
  const result = [];
  for (let num of arr) {
    if (num % 2 === 0) {
      result.push(num);
    }
  }
  return result;
}

// 3.
function findMax(arr) {
  let max = arr[0];
  for (let num of arr) {
    if (num > max) {
      max = num;
    }
  }
  return max;
}

// 4. 
function flattenArray(arr) {
  const result = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      for (let subItem of item) {S
        result.push(subItem);
      }
    } else {
      result.push(item);
    }
  }
  return result;
}

// 5. 
function uniqueValues(arr) {
  const result = [];
  for (let val of arr) {
    if (!result.includes(val)) {
      result.push(val);
    }
  }
  return result;
}



// 1. 
function printNumbers(n) {
  for (let i = 1; i <= n; i++) {
    console.log(i);
  }
}

// 2.
function calculateFactorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// 3. 
function generateMultiplicationTable(n) {
  for (let i = 1; i <= 10; i++) {
    console.log(`${n} * ${i} = ${n * i}`);
  }
}
// 4. 
function sumOfDigits(num) {
  let sum = 0;
  let str = Math.abs(num).toString();
  for (let digit of str) {
    sum += Number(digit);
  }
  return sum;
}

// 5.
function repeatString(str, count) {
  let result = '';
  for (let i = 0; i < count; i++) {
    result += str;
  }
  return result;
}