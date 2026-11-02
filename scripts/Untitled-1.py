# def Partition(A,p,r):
#     i = p-1
#     x = A[r]

#     for j in range(p,r):
#         if A[j] < x:
#             i+=1
#             temp = A[i]
#             A[i] = A[j]
#             A[j] = temp
#     A[r] = A[i+1]
#     A[i+1] = x
#     return i+1

# def QuickSort(A,p,r):
#     if p <= r:
#         b = Partition(A, p,r)
#         QuickSort(A, p , b-1)
#         QuickSort(A,b+1,r)

# def main():
#     X = [7, 3 ,8, 1 , 4 , 2 , 5]
#     print ("Original = ", X)
#     QuickSort(X,0,6)
#     print ("Quick Sorted = ", X)
# if __name__ == "__main__":
#     main()


def CountingSort(A,B,k):
    A.insert(0,0)
    B.insert(0,0)
    # your code is here
    C=[]
    for i in range(0,k+1):
        C.insert(i,0)
    print(C)
    for i in range(1, len(A)):
        C[A[i]] +=1
    print(C)
    for i in range(1, k+1):
        C[i]= C[i] + C[i-1]
    print (C)
    for j in range(len(A)-1, 0, -1):
        B[C[A[j]]] = A[j]
        C[A[j]] -=1
    print(B)

    A.pop(0)
    B.pop(0)

def main():
    X = [7, 3 ,8, 1 , 4 , 2 , 5]
    X = [7, 3 ,8, 1 , 4 , 2 , 5]
    Y = [0] * len(X)
    print ("Original = ", X)
    CountingSort(X,Y,8)
    print ("Counting Sorted = ", Y)
if __name__ == "__main__":
    main()