function onBilletCheck(element) {
    if (element.checked) {
        document.getElementById("btnPrintCarne80mm").setAttribute("disabled", "disabled");
        setTimeout(function(){
            var tdsBarCode = document.getElementsByClassName('billetNumber80mm');
            var divsCarne = [];
            for (var i = 0; i < tdsBarCode.length; i++) {
                if (tdsBarCode[i].id.toString().indexOf(element.id) !== - 1) {
                    if (tdsBarCode[i] !== null && tdsBarCode[i].textContent.length > 0) {
                        new Boleto(tdsBarCode[i].textContent)
                            .toSVG('#tdBilletCarneBarCode80mm_' + element.id);        
                    }
                }
            }
            document.getElementById("btnPrintCarne80mm").removeAttribute("disabled");
        }, 1000);
    }
}