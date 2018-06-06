window.onload = boot;

// chave autenticadora necessária para aceder à informação da api
const autenticador = "Esturbilho";

// Elementos do html
var idTextSearch, idSearchButton, idNearbyButton, idBottomSection, idSubTitulo;
var evaluator;
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
    evaluator = new XPathEvaluator();

    idTextSearch = $("textSearch");
    idSearchButton = $("searchButton");
    idNearbyButton = $("nearbyButton");
    idBottomSection = $("bottom");
    idSubTitulo = $("subTitulo");

    idSearchButton.onclick = function () {
        sendRequest("search", idTextSearch.value, undefined);
    }

    idNearbyButton.onclick = function () {
        sendRequest("nearby", undefined, undefined);
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
    switch (service) {
        case "search":
            url = "http://api.geonames.org/" + service + "?name=" +
                key1 + "&username=" + autenticador;
            break;
        case "findNearbyPOIsOSM":
            url = "http://api.geonames.org/" + service +
                "?lat=" + key1 + "&lng=" + key2 + "&username=" + autenticador;
            break;
        case "nearby":
            url = "http://ip-api.com/xml";
            break;
    }
    console.log(url);
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            idTextSearch.value = "";
            var divTexto = document.createElement("div");
            switch (service) {
                case "search":
                    idSubTitulo.innerHTML = "Resultados da pesquisa para: " + key1;
                    checkCoords(tratarDadosXML(xmlhttp.responseText));
                    break;
                case "findNearbyPOIsOSM":
                    showData(tratarDadosXML(xmlhttp.responseText));
                    break;
                case "nearby":
                    showNearby(tratarDadosXML(xmlhttp.responseText));
                    break;
            }
            idBottomSection.appendChild(divTexto);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function checkCoords(DOMDoc) {
    if (navigator.userAgent.indexOf('NET') == -1) { // verifica se se trata de um browser diferente do IE
        var latitude = evaluator.evaluate("//lat/child::text()", DOMDoc, null,
            XPathResult.STRING_TYPE, null);
        console.log(latitude.stringValue);
        var longitude = evaluator.evaluate("//lng/child::text()", DOMDoc, null,
            XPathResult.STRING_TYPE, null);
        console.log(longitude.stringValue);
        sendRequest("findNearbyPOIsOSM", latitude.stringValue, longitude.stringValue);
    } else {

    }
}

function showData(DOMDoc) {
    if (navigator.userAgent.indexOf('NET') == -1) { // verifica se se trata de um browser diferente do IE

    } else {

    }
}

function showNearby(DOMDoc) {
    if (navigator.userAgent.indexOf('NET') == -1) { // verifica se se trata de um browser diferente do IE
        var latitude = evaluator.evaluate("//lat/child::text()", DOMDoc, null,
            XPathResult.STRING_TYPE, null);
        console.log(latitude.stringValue);
        var longitude = evaluator.evaluate("//lon/child::text()", DOMDoc, null,
            XPathResult.STRING_TYPE, null);
        console.log(longitude.stringValue);
        sendRequest("findNearbyPOIsOSM", latitude.stringValue, longitude.stringValue);
    } else {

    }
}

function newContent(){
    var linha = document.createElement("div");
    var left = document.createElement("div");
    var center = document.createElement("div");
    var right = document.createElement("div");
    linha.appendChild(left);
    linha.appendChild(center);
    linha.appendChild(right);
    idBottomSection.appendChild(linha);
    return [left, center, right];
}