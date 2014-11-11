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

// we can build a rember function that uses isEq as a comparator, assign it to
// a variable and then call it
GLOBAL.rember_isEq = rember_f_curry(isEq);

rember_isEq('tuna', ['tuna', 'salad', 'is', 'good']) // => [ 'salad', 'is', 'good' ]

// or we can build the function and then call it immediately, inline
var a = 'tuna'
var l = [ 'shrimp', 'salad', 'and', 'tuna', 'salad' ]

rember_f_curry(isEq)(a, l) // => [ 'shrimp', 'salad', 'and', 'salad' ]

// insertL rewritten to use a supplied comparator function
// i.e. insert nyoo to the left of old where compare(element, old) returns true
GLOBAL.insertL_f = function(compare) {
  return function(nyoo, old, l) {
    if (isNull(l)) {
      return quote();
    } else if (compare(car(l)), old) {
      return cons(nyoo, cons(car(l), cdr(l)));
    } else {
      return cons(car(l), insertL_f(compare)(nyoo, old, cdr(l)));
    }
  }
}

// similar to above, but for insertR
GLOBAL.insertR_f = function(compare) {
  return function(nyoo, old, l) {
    if (isNull(l)) {
      return quote();
    } else if (compare(car(l), old)) {
      return cons(car(l), cons(nyoo, cdr(l)));
    } else {
      return cons(car(l), insertR_f(compare)(nyoo, old, cdr(l)));
    }
  }
}

// generates a function that inserts either to left or to right depending on
// supplied combination function
// e.g. combine(nyoo, old, [apple]) => [nyoo, old, apple]
GLOBAL.insert_g = function(combine) {
  return function(nyoo, old, l) {
    if (isNull(l)) {
      return quote();
    } else if (isEqual(car(l), old)) {
      return combine(nyoo, old, cdr(l));
    } else {
      return cons(car(l), insert_g(combine)(nyoo, old, cdr(l)));
    }
  }
}

// an example combine function that inserts nyoo to the left of old
GLOBAL.seqL = function(nyoo, old, l) {
  return cons(nyoo, cons(old, l));
}

// as above but inserts nyoo to the right of old
GLOBAL.seqR = function(nyoo, old, l) {
  return cons(old, cons(nyoo, l));
}

// We can define insertL and insertR using insert_g and the above combine functions
var insertL_2 = insert_g(seqL);
var insertR_2 = insert_g(seqR);

// or even pass the raw function as an argument directly
var insertL_3 = insert_g(function(nyoo, old, l) {
  return cons(nyoo, cons(old, l));
});

// this combine function ignores old and can be used to replace old with nyoo (aka subst)
GLOBAL.seqS = function(nyoo, old, l) {
  return cons(nyoo, l);
}

// we can redefine subst using insert_g
var subst_2 = insert_g(seqS);

// we can even redefine rember using insert_g
var seqRem = function(nyoo, old, l) {
  return l;
}

var rember_2 = function(a, l) {
  insert_g(seqRem)(false, a, l); // false is a placeholder because nyoo is not used by seqRem
}

// We can rewrite functions with repeated logic by abstracting out common patterns
// with a new function

// this helper function contains logic extracted from value (chapter 6)
// it returns the appropriate math function based on an atom operator
GLOBAL.atom_to_function = function(x) {
  if (isEq(x, '+')) {
    return plus;
  } else if (isEq(x, 'x')) {
    return multiply;
  } else { // assumed '^'
    return expt;
  }
}

// helper methods for math nexps of the form [a, operator, b]
GLOBAL.operator = function(nexp) {
  return car(cdr(nexp));
}

GLOBAL.first_sub_exp = function(nexp) {
  return car(nexp);
}

GLOBAL.second_sub_exp = function(nexp) {
  return car(cdr(cdr(nexp)));
}

// example use:
var nexp = [5, '+', 3];
atom_to_function(operator(nexp)); // => function (the plus function)

// Now we can redefine value from chapter 6
GLOBAL.value = function(nexp) {
  if (isAtom(nexp)) {
    return nexp;
  } else {
    return atom_to_function(operator(nexp)) // call with...
                           (value(first_sub_exp(nexp)), value(second_sub_exp(nexp)));
  }
}

value([5, '+', 3]) // => 8
value([5, 'x', 3]) // => 15
value([5, 'expt', 3]) // => 125

// We can write multirember_f which builds a multirember that removes all elements
// using an abitrary comparator
GLOBAL.multirember_f = function(compare) {
  return function(a, lat) {
    if (isNull(lat)) {
      return quote();
    } else if (compare(car(lat), a)) {
      return multirember_f(compare)(a, cdr(lat));
    } else {
      return cons(car(lat), multirember_f(compare)(a, cdr(lat)));
    }
  }
}

// now we can call it with any comparison function
var test = isEqual;
var multirember_isEqual = multirember_f(test);

