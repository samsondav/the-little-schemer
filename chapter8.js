"use strict;"

// a version of rember that accepts a function (compare) as a comparator
// removes the first element where compare(a, element) returns true
GLOBAL.rember_f = function(compare, a, l) {
  if (isNull(l)) {
    return quote();
  } else if (compare(a, car(l))) {
    return cdr(l);
  } else {
    return cons(car(l), rember_f(compare, a, cdr(l)));
  }
}

// constructs a function that tests if a is equal to the supplied argument
// (a 'Curry' function is a single argument constructor or factory function that
// returns another funtion)
GLOBAL.isEq_curry = function(a) {
  return function(x) {
    return isEq(a, x);
  }
}

// Now we are entering the world of programmatically generated lambdas.
// HERE BE DRAGONS

// builds a function that tests if an atom isEqual to salad
var k = 'salad';
GLOBAL.isEq_salad = isEq_curry(k);

isEq_salad('salad'); // => true
isEq_salad('tuna'); // => false

// rewrite rember_f as a curry function
// it builds a function with the supplied comparison function baked in
GLOBAL.rember_f_curry = function(compare) {
  return function(a, l) {
    if (isNull(l)) {
      return quote();
    } else if (compare(a, car(l))) {
      return cdr(l);
    } else {
      return cons(car(l), rember_f_curry(compare)(a, cdr(l)));
    }
  };
}

// we can build a rember function that uses isEq as a comparator, then call it
GLOBAL.rember_isEq = rember_f_curry(isEq);

rember_isEq('tuna', ['tuna', 'salad', 'is', 'good']) // => [ 'salad', 'is', 'good' ]

// or we can build the function and then call it immediately, inline
var a = 'tuna'
var l = [ 'shrimp', 'salad', 'and', 'tuna', 'salad' ]

rember_f_curry(isEq)(a, l) // => [ 'shrimp', 'salad', 'and', 'salad' ]
