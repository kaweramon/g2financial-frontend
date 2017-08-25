var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
// console.log(document.getElementById("tdCodeBar").innerHTML.replace(/([.*+?^$|(){}\[\]-])/mg, "").replace(" ", ""));
console.log(document.getElementById("tdCodeBar").textContent);
//TODO rever os pontos do boleto
// new Boleto('03399.66525 84000.000004 11124.401024 5 62990000036146').toSVG('#boleto');
new Boleto(document.getElementById("tdCodeBar").textContent).toSVG('#boleto');
