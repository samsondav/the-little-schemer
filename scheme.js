// The Little Schemer - JavaScript implementation
// - By Sam Davies

// SCHEME PRIMITIVE DEFINITIONS //
//
// Lists are implemented using JavaScript Array objects.
// Atoms are either a String or a Number.
//
// boolean? functions with question marks are invalid JS, so where these are
// referred to in the text they are replaced with their isBoolean equivalent.
//
// E.g. null? becomes isNull.

"use strict";

GLOBAL.car = function(list) {
  if (!(list instanceof Array) || list.length === 0) {
    throw 'car is only defined for non-empty lists.';
  }
  return list[0];
};

GLOBAL.cdr = function(list) {
  if (!(list instanceof Array) || list.length === 0) {
    throw 'cdr is only defined for non-empty lists.';
  }
  return list.slice(1);
};

GLOBAL.cons = function(sexp, list) {
  if (!(list instanceof Array)) {
    throw 'The second argument to cons must be a list.';
  }
  list.unshift(sexp);
  return list;
};

GLOBAL.quote = function() {
  return new Array;
};

GLOBAL.isNull = function(list) {
  if (!(list instanceof Array)) {
    throw 'isNull is defined only for lists.';
  }
  return (list.length === 0);
};

GLOBAL.isAtom = function(sexp) {
  if (sexp instanceof Array) {
    return false;
  } else if (typeof sexp === 'number') {
    return true;
  } else if (typeof sexp === 'string') {
    return true;
  } else {
    throw 'isAtom is only defined for valid S-expressions.';
  }
};

GLOBAL.isEq = function(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    throw 'isEq is only defined for comparison between non-numeric atoms.';
  }
  return (a === b);
}
