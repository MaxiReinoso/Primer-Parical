const fs = require('fs')  
let c = fs.readFileSync('js/app.js', 'utf8')  
let s = c.indexOf('function renderTablaClientes()')  
if (s === -1) { console.log('No encontrado'); process.exit(1); }  
let b1 = c.indexOf('}', s)  
let b2 = c.indexOf('}', b1 + 1)  
let e = b2 + 1  
