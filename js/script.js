$(document).ready(function () {
    history.pushState("", "", "/");
    if ($("#result").attr('name') == 'adicionado') {
        $(".alert-success").show();
        setTimeout(function () { $(".alert-success").hide(); }, 6000);
    }else{
        $(".alert-success").hide();
    }

    const resultado = document.getElementById("resultado");
    const conteudo = resultado.querySelector("span");
    

    if (conteudo !== null) {
        $(".alert-warning").hide();
        $("#titulo").show()
    } else {
        $(".alert-warning").show();
        $("#titulo").hide()
    }

})
function Ouvir(localizador){
let localizar = "audios" + localizador
const audio = document.getElementById(localizar);
audio.currentTime = 0.2;
audio.play()
}
function Stop(localizador){
let localizar = "audios" + localizador
const audio = document.getElementById(localizar);
audio.currentTime = 0.2;
audio.pause();
}