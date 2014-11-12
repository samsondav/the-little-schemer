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

; subst test
(define lat '(ice cream with fudge for dessert))
(subst 'topping 'fudge lat)


(define (multirember a lat)
  ; removes all elements equal to a from lat
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) a) (multirember a (cdr lat)))
    (else (cons (car lat) (multirember a (cdr lat))))))

; multirember test
(define lat2 '(coffee cup tea cup and hick cup))
(multirember 'cup lat2)


(define (multiinsertR new old lat)
  ; return a new version of lat with new inserted to the right of all elements of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons old (cons new (multiinsertR new old (cdr lat)))))
    (else (cons (car lat) (multiinsertR new old (cdr lat))))))

;multiinsertR test
(multiinsertR 'brown 'cup lat2)


(define (multiinsertL new old lat)
  ; return a new version of lat with new inserted to the left of all elements of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons new (cons old (multiinsertL new old (cdr lat)))))
    (else (cons (car lat) (multiinsertL new old (cdr lat))))))

;multiinsertL test
(multiinsertL 'brown 'cup lat2)


(define (multisubst new old lat)
  ; return a new version of lat with new inserted to the left of all elements of old
  (cond
    ((null? lat) (quote ()))
    ((eq? (car lat) old) (cons new (multisubst new old (cdr lat))))
    (else (cons (car lat) (multisubst new old (cdr lat))))))

;multisubst test
(multisubst 'brown 'cup lat2)

; Numbers Games
