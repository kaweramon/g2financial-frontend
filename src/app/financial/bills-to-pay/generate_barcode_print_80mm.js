var number = '34195.00008 01233.203189 64221.470004 5 84410000002000';
document.getElementById("tdBilletBarCode80mm").textContent = "";
new Boleto(document.getElementById("tdBilletCodeBar80mmValue").textContent).toSVG('#tdBilletBarCode80mm');
var output = document.getElementById("ifrOutput80mm").contentWindow;
var printContent = document.getElementById("tablebillet80mm").innerHTML;
output.document.open();
output.document.write(`
      <html>
        <head>
          <style>
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
            padding-top: 2px; 
            border-bottom: 0.15mm solid #000000; 
          }
          .bankCode80mm {
            font-size: 5mm; font-family: arial, verdana; font-weight : bold;
            font-style: italic; text-align: center; vertical-align: bottom;
            border-right: none; border-bottom: 0.15mm solid #000000;
          }
          .billetNumber80mm {
                font-size: 5mm;
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
          #tableBillet80 {
            white-space: nowrap !important;
          }
          #tableBillet80 tr {
            line-height: 80%;
          }
          #tableBillet80 svg {
            height: 60% !important;
          }
          </style>          
        </head>
    <body>${printContent}</body>
      </html>`);
output.document.close();
output.focus();
output.print();
document.getElementById('ifrOutput80mm').style.display = 'none';
