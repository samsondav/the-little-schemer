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
  } else if isMember(car(set1), set2) {
    return difference(cdr(set1), set2);
  } else {
    return cons(car(set1), difference(cdr(set1), set2));
  }
}
