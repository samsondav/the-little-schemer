#lang scheme
; Chapter 1

(define atom?
  (lambda (x)
    (cond
      ((null? x) #f)
      ((pair? x) #f)
      (else #t))))

; Chapter 2

(define (lat? l)
  ; returns true if lat is a list of atoms
  (cond
    ((null? l) #t)
    ((atom? (car l)) (lat? (cdr l)))
    (else #f)))

(define (member? a lat)
  ; returns true if a is a member of lat
  (cond
    ((null? lat) #f)
    ((eq? (car lat) a) #t)
    (else (member? a (cdr lat)))))

; Chapter 3

(define (rember a lat)
  ; retuns a new list like lat but with the first instance of a removed
  (cond
    ((null? lat) (quote ()))
    ((eq? a (car lat)) (cdr lat))
    (else (cons (car lat) (rember a (cdr lat))))))

(define (firsts l)
  ; Takes one argument, a list which is either the null list or a list of non-empty lists
  ; Returns a new list composed of the first S-expression of every contained list
  (cond
    ((null? l) (quote()))
    (else (cons (car (car l)) (firsts (cdr l))))))

(define (insertR new old lat)
  ; Returns a new list with new inserted to the right of the first occurence of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons old (cons new (cdr lat))))
    (else (cons (car lat) (insertR new old (cdr lat))))))

(define (insertL new old lat)
  ; Like insertR but inserts left
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons new (cons old (cdr lat))))
    (else (cons (car lat) (insertL new old (cdr lat))))))

(define (subst new old lat)
  ; like insertR but substitutes new for old instead of inserting
  (cond
    ((null? lat) (quote()))
    ((eq? (car lat) old) (cons new (cdr lat)))
    (else (cons (car lat) (subst new old (cdr lat))))))

(define (multirember a lat)
  ; removes all elements equal to a from lat
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) a) (multirember a (cdr lat)))
    (else (cons (car lat) (multirember a (cdr lat))))))

(define (multiinsertR new old lat)
  ; return a new version of lat with new inserted to the right of all elements of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons old (cons new (multiinsertR new old (cdr lat)))))
    (else (cons (car lat) (multiinsertR new old (cdr lat))))))

(define (multiinsertL new old lat)
  ; return a new version of lat with new inserted to the left of all elements of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons new (cons old (multiinsertL new old (cdr lat)))))
    (else (cons (car lat) (multiinsertL new old (cdr lat))))))

(define (multisubst new old lat)
  ; return a new version of lat with new inserted to the left of all elements of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons new (multisubst new old (cdr lat))))
    (else (cons (car lat) (multisubst new old (cdr lat))))))



