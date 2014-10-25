"use strict";

GLOBAL.isLat = function(l) {
  if (isNull(l)) {
    return true;
  } else if (isAtom(car(l))) {
    return isLat(cdr(l));
  } else {
    return false;
  }
}

GLOBAL.isMember = function(a, lat) {
  if (isNull(lat)) {
    return false;
  } else {
    return (isEq(car(lat), a) || isMember(a, cdr(lat)));
  }
}