var a = 'tuna';
var lat = [ 'shrimp', 'salad', 'tuna', 'salad', 'and', 'tuna' ]

multirember_isEqual(a, lat) // => [ 'shrimp', 'salad', 'salad', 'and' ]

// we can rewrite multirember_f to take a comparator that includes the atom to be
// compared

// a function that takes one argument and tests if it is equal to 'tuna'
GLOBAL.isEq_tuna = isEq_curry('tuna');

// a multirember that takes an encapsulated comparator like isEq_tuna
GLOBAL.multirember_T = function(encapscompare, lat) {
  if (isNull(lat)) {
    return quote();
  } else if (encapscompare(car(lat))) {
    return multirember_T(encapscompare, cdr(lat));
  } else {
    return cons(car(lat), multirember_T(encapscompare, cdr(lat)));
  }
}

// so a multirember that removes all elements called 'tuna' can be generated like
// this

var multirember_tuna = (function(encapscompare) {
  return function(lat) {
    return multirember_T(encapscompare, lat);
  }
}(isEq_tuna)) // is the RESULT OF CALLING this function, not the function itself

multirember_tuna(lat); // => [ 'shrimp', 'salad', 'salad', 'and' ]

// And now for something that will fuck your mind.
//
// takes a function col (the collector) and... wat?
GLOBAL.multirember_and_co = function(a, lat, col) {
  if (isNull(lat)) {
    return col(quote(), quote());
  } else if (isEq(car(lat), a)) {
    return multirember_and_co(a, cdr(lat), function(newlat, seen) {
      return col(newlat, cons(car(lat), seen));
    });
  } else {
    return multirember_and_co(a, cdr(lat), function(newlat, seen) {
      return col(cons(car(lat), newlat), seen);
    });
  }
}

// perhaps it will be easier to read in coffeescript...

// GLOBAL.multirember_and_co = (a, lat, col) ->
//   if isNull(lat)
//     col quote(), quote()
//   else if isEq(car(lat), a)
//     multirember_and_co a, cdr(lat), (newlat, seen) ->
//       col newlat, cons(car(lat), seen)
//   else
//     multirember_and_co a, cdr(lat), (newlat, seen) ->
//       col cons(car(lat), newlat), seen

// let's analyse this beast starting with a very simple special case

// ignores the first argument completely and returns true if the second argument
// is null
var a_friend = function(newlat, seen) {
  return isNull(seen);
}

var a = 'tuna';
var lat = [];
var col = a_friend;

multirember_and_co(a, lat, col) // => true

// the above case returns true because lat is null, so a_friend is immediately used
// on two empty lists and returns true because the second argument is the empty
// list

// let's try another example
var a = 'tuna';
var lat = ['tuna'];
var col = a_friend;

multirember_and_co(a, lat, col) // => false

// this is more complicated.
// multirember_and_co asks isEq(car(lat), a) which is true
// so then it recurs with a as 'tuna', lat as [] and col as a new function, built
// from the old col with a car(lat) thrown in the mix.

// so on the first recursion, col looks like this:
var new_friend = function(newlat, seen) {
  return a_friend(newlat, cons('tuna', seen));
}

// on this recursion, lat is [] so multirember_and_co returns the result of
// new_friend applied to the two empty lists
// which returns false because seen in a_friend is now ['tuna'] which is not null

// third example
var a = "tuna";
var lat = ["and", "tuna"];
var col = a_friend;

multirember_and_co(a, lat, col) // => false

// this time we recur on the statement after else, because car(lat) is not tuna
// on the first recursion, col now looks like this:
var third_friend = function(newlat, seen) {
  return a_friend(cons('and', newlat), seen);
}

// we cons car(lat) onto newlat instead of seen as in the previous example
// recur again with lat as ["tuna"]
// now collect "tuna" onto seen
// recur again with lat as []
// return col on empty lists
// return false because the second list is ["tuna"] which is not the empty list

// So for the general case, what does multirember_and_co(a, lat, f) do?
// where f = function(ls1, ls2){...}
//
// it looks at every atom in the lat and checks if it is equal to a.
// If true, it collects it onto ls2, otherwise to ls1
// Each recursion builds f with the new values of ls1 and ls2
// At the termination condition, f is evaluated and the result is returned

// last example with new seed col
var last_friend = function(ls1, ls2) {
  return length(ls1);
}

var a = "tuna";
var lat = [ 'strawberries', 'tuna', 'and', 'swordfish' ];
var col = last_friend;
multirember_and_co(a, lat, col); // => 3

// because three things in the lat are not tuna, and are thus cons'd onto ls1

// TENTH COMMANDMENT: Build functions to collect more than one value at a time.

