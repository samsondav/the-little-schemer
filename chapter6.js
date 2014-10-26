"use strict;"

// returns true if aexp is an arithmetic expression
GLOBAL.isNumbered = function(aexp) {
  if (isAtom(aexp)) {
    return isNumber(aexp);
  } else {
    return (isNumbered(car(aexp)) && isNumbered(car(cdr(cdr(aexp)))));
  }
}

// evaluates an arithmetic expression
GLOBAL.value = function(nexp) {
  if (isAtom(nexp)) {
    return nexp;
  } else if (isEq(car(cdr(nexp)), '+') {
    return plus(value(car(nexp)), value(car(cdr(cdr(nexp)))));
  } else if (isEq(car(cdr(nexp)), 'x') {
    return multiply(value(car(nexp)), value(car(cdr(cdr(nexp)))));
  } else {
    return expt(value(car(nexp)), value(car(cdr(cdr(nexp)))));
  }
}
