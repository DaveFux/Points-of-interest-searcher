window.onload = boot;

// chave autenticadora necessária para aceder à informação da api
const autenticador = "Esturbilho";

// Elementos do html
var idTextSearch, idSearchButton, idNearbyButton, idBottomSection, idSubTitulo;
var failed = false;

function $(id) {
    var element = document.getElementById(id);
    // verifica se o elemento é null ou não
    var bool = element !== null;
    if (!bool) {
        alert("Não foi possivel carregar o elemento com id: " + id);
        failed = true;
        return;
    }
    return element;
}

function boot() {
    idTextSearch = $("textSearch");
    idSearchButton = $("searchButton");
    idNearbyButton = $("nearbyButton");
    idBottomSection = $("bottom");
    idSubTitulo = $("subTitulo");

    idSearchButton.onclick = function () {
        sendRequest("search", idTextSearch.value, undefined);
    }

    idNearbyButton.onclick = function () {

    }
}

function tratarDadosXML(dadosXML) {
    var xmlDoc;
    if (navigator.userAgent.indexOf('NET') == -1) { // verifica se se trata de um browser diferente do IE
        parser = new DOMParser(); // cria a instancia (objeto) do parser XML->DOM
        xmlDoc = parser.parseFromString(dadosXML, "text/xml")
    } else {
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.loadXML(dadosXML);
    }
    return xmlDoc;
}

function sendRequest(service, key1, key2) {
    console.log(key1);
    var xmlhttp = new XMLHttpRequest();
    var url;
    key2 === undefined ? url = "http://api.geonames.org/" + service + "?name=" +
        key1 + "&username=" + autenticador : url = "http://api.geonames.org/" + service +
        "?lat=" + key1 + "&lng=" + key2 + "&username=" + autenticador;
    console.log(url);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (key2 === undefined) idSubTitulo.innerHTML = "Resultados da pesquisa para: " + key1;
            idTextSearch.value = "";
            var divTexto = document.createElement("div");
            service === "search" ? checkCoords(tratarDadosXML(xmlhttp.responseText)) :
                showData(tratarDadosXML(xmlhttp.responseText))
            idBottomSection.appendChild(divTexto);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function checkCoords(DOMDoc) {
    if (navigator.userAgent.indexOf('NET') == -1) { // verifica se se trata de um browser diferente do IE
        var evaluator = new XPathEvaluator();
        var lat = evaluator.evaluate("//lat/child::text()", DOMDoc, null,
            XPathResult.STRING_TYPE, null);
        console.log(lat.stringValue);
        var lng = evaluator.evaluate("//lng/child::text()", DOMDoc, null,
            XPathResult.STRING_TYPE, null);
        console.log(lng.stringValue);
        sendRequest("findNearbyPOIsOSM", lat.stringValue, lng.stringValue);
    } else {

    }
}

function showData(DOMDoc) {
    if (navigator.userAgent.indexOf('NET') == -1) { // verifica se se trata de um browser diferente do IE

    } else {

    }
}