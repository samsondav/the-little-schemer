"use strict";

// returns sum of n and m
GLOBAL.plus = function(n, m) {
  if (isZero(m)) {
    return n;
  }
  return plus(add1(n), sub1(m));
}

// returns n - m
GLOBAL.minus = function(n, m) {
  if (isZero(m)) {
    return n;
  }
  return minus(sub1(n), sub1(m));
}

// sums a list of numbers (AKA a tup)
GLOBAL.addtup = function(tup) {
  if (isNull(tup)) {
    return 0;
  }
  return plus(car(tup), addtup(cdr(tup)));
}

// multiplies two numbers
GLOBAL.multiply = function(n, m) {
  if (isZero(n) || isZero(m)) {
    return 0;
  }
  return plus(n, multiply(n, sub1(m)));
}

// returns a new tup with each tup argument mapped to its sum
GLOBAL.tupPlus = function(tup1, tup2) {
  if (isNull(tup1) && isNull(tup2)) {
    return quote();
  } else if (isNull(tup1)) {
    return tup2;
  } else if (isNull(tup2)) {
    return tup1;
  }
  return cons(plus(car(tup1), car(tup2)), tupPlus(cdr(tup1), cdr(tup2)));
}

// returns true if n > m
GLOBAL.gt = function(n, m) {
  if (isZero(m) && isZero(n)) {
    return false;
  } else if (isZero(m)) {
    return true;
  } else if (isZero(n)) {
    return false;
  }
  return gt(sub1(n), sub1(m));
}

// returns true if n < m
GLOBAL.lt = function(n, m) {
  if (isZero(m) && isZero(n)) {
    return false;
  } else if (isZero(m)) {
    return false;
  } else if (isZero(n)) {
    return true;
  }
  return lt(sub1(n), sub1(m));
}

// returns true if n == m
GLOBAL.neq = function(n, m) {
  if (isZero(m) && isZero(n)) {
    return true;
  } else if (isZero(m)) {
    return false;
  } else if (isZero(n)) {
    return false;
  }
  return neq(sub1(n), sub1(m));
}

// returns n ^ m
GLOBAL.expt = function(n, m) {
  if (isZero(m)) {
    return 1;
  }
  return multiply(n, expt(n, sub1(m)));
}

// returns n / m
GLOBAL.quotient = function(n, m) {
  if (lt(n, m)) {
    return 0;
  }
  return add1(quotient(minus(n, m), m));
}

// returns the number of atoms in a lat
GLOBAL.length = function(lat) {
  if (isNull(lat)) {
    return 0;
  }
  return add1(length(cdr(lat)));
}

// returns the nth atom in a lat.
// NOTE: starts count at 1, not 0
GLOBAL.pick = function(n, lat) {
  if (isZero(sub1(n))) {
    return car(lat)
  }
  return pick(sub1(n), cdr(lat));
}

// returns lat with the nth atom removed
GLOBAL.rempick = function(n, lat) {
  if (isZero(sub1(n))) {
    return cdr(lat)
  }
  return cons(car(lat), rempick(sub1(n), cdr(lat)));
}

// returns a lat with all numbers removed
GLOBAL.noNums = function(lat) {
  if (isNull(lat)) {
    return quote();
  } else if (isNumber(car(lat))) {
    return noNums(cdr(lat));
  }
  return cons(car(lat), noNums(cdr(lat)));
}

// extracts a tup from a lat (removes everything that isn't a number)
GLOBAL.allNums = function(lat) {
  if (isNull(lat)) {
    return quote();
  } else if (isNumber(car(lat))) {
    return cons(car(lat), allNums(cdr(lat)));
  }
  return allNums(cdr(lat));
}

// returns true if both elements are equal atoms
GLOBAL.isEqan = function(a1, a2) {
  if (isNumber(a1) && isNumber(a2)) {
    return neq(a1, a2);     // test using number equality
  } else if (isNumber(a1) || isNumber(a2)) {
    return false;       // one is a number and the other is not
  }
  return isEq(a1, a2);    // test using atom equality
}

// returns a count of the number of times a appears in lat
GLOBAL.occur = function(a, lat) {
  if (isNull(lat)) {
    return 0;
  } else if (isEq(car(lat), a)) {
    return add1(occur(a, cdr(lat)));
  }
  return occur(a, cdr(lat));
}

// returns true if n is 1
GLOBAL.isOne = function(n) {
  return neq(n, 1);
}