;tester
(define (test-fns list-of-tests)
  ; takes a list of triples (function, argument and expected) and returns true only
  ; if all function outputs match the expected result
  (define (test-fn test)
    (let
      ([fn (car test)]
       [args (cadr test)]
       [expected (caddr test)])
      (equal? (apply fn args) expected))
  )
  (cond
    ((null? list-of-tests) #t)
    (else
      (and (test-fn (car list-of-tests)) (test-fns (cdr list-of-tests))))))

; tests for the tester
(let ([lat '(coffee cup tea cup and hick cup)])
  (test-fns (list (list identity (list lat) '(coffee cup tea cup and hick cup))
                  (list identity '(0) 0))))

; tests for chapter 3
(let
  ([lat '(ice cream with fudge for dessert)]
   [lat2 '(coffee cup tea cup and hick cup)])
  (test-fns (list
    (list multisubst (list 'brown 'cup lat2) '(coffee brown tea brown and hick brown))
    (list multiinsertL (list 'brown 'cup lat2) '(coffee brown cup tea brown cup and hick brown cup))
    (list multiinsertR (list 'brown 'cup lat2) '(coffee cup brown tea cup brown and hick cup brown))
    (list multirember (list 'cup lat2) '(coffee tea and hick))
    (list subst (list 'topping 'fudge lat) '(ice cream with topping for dessert)))))


; Chapter 4

(define (add1 n)
  (cond
    ((not (integer? n)) (raise "Argument to add1 must be an integer."))
    ((< n 0) (raise "Argument to add1 must be positive"))
    (else (+ n 1))))

(define (sub1 n)
 (cond
    ((not (integer? n)) (raise "Argument to sub1 must be an integer."))
    ((<= n 0) (raise "Argument to sub1 must be positive and cannot be zero"))
    (else (- n 1))))

(define (p+ n m)
  ; adds two integers using Peano arithmetic
  (cond
    ((zero? m) n)
    (else (add1 (p+ n (sub1 m))))))

(define (p- n m)
  ; subtracts m from n using Peano arithmetic
  (cond
    ((zero? m) n)
    (else (sub1 (p- n (sub1 m))))))

(define (addtup tup)
  (cond
    ((null? tup) 0)
    (else (p+ (car tup) (addtup (cdr tup))))))

(define (p* n m)
  (cond
    ((zero? m) 0)
    (else (p+ n (p* n (sub1 m))))))

(define (tup+ tup1 tup2)
  ; sums two tups of equal length elementwise
  (cond
    ((null? tup1) tup2)
    ((null? tup2) tup1)
    (else (cons (p+ (car tup1) (car tup2))
    (tup+ (cdr tup1) (cdr tup2))))))

(define (> n m)
  (cond
    ((and (zero? m) (zero? n)) #f)
    ((zero? m) #t)
    ((zero? n) #f)
    (else (> (sub1 n) (sub1 m)))))

(define (< n m)
  (cond
    ((and (zero? m) (zero? n)) #f)
    ((zero? n) #t)
    ((zero? m) #f)
    (else (> (sub1 n) (sub1 m)))))

(define (= n m)
  (cond
    ((> n m) #f)
    ((< n m) #f)
    (else #t)))

(define (expt n m)
  (cond
    ((zero? m) 1)
    (else (p* n (expt n (sub1 m))))))

(define (quotient n m)
  (cond
    ((< n m) 0)
    (else (add1 (quotient (p- n m) m)))))

(define (length lat)
  (cond
    ((null? lat) 0)
    (else (add1 (length (cdr lat))))))

(define (pick n lat)
  (cond
    ((zero? (sub1 n)) (car lat))
    (else (pick (sub1 n) (cdr lat)))))

(define (rempick n lat)
  (cond
    ((zero? (sub1 n)) (cdr lat))
    (else (cons (car lat) (rempick (sub1 n) (cdr lat))))))

(define (no-nums lat)
  (cond
    ((null? lat) '())
    (else (cond
            ((number? (car lat)) (no-nums (cdr lat)))
            (else (cons (car lat) (no-nums (cdr lat))))))))

(define (all-nums lat)
  (cond
    ((null? lat) '())
    (else (cond
            ((number? (car lat)) (cons (car lat) (all-nums (cdr lat))))
            (else (all-nums (cdr lat)))))))

(define (eqan? a1 a2)
  (cond
    ((and (number? a1) (number? a2)) (= a1 a2))
    ((or (number? a1) (number? a2)) #f)
    (else (eq? a1 a2))))

(define (occur a lat)
  (cond
    ((null? lat) 0)
    ((eq? (car lat) a) (add1 (occur a lat)))
    (else (occur a (cdr lat)))))

(define (one? n)
  (= n 1))

(define (rempick-one n lat)
  (cond
    ((one? n) (cdr lat))
    (else (cons (car lat) (rempick (sub1 n) (cdr lat))))))


; Chapter 4 tests
(print "Testing Chapter 4...")
(newline)
(test-fns (list
  (list p+ '(4 5) 9)
  (list p- '(5 4) 1)
  (list add1 '(3) 4)
  (list sub1 '(3) 2)
  (list addtup '((1 2 3 4 5)) 15)
  (list p* '(2 3) 6)
  (list tup+ '((1 2 3) (4 5 6)) '(5 7 9))))

; Chapter 5

(define (rember* a l)
  (cond
    ((null? l) '())
    ((atom? (car l))
     (cond
       ((eq? (car l) a) (rember* a (cdr l)))
       (else (cons (car l) (rember* a (cdr l))))))
    (else (cons (rember* a (car l)) (rember* a (cdr l))))))

(define (insertR* new old l)
  (cond
    ((null? l) '())
    ((atom? (car l))
     (cond
       ((eq? (car l) old) (cons old (cons new (insertR* new old (cdr l)))))
       (else (cons (car l) (insertR* new old (cdr l)))))
     (else (cons (insertR* (car l)) (insertR* (cdr l)))))))

(define (occur* a l)
  (cond
    ((null? l) '())
    ((atom? (car l))
     (cond
       ((eq? a (car l)) (add1 (occur* a (cdr l))))
       (else (occur* a (cdr l)))))
    (else
     (p+ (occur* a (car l)) (occur* a (cdr l))))))

(define (subst* new old l)
  (cond
    ((null? l) '())
    ((atom? (car l))
     (cond
       ((eq? old (car l)) (cons new (subst* new old (cdr l))))
       (else (cons (car l) (subst* new old (cdr l))))))
    (else
     (cons (subst* new old (car l)) (subst* new old (cdr l))))))

(define (insertL* new old l)
  (cond
    ((null? l) '())
    ((atom? (car l))
     (cond
       ((eq? old (car l)) (cons new (cons old (insertL* new old (cdr l)))))
       (else (cons (car l) (insertL* new old (cdr l))))))
    (else
     (cons (insertL* new old (car l)) (insertL* new old (cdr l))))))
       
(define (member* a l)
  (cond
    ((null? l) #f)
    ((atom? (car l))
     (cond
       ((eq? a (car l)) #t)
       (else (member* a (cdr l)))))
    (else
     (or (member* a (car l)) (member* a (cdr l))))))

(define (leftmost l)
  (cond
    ((atom? (car l)) (car l))
    (else (leftmost (car l)))))

(define (equal? s1 s2)
  ; a generic equality test that works for any two s-expressions
  (cond
    ((and (atom? s1) (atom? s2)) (eqan? s1 s2))
    ((or (atom? s1) (atom? s2)) #f)
    (else
     (eqlist? s1 s2))))

(define (eqlist? l1 l2)
  (cond
    ((and (null? l1) (null? l2)) #t)
    ((or (null? l1) (null? l2)) #f)
    (else
     ((and (equal? (car l1) (car l2))
           (eqlist? (cdr l1) (cdr l2)))))))

(define (rember-sexp s l)
  ; a rember using the new equal? that works with any s-expression
  (cond
    ((null? l) '())
    ((equal? (car l) s) (cdr l))
    (else
     (cons (car l) (rember-sexp s (cdr l))))))



(print "Testing Chapter 5...")
(newline)
(let
    ([l '(((tomato sauce)) ((bean) sauce) (and ((flying)) sauce))])
  (test-fns
   (list
    (list rember* (list 'sauce l) '(((tomato)) ((bean)) (and ((flying)))) ))))