// insert nyoo to the left of any occurence of oldL and to the right of any
// occurence of oldR
GLOBAL.multiinsertLR = function(nyoo, oldL, oldR, lat) {
  if (isNull(lat)) {
    return quote();
  } else if (isEq(car(lat)), oldL) {
    return cons(nyoo, cons(car(lat), multiinsertLR(nyoo, oldL, oldR, cdr(lat))));
  } else if (isEq(car(lat)), oldR) {
    return cons(car(lat), cons(nyoo, multiinsertLR(nyoo, oldL, oldR, cdr(lat))));
  } else {
    return cons(car(lat), multiinsertLR(nyoo, oldL, oldR, cdr(lat)));
  }
}

// returns the value of col(newlat, leftInsertionCount, rightInsertionCount)
GLOBAL.multiinsertLR_and_co = function(nyoo, oldL, oldR, lat, col) {
  if (isNull(lat)) {
    return col(quote(), 0, 0); // after many recursions, col at this point will contain a cons and will recur on itself collecting up the terms
  } else if (isEq(car(lat), oldL)) {
    return multiinsertLR_and_co(nyoo, oldL, oldR, cdr(lat), function(newlat, L, R) {
      return col(cons(nyoo, cons(oldL, newlat)), add1(L), R); // build a new col from the old col with nyoo inserted to the left of oldL and increment L count. Then recur with cdr(lat)
    });
  } else if (isEq(car(lat), oldR)) {
    return multiinsertLR_and_co(nyoo, oldL, oldR, cdr(lat), function(newlat, L, R) {
      return col(cons(oldR, cons(nyoo, newlat)), L, add1(R)); // build a new col from the old col with nyoo inserted to the right of oldR and increment R count. Then recur with cdr(lat)
    });
  } else {
    return multiinsertLR_and_co(nyoo, oldL, oldR, cdr(lat), function(newlat, L, R) {
      return col(cons(car(lat), newlat), L, R); // build a new col from the old col with car(lat) cons'd onto newlat and counts unchanged. Then recur with cdr(lat)
    });
  }
}

var debug_col = function(newlat, L, R) {
  console.log('newlat: ' + newlat);
  console.log('L: ' + L);
  console.log('R: ' + R);
}
var lat = ['chips', 'and', 'fish', 'or', 'fish', 'and', 'chips']

multiinsertLR_and_co('salty', 'fish', 'chips', lat, debug_col)
// newlat: chips,salty,and,salty,fish,or,salty,fish,and,chips,salty
// L: 2
// R: 2

// returns true if a number is even
GLOBAL.isEven = function(n) {
  return isEqual(multiply(quotient(n, 2), 2), n);
}

// returns only even numbers from a list
GLOBAL.evensOnlyStar = function(l) {
  if (isNull(l)) {
    return quote();
  } else if (isAtom(car(l)) && isEven(car(l))) {
    return cons(car(l), evensOnlyStar(cdr(l)));
  } else if (isAtom(car(l))) {
    return evensOnlyStar(cdr(l));
  } else {
    return cons(evensOnlyStar(car(l)), evensOnlyStar(cdr(l)));
  }
}

// builds a nested list of even numbers by removing odd ones from its argument
// and simultaneously multiplies the even numbers and sums up the odd numbers
// that occur in its argument
GLOBAL.evensOnlyStar_and_co = function(l, col){
  if (isNull(l)) {
    return col(quote(), 1, 0); // null list
  } else if (isAtom(car(l))) {
    if (isEven(car(l))) { // even atom
      return evensOnlyStar_and_co(cdr(l), function(newL, product, sum) {
        return col(cons(car(l), newL), (multiply(product, car(l))), sum);
      });
    } else {  // odd atom
      return evensOnlyStar_and_co(cdr(l), function(newL, product, sum) {
        return col(newL, product, (plus(car(l), sum)));
      })
    }
  } else { // car(l) is a list, split and recur on the car and the cdr.
    // this will result in two different branches for the collector function... how will we combine these?
    return evensOnlyStar_and_co(car(l), function(aL, aProduct, aSum) {
      // the collector function for the recursion on car(l) includes a call to recur on cdr(l)
      return evensOnlyStar_and_co(cdr(l), function(dL, dProduct, dSum) {
        // here we combine the results from car(l) and cdr(l) to build the collector function for _this_ recursion
        return col(cons(aL, dL), multiply(aProduct, dProduct), plus(aSum, dSum));
      });
    });
  }
}

// initial col looks like
// var col = function(newL, product, sum) {
//   ...do something...
// }

var debug_col = function(newL, product, sum) {
  console.log('newL: ', newL);
  console.log('product: ' + product);
  console.log('sum: ' + sum);
};
var l = [[9, 1, 2, 8], 3, 10, [[9, 9], 7, 6], 2];

evensOnlyStar_and_co(l, debug_col)
// newL:  [ [ 2, 8 ], 10, [ [], 6 ], 2 ]
// product: 1920
// sum: 38
