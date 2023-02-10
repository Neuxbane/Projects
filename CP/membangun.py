N = int(input('[N] Jumlah lahan: '));
Lahan = [ (i+1)/2 if i%2 else N+1-i/2 for i in range(N)]
print(Lahan)