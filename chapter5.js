"use strict;"

// remove all occurences of a from l where l is a list of abitrarily nested lists
GLOBAL.remberStar = function(a, l) {
  if (isNull(l)) {
    return quote();
  } else if (isAtom(car(l))) {
    if (isEq(car(l), a)) {
      return remberStar(a, cdr(l));
    } else {
      return cons(car(l), remberStar(a, cdr(l)));
    }
  } else {
    return cons(remberStar(a, car(l)), remberStar(a, cdr(l)));
  }
}

// inserts nyoo to the right of all occurences of old in a list l of abitrary depth
GLOBAL.insertRStar = function(nyoo, old, l) {
  if (isNull(l)) {
    return quote();
  } else if (isAtom(car(l))) {
    if (isEq(car(l), old)) {
      return cons(old, (cons(nyoo, insertRStar(nyoo, old, cdr(l)))));
    } else {
      return cons(car(l), insertRStar(nyoo, old, cdr(l)));
    }
  } else {
    return cons(insertRStar(nyoo, old, car(l)), insertRStar(nyoo, old, cdr(l)));
  }
}

// returns a count of the number of occurences of a in a list l of abitrary depth
GLOBAL.occurStar = function(a, l) {
  if (isNull(l)) {
    return 0;
  } else if (isAtom(car(l))) {
    if (isEq(car(l), a)) {
      return add1(occurStar(a, cdr(l)))
    } else {
      return occurStar(a, cdr(l));
    }
  } else {
    return plus(occurStar(a, car(l)), occurStar(a, cdr(l)));
  }
}

// substitutes every occurence of old with nyoo in list l of abitrary depth
GLOBAL.substStar = function(nyoo, old, l) {
  if (isNull(l)) {
    return quote();
  } else if (isAtom(car(l))) {
    if (isEq(car(l), old)) {
      return cons(nyoo, substStar(nyoo, old, cdr(l)));
    } else {
      return cons(car(l), substStar(nyoo, old, cdr(l)));
    }
  } else {
    return cons(substStar(nyoo, old, car(l)), substStar(nyoo, old, cdr(l)));
  }
}

// inserts nyoo to the left of all occurences of old in a list l of abitrary depth
GLOBAL.insertLStar = function(nyoo, old, l) {
  if (isNull(l)) {
    return quote();
  } else if (isAtom(car(l))) {
    if (isEq(car(l), old)) {
      return cons(nyoo, cons(old, insertLStar(nyoo, old, cdr(l))));
    } else {
      return cons(car(l), insertLStar(nyoo, old, cdr(l)));
    }
  } else {
    return cons(insertLStar(nyoo, old, car(l)), insertLStar(nyoo, old, cdr(l)))
  }
}

// returns true if a can be found in a list l of abitrary depth
GLOBAL.isMember = function(a, l) {
  if (isNull(l)) {
    return false;
  } else if (isAtom(car(l))) {
    if (isEq(car(l), a)) {
      return true;
    } else {
      return isMember(a, cdr(l));
    }
  } else {
    return (isMember(a, car(l)) || isMember(a, cdr(l)));
  }
}

// returns the leftmost atom in a list l of abitrary depth
GLOBAL.leftmost = function(l) {
  if (isAtom(car(l))) {
    return car(l);
  } else {
    return leftmost(car(l));
  }
}

// determines if two lists are equal
GLOBAL.isEqlist = function(l1, l2) {
  if (isNull(l1) && isNull(l2)) {
    return true;
  } else if (isNull(l1) || isNull(l2)) {
    return false;
  } else {
    return (isEqual(car(l1), car(l2)) && isEqlist(cdr(l1), cdr(l2)));
  }
}

// a generic equality tester for two S-expressions
GLOBAL.isEqual = function(s1, s2) {
  if (isAtom(s1) && isAtom(s2)) {
    return isEqan(s1, s2);
  } else if (isAtom(s1) || isAtom(s2)) {
    return false;
  } else{
    return isEqlist(s1, s2);
  }
}

// modified rember to work with any S-expression and list, rather than the special
// case of atom and lat
GLOBAL.rember = function(s, l) {
  if (isNull(l)) {
    return quote();
  } else if (isEqual(s, car(l))) {
    return cdr(l);
  } else {
    return cons(car(l), rember(s, cdr(l)));
  }
}
