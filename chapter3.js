"use strict";

// returns lat with the first occurence of a removed
GLOBAL.rember = function(a, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq((car(lat)), a)) {
    return cdr(lat);
  }
  return cons(car(lat), rember(a, cdr(lat)));
}

// returns a list of first S-expressions of each list in l, a list of non-null lists
GLOBAL.firsts = function(l) {
  if (isNull(l)) {
    return quote();
  }
  return cons(car(car(l)), firsts(cdr(l)));
}

// returns lat with nyoo (AKA new) inserted to the right of the first occurence of old
GLOBAL.insertR = function(nyoo, old, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), old)) {
    return cons(old, cons(nyoo, cdr(lat)));
  }
  return cons(car(lat), insertR(nyoo, old, cdr(lat)));
}

// returns lat with nyoo (AKA new) inserted to the left of the first occurence of old
GLOBAL.insertL = function(nyoo, old, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), old)) {
    return cons(nyoo, lat);
  }
  return cons(car(lat), insertL(nyoo, old, cdr(lat)));
}

// returns lat with nyoo substituted for the first occurence of old
GLOBAL.subst = function(nyoo, old, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), old)) {
    return cons(nyoo, cdr(lat));
  }
  return cons(car(lat), subst(nyoo, old, cdr(lat)));
}

// returns lat with all values of a removed
GLOBAL.multirember = function(a, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), a)) {
    return multirember(a, cdr(lat));
  }
  return cons(car(lat), multirember(a, cdr(lat)));
}

// returns lat with nyoo inserted to the right of every occurence of old
GLOBAL.multiinsertR = function(nyoo, old, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), old)) {
    return cons(old, cons(nyoo, multiinsertR(nyoo, old, cdr(lat))));
  }
  return cons(car(lat), multiinsertR(nyoo, old, cdr(lat)));
}

// returns lat with nyoo insterted to the left of every occurence of old
GLOBAL.multiinsertL = function(nyoo, old, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), old)) {
    return cons(nyoo, cons(old, multiinsertL(nyoo, old, cdr(lat))));
  }
  return cons(car(lat), multiinsertL(nyoo, old, cdr(lat)));
}

// returns lat with all values of old replaced by nyoo
GLOBAL.multisubst = function(nyoo, old, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEq(car(lat), old)) {
    return cons(nyoo, multisubst(nyoo, old, cdr(lat)));
  }
  return cons(car(lat), multisubst(nyoo, old, cdr(lat)));
}
