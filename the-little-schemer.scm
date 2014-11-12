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
  (cond
    ((null? l) #t)
    ((atom? (car l)) (lat? (cdr l)))
    (else #f)))
