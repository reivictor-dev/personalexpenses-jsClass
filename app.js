class Despesa {

    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for (let i in this) {
            if (this[i] === undefined || this[i] === '' || this[i] === null) {
                return false
            }
        }
        return true
    }
}
class Bd {

    constructor() {
        let id = localStorage.getItem('id');

        if (id === null) {
            localStorage.setItem('id', 0);
        }
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(d) {
        let id = this.getProximoId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros() {
        //array de despesas
        let despesas = [];

        let id = localStorage.getItem('id');

        //recuperar todas as despesas cadastradas no localstorage
        for (let i = 1; i <= id; i++) {
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i)) //transformada de JSON para objeto literal

            //existe a possibilidade de haver indices que foram pulados/removidos
            //nestes casos nós vamos pular esses indices
            if (despesa === null) {
                continue
            }

            despesa.id = i
            despesas.push(despesa)
        }
        return despesas
    }

    pesquisar(despesa) {

        let despesasFiltradas = []

        despesasFiltradas = this.recuperarTodosRegistros()

        console.log(despesa)
        console.log(despesasFiltradas)
        //ano
        if (despesa.ano != '') {

            console.log('Filtro de ano')

            despesasFiltradas = despesasFiltradas.filter(d => d.ano === despesa.ano)
        }

        //mes
        if (despesa.mes != '') {
            console.log('Filtro de mes')

            despesasFiltradas = despesasFiltradas.filter(d => d.mes === despesa.mes)
        }

        //dia
        if (despesa.dia != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.dia === despesa.dia)
        }
        //tipo
        if (despesa.tipo != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo === despesa.tipo)
        }
        //descricao
        if (despesa.descricao != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao === despesa.descricao)
        }
        //valor
        if (despesa.valor != '') {
            despesasFiltradas = despesasFiltradas.filter(d => d.valor === despesa.valor)
        }

        return despesasFiltradas

    }
    remover(id){
        localStorage.removeItem(id)
    }
}

let bd = new Bd();

function cadastrarDespesa() {

    let ano = document.getElementById('ano');
    let mes = document.getElementById('mes');
    let dia = document.getElementById('dia');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);

    if (despesa.validarDados()) {

        bd.gravar(despesa);
        $('#modalRegistraDespesa').modal('show')

        //se o for gravado com sucesso, os valores setados serao apagados posteriormente \/ !
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''

    } else {

        $('#modalRegistraDespesa').modal('show')
        //mudando a cor do texto com a class danger
        let mudaClasse = document.getElementById('mudaClasse')
        mudaClasse.classList.replace('text-success', 'text-danger')

        let h5 = document.getElementById('modal-title')
        h5.innerText = 'Erro na inclusão do registro'

        //mudando o texto da div
        let alteraDiv = document.getElementById('alteraDiv')
        alteraDiv.innerText = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'

        //mudando a cor do button
        let Btn = document.getElementById('botao')
        Btn.innerHTML = 'Voltar e corrigir'
        Btn.classList.replace('btn-success', 'btn-danger')

    }
}

function carregaListaDespesas(despesas = [], filtro = false) {

    if (despesas.length === 0 && filtro === false) {
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    //percorrer o array despesas, listando cada despesa de forma dinamica
    despesas.forEach(function (d) {

        console.log(d)
        //criando a linha (tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas
        linha.insertCell(0).innerHTML = `${d.dia} / ${d.mes} / ${d.ano}`

        //ajustar o tipo
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Lazer'
                break
            case '4': d.tipo = 'Saúde'
                break
            case '5': d.tipo = 'Transporte'
                break
        }

        linha.insertCell(1).innerHTML = d.tipo

        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botao exclusão
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')

            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn);


    })
}

function pesquisarDespesas() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true);
}