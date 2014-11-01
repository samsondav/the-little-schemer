"use strict;"
// MODIFIED to use isEqual
// returns true if a can be found in a list l of abitrary depth
GLOBAL.isMember = function(a, l) {
  if (isNull(l)) {
    return false;
  } else if (isAtom(car(l))) {
    if (isEqual(car(l), a)) {
      return true;
    } else {
      return isMember(a, cdr(l));
    }
  } else {
    return (isMember(a, car(l)) || isMember(a, cdr(l)));
  }
}

// MODIFIED to use isEqual
// returns lat with all values of a removed
GLOBAL.multirember = function(a, lat) {
  if (isNull(lat)) {
    return quote();
  }
  if (isEqual(car(lat), a)) {
    return multirember(a, cdr(lat));
  }
  return cons(car(lat), multirember(a, cdr(lat)));
}

// returns true if the lat is a set of unique atoms
GLOBAL.isSet = function(lat) {
  if (isNull(lat)) {
    return true;
  } else if (isMember(car(lat), cdr(lat))) {
    return false;
  } else {
    return isSet(cdr(lat));
  }
}

// removes all duplicated atoms in lat
GLOBAL.makeset = function(lat) {
  if (isNull(lat)) {
    return lat;
  } else if (isMember(car(lat), cdr(lat))) {
    return cons(car(lat), makeset(multirember(car(lat), cdr(lat))));
  } else {
    return cons(car(lat), makeset(cdr(lat)));
  }
}

// returns true if all elements of set1 can be found in set2
GLOBAL.isSubset = function(set1, set2) {
  if (isNull(set1)) {
    return true;
  } else {
    return isMember(car(set1, set2)) && isSubset(cdr(set1), set2);
  }
}

// returns true if two sets are equivalent
GLOBAL.isEqSet = function(set1, set2) {
  return isSubset(set1, set2) && isSubset(set2, set1);
}

// returns true if the sets have at least one atom in common
GLOBAL.isIntersect = function(set1, set2) {
  if (isNull(set1)) {
    return false;
  } else {
    return isMember(car(set1), set2) || isIntersect(cdr(set1), set2);
  }
}

// returns common elements from two sets
GLOBAL.intersect = function(set1, set2) {
  if (isNull(set1)) {
    return quote();
  } else if (isMember(car(set1), set2)) {
    return cons(car(set1), intersect(cdr(set1), set2));
  } else {
    return intersect(cdr(set1), set2);
  }
}

// returns a new, unique set of elements from two sets
GLOBAL.union = function(set1, set2) {
  if (isNull(set1)) {
    return set2;
  } else if (isMember(car(set1), union(cdr(set1), set2))) {
    return union(cdr(set1), set2);
  } else {
    return cons(car(set1), union(cdr(set1), set2));
  }
}

// returns all elements of set1 that are not in set 2 (a SQL left join)
GLOBAL.difference = function(set1, set2) {
  if (isNull(set1)) {
    return quote();
  } else if (isMember(car(set1), set2)) {
    return difference(cdr(set1), set2);
  } else {
    return cons(car(set1), difference(cdr(set1), set2));
  }
}

// returns intersect across all sets in a list of sets
GLOBAL.intersectall = function(l_set) {
  if (isNull(cdr(l_set))) {
    return car(l_set);
  } else{
    return intersect(car(l_set), intersectall(cdr(l_set)));
  }
}

// returns true if the supplied S-expression is a pair (a list of two S-expressions)
GLOBAL.isPair = function(x) {
  if (isAtom(x)) {
    return false; // x is not a list
  } else if (isNull(x)) {
    return false; // x is the empty list
  } else if (isNull(cdr(x))) {
    return false; // x is a list with only one element
  } else if (isNull(cdr(cdr(x)))) {
    return true; // x is a list with exactly two elements
  } else {
    return false; // x is a list with more than two elements
  }
}

// helper methods to get respective elements of a pair
GLOBAL.first = function(p) {
  return car(p);
}

GLOBAL.second = function(p) {
  return car(cdr(p));
}

// build a pair from two S-expressions
GLOBAL.build = function(s1, s2) {
  return cons(s1, cons(s2, quote()));
}

// returns true if the rel is a fun
// (a rel is a list of pairs that can represent a key-value hash map but with duplicate keys)
// (a fun is like a key-value hash map with unique keys)
GLOBAL.isFun = function(rel) {
  return isSet(firsts(rel));
}

// reverses a pair
GLOBAL.revpair = function(pair) {
  return build(second(pair), first(pair));
}

// reverses each pair in a rel
GLOBAL.revrel = function(rel) {
  if (isNull(rel)) {
    return quote();
  } else {
    return cons(revpair(car(rel)), revrel(cdr(rel)));
  }
}

// returns true if the fun is a fullfun
// a fullfun is essentially a reversible hash (i.e. the set of firsts is unique
// and so is the set of seconds)
GLOBAL.isFullfun = function(fun) {
  return isFun(revrel(fun));
}
