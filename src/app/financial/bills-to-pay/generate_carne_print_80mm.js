var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
var divs = document.getElementsByTagName('div');
var divsCarne = [];
var boleto = undefined;

 for (var i = 0; i < divs.length; i++) {
  if (divs[i].id.toString().indexOf("Carne") !== - 1)  {
    let billToPayPaymentId = divs[i].id.substr(divs[i].id.indexOf("_") + 1, divs[i].id.length - 1);
    divsCarne.push(divs[i].innerHTML);
    /* console.log(document.getElementById("tdBilletCarneBarCode80mm_" + billToPayPaymentId));
    var codeBarTd = divs[i].getElementsByClassName("billetNumber80mm")[0];
    console.log(codeBarTd);
    if (codeBarTd !== undefined) {
      console.log(codeBarTd.textContent);
      if (document.getElementById("tdBilletCarneBarCode80mm_" + billToPayPaymentId).childElementCount === 0) {
        new Boleto(codeBarTd.textContent)
            .toSVG('#tdBilletCarneBarCode80mm_' + billToPayPaymentId);        
      }
    } */
  } 
}

var output = document.getElementById("ifrListOutput80mm").contentWindow;
  // var test = document.getElementById("tableCarnebillet80mm_0").innerHTML;
  output.document.open();
  output.document.write(`
      <html>
        <head>
        <style>
        @page { size: portrait; }
        .logo{
          text-align: center; height: 10mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000
        }
        @page  {
          margin: 0; size: landscape;
        }
        .img-logo {
          /*content: url('http://www.inovemoveis.com.br/franquias/2/14830/editor-html/575822.jpg');*/
          /*content: url('../../../assets/images/logo_caixa.png');*/
        }
        .bankCode {
          font-size: 5mm; font-family: arial, verdana; font-weight : bold;
          font-style: italic; text-align: center; vertical-align: bottom;
          padding-right: 1mm; border-right: 1mm solid #000000; border-bottom: 1mm solid #000000
        }
        .bankCode2 {
          font-size: 5mm; font-family: arial, verdana; font-weight : bold;
          font-style: italic; text-align: center; vertical-align: bottom;
          /*border-bottom: 1.2mm solid #000000; border-right: 1.2mm solid #000000;*/
        }
        .billetNumber {
          font-size: 3.2mm; font-family: arial, verdana; font-weight : bold;
          text-align: center; vertical-align: bottom; padding-bottom : 1mm;
          border-bottom: 1mm solid #000000;
        }
        .billetRightHeader {
          font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
          border-bottom: 1mm solid #000000; font-weight : bold;
        }
        .billetRightHeader2 {
          font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
        }
        .billetRightField {
          font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
          border-left: 0.15mm solid #000000;
        }
        .billetRightFieldBorderNone {
          font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
        }
        .billetLeftField2 {
          font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm; border-left: 0.15mm solid #000000;
        }
        .billetLeftField {
          font-size: 0.2cm; font-family: arial, verdana; padding-left : 1mm;
        }
        .billetLeftValue {
          font-size: 0.29cm; font-family: arial, verdana; padding-left : 1mm;
          border-left: 0.15mm solid #000000; border-bottom: 0.15mm solid #000000;
          font-weight: bold;
        }
        .billetLeftValueBorderNone {
          font-size: 0.29cm; font-family: arial, verdana; padding-left : 1mm;
          font-weight: bold;
        }
        .billetLeftValue2 {
          font-size: 3mm; font-family: arial, verdana; padding-left : 1mm;
          text-align: center; font-weight: bold; border-left: 0.15mm solid #000000;
          border-bottom: 0.15mm solid #000000;
        }
        .billetLeftValue3 {
          font-size: 0.29cm; font-family: arial, verdana; padding-left : 1mm;
          text-align: left; font-weight: bold; border-left: 0.15mm solid #000000;
        }
        .billetRightTextValue {
          font-size: 0.29cm; font-family: arial, verdana; text-align:right;
          padding-right: 1mm; font-weight: bold; border-left: 0.15mm solid #000000; 
          border-bottom: 0.15mm solid #000000;
        }
        .billetLeftTextValue2 {
          font-size: 0.29cm; font-family: arial, verdana;
          padding-left: 1mm; font-weight: bold; border-left: 0.15mm solid #000000;
        }
        .tr-border-bottom {
          border-bottom: 0.15mm solid #000000;
        }
        .logo80mm{
          text-align: left;  border-right: 0.15mm solid #000000; 
          border-bottom: 0.15mm solid #000000; width: 60px
        }
        .bankCode80mm {
          font-size: 3mm; font-family: arial, verdana; font-weight : bold;
          font-style: italic; text-align: center; vertical-align: bottom;
          border-right: none; border-bottom: 0.15mm solid #000000;
        }
        .billetNumber80mm {
              font-size: 3mm;
            font-family: arial, verdana;
            font-weight: bold;
            vertical-align: bottom;
            border-bottom: 0.15mm solid #000000;
            padding-bottom: 0.5px;    
            padding-left: 1px;
        }
        .billetRightField80mm {
          font-size: 0.2cm; font-family: arial, verdana;
          height: 0.2cm;
          border-left: 0.15mm solid #000000; margin: 0px;
          padding-left: 0.05cm;
        }
        .billetLeftValue80mm {
          font-size: 0.20cm; font-family: arial, verdana;
          text-align: center; font-weight: bold; border-left: 0.15mm solid #000000;
          border-bottom: 0.15mm solid #000000;
          margin: 0px;padding: 0px;
        }
        .trBillet80mm {
            display: table-caption; width: 920px; max-height: 8px !important;
        }
        #tableListCarne {
          white-space: nowrap !important;
        }
        #tableListCarne tr {
          line-height: 70%;
        }
        #tableListCarne svg {
          height: 60% !important;
          max-height: 35px;
        }
        </style>          
        </head>
    <body>${divsCarne}</body>
      </html>`);
  output.document.close();
  output.focus();
  output.print();

