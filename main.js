document.addEventListener("DOMContentLoaded", function () {
    // Navegação entre as seções
    const sections = document.querySelectorAll(".section");
    const navLinks = document.querySelectorAll(".sidebar ul li a");

    // Função para alternar entre as seções
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove("active");
            if (section.id === sectionId) {
                section.classList.add("active");
            }
        });

        // Atualizar o link ativo no menu
        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("data-section") === sectionId) {
                link.classList.add("active");
            }
        });
    }

    // Adicionar eventos de clique aos links do menu
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault(); // Evita o comportamento padrão do link
            const sectionId = this.getAttribute("data-section");
            showSection(sectionId);
        });
    });

    // Exibir a seção Dashboard por padrão
    showSection("dashboard");

    // Lógica para a seção de Clientes
    const formCliente = document.getElementById("form-cliente");
    const tabelaClientes = document.getElementById("tabela-clientes").querySelector("tbody");

    // Função para salvar clientes no localStorage
    function salvarClientesNoLocalStorage(clientes) {
        localStorage.setItem("clientes", JSON.stringify(clientes));
    }

    // Função para carregar clientes do localStorage
    function carregarClientesDoLocalStorage() {
        const clientesSalvos = localStorage.getItem("clientes");
        return clientesSalvos ? JSON.parse(clientesSalvos) : [];
    }

    // Função para adicionar um cliente à tabela e ao localStorage
    function adicionarCliente(nome, cpf, dataNascimento, valorPago, dataPagamento, formaPagamento, primeiroAtendimento, ultimoAtendimento) {
        const cliente = {
            nome,
            cpf,
            dataNascimento,
            valorPago,
            dataPagamento,
            formaPagamento,
            primeiroAtendimento,
            ultimoAtendimento
        };

        // Adicionar o cliente à tabela
        const novaLinha = document.createElement("tr");
        novaLinha.innerHTML = `
            <td>${nome}</td>
            <td>${cpf}</td>
            <td>${dataNascimento}</td>
            <td>R$ ${valorPago.toFixed(2)}</td>
            <td>${dataPagamento}</td>
            <td>${formaPagamento}</td>
            <td>${primeiroAtendimento}</td>
            <td>${ultimoAtendimento}</td>
            <td>
                <button onclick="editarCliente(this)">✏️</button>
                <button onclick="excluirCliente(this)">🗑️</button>
            </td>
        `;
        tabelaClientes.appendChild(novaLinha);

        // Adicionar o cliente ao localStorage
        const clientes = carregarClientesDoLocalStorage();
        clientes.push(cliente);
        salvarClientesNoLocalStorage(clientes);
    }

    // Função para editar um cliente
    window.editarCliente = function (botao) {
        const linha = botao.closest("tr");
        const celulas = linha.querySelectorAll("td");
        const nome = celulas[0].textContent;
        const cpf = celulas[1].textContent;
        const dataNascimento = celulas[2].textContent;
        const valorPago = parseFloat(celulas[3].textContent.replace("R$ ", ""));
        const dataPagamento = celulas[4].textContent;
        const formaPagamento = celulas[5].textContent;
        const primeiroAtendimento = celulas[6].textContent;
        const ultimoAtendimento = celulas[7].textContent;

        // Preencher o formulário com os dados do cliente
        document.getElementById("nome").value = nome;
        document.getElementById("cpf").value = cpf;
        document.getElementById("data-nascimento").value = dataNascimento;
        document.getElementById("valor-pago").value = valorPago;
        document.getElementById("data-pagamento").value = dataPagamento;
        document.getElementById("forma-pagamento").value = formaPagamento;
        document.getElementById("primeiro-atendimento").value = primeiroAtendimento;
        document.getElementById("ultimo-atendimento").value = ultimoAtendimento;

        // Remover o cliente do localStorage
        const clientes = carregarClientesDoLocalStorage();
        const clientesAtualizados = clientes.filter(cliente => cliente.cpf !== cpf);
        salvarClientesNoLocalStorage(clientesAtualizados);

        // Remover a linha da tabela
        linha.remove();
    };

    // Função para excluir um cliente
    window.excluirCliente = function (botao) {
        const linha = botao.closest("tr");
        const cpf = linha.querySelectorAll("td")[1].textContent;

        // Remover o cliente do localStorage
        const clientes = carregarClientesDoLocalStorage();
        const clientesAtualizados = clientes.filter(cliente => cliente.cpf !== cpf);
        salvarClientesNoLocalStorage(clientesAtualizados);

        // Remover a linha da tabela
        linha.remove();
    };

    // Adicionar evento de submit ao formulário
    formCliente.addEventListener("submit", function (e) {
        e.preventDefault(); // Impede o recarregamento da página

        // Capturar os valores do formulário
        const nome = document.getElementById("nome").value;
        const cpf = document.getElementById("cpf").value;
        const dataNascimento = document.getElementById("data-nascimento").value;
        const valorPago = parseFloat(document.getElementById("valor-pago").value);
        const dataPagamento = document.getElementById("data-pagamento").value;
        const formaPagamento = document.getElementById("forma-pagamento").value;
        const primeiroAtendimento = document.getElementById("primeiro-atendimento").value;
        const ultimoAtendimento = document.getElementById("ultimo-atendimento").value;

        // Verificar se todos os campos estão preenchidos
        if (!nome || !cpf || !dataNascimento || !valorPago || !dataPagamento || !formaPagamento || !primeiroAtendimento || !ultimoAtendimento) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // Adicionar o cliente à tabela e ao localStorage
        adicionarCliente(nome, cpf, dataNascimento, valorPago, dataPagamento, formaPagamento, primeiroAtendimento, ultimoAtendimento);

        // Limpar o formulário
        formCliente.reset();
    });

    // Carregar clientes do localStorage ao iniciar a página
    const clientes = carregarClientesDoLocalStorage();

    // Limpar a tabela antes de carregar os clientes
    tabelaClientes.innerHTML = "";

    // Adicionar cada cliente à tabela
    clientes.forEach(cliente => {
        adicionarCliente(
            cliente.nome,
            cliente.cpf,
            cliente.dataNascimento,
            cliente.valorPago,
            cliente.dataPagamento,
            cliente.formaPagamento,
            cliente.primeiroAtendimento,
            cliente.ultimoAtendimento
        );
    });
});