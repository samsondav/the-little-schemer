#lang racket

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

; add1 / sub1 test
;

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

; test p+ / p-


