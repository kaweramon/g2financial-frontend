var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
// console.log(document.getElementById("tdCodeBar").innerHTML.replace(/([.*+?^$|(){}\[\]-])/mg, "").replace(" ", ""));
console.log(document.getElementById("tdCodeBar").textContent);
console.log(document.getElementById("boleto").textContent);
new Boleto(document.getElementById("tdCodeBar").textContent).toSVG('#boleto');

