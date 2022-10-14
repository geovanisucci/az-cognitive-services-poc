async function postEmitirNFe(codigo_venda){

    const response = await fetch(BASE_URL_FATURAMENTO + "emitir-nfe", {
        method: 'POST',
        body: buildBodyEmissaoNFe("4a700168-2254-460d-b26e-7dcbc25ec512", codigo_venda.replace(/\D/g,'')), // string or object
        headers: {
          'Content-Type': 'application/json'
        }
      });

      //const myJson = await response.json(); //extract JSON from the http response

}

function buildBodyEmissaoNFe(id_empresa, codigo_venda){

    const obj = {id_empresa: id_empresa, numero_venda: codigo_venda};

    return JSON.stringify(obj);
}
 