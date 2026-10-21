import sys  
with open('js/app.js', 'r', encoding='utf-8') as f:  
    c = f.read()  
s = c.find('function renderTablaClientes()')  
if s == -1:  
    print('No encontrado')  
    sys.exit(1)  
b = 0  
inf = False  
e = s  
for i, ch in enumerate(c[s:], s):  
    if ch == '{':  
        b += 1  
        inf = True  
    elif ch == '}':  
        b -= 1  
        if inf and b == 0:  
            e = i + 1  
            break  
