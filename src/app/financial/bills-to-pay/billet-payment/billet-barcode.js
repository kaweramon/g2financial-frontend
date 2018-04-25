var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
document.getElementById("boleto").textContent = "";
document.getElementById("tdBilletBarCode80mm").textContent = "";
new Boleto(document.getElementById("tdBilletCodeBar80mmValue").textContent).toSVG('#tdBilletBarCode80mm');
new Boleto(document.getElementById("tdCodeBar").textContent).toSVG('#boleto');
