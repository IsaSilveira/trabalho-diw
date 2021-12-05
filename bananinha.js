const inputPesquisar = $('#inputPesquisa');
const form = $('.pesquisaRepositorio form');

form.on('submit',
    async function searchReposUser(e) {
        e.preventDefault();

        if (inputPesquisar.val()) {
            let xhrhttp = new XMLHttpRequest();

            xhrhttp.onload = function() {
                if (this.status === 200) {
                    const repos = JSON.parse(this.responseText);
                    reposSearch(repos);
                } else
                    alert(`Usuário não encontrado`);
            }

            xhrhttp.onerror = function() {
                alert(`Erro na requisição dos dados \nCódigo: ${this.status} - ${this.statusText}`);
            }

            xhrhttp.open('GET', `https://api.github.com/users/${consertarCaracteres(inputPesquisar.val())}/repos`);
            xhrhttp.send();
        }
    }
);

function consertarCaracteres(nome) {
    const name = nome.split(" ").join("");
    name.toLowerCase();

    return name;
}

async function reposSearch(infos) {
    const lista = infos.map(function(item) {
        return {
            name: item.name,
            description: item.description,
            html_url: item.html_url,
            created_at: item.created_at,
            updated_at: item.updated_at,
            visibility: item.visibility,
            size: item.size,
            login: item.owner.login,
            avatar: item.owner.avatar_url,
            perfil_link: item.owner.html_url
        }
    });

    //Função que cria a lista de repositórios
    criarLista(lista);
}

function criarLista(infos) {
    const perfil = document.querySelector('.content-list-container');

    // Ao iniciar uma pesquisa, a div 'perfil' é limpa
    perfil.innerHTML = "";

    // Criar uma div pra cada resultado da pesquisa
    const div = document.createElement('div');
    div.className = 'resultPerfil';

    // Criar elemento para comportar a imagem de cada usuário
    const img = document.createElement('img');
    img.src = `${infos[0].avatar}`;

    // Criar elemento para comportar o nome de cada usuário
    const namePerfil = document.createElement('a');
    namePerfil.setAttribute('href', infos[0].perfil_link);
    namePerfil.setAttribute('target', '_blank');
    namePerfil.setAttribute('title', 'Nome do usuário');
    namePerfil.appendChild(document.createTextNode(infos[0].login));

    // Atribuição dos elementos 'img' e 'namePerfil' à uma div
    div.appendChild(img);
    div.appendChild(namePerfil);
    perfil.appendChild(div);

    // Criação do elemento ul para armazenar as li's
    const ul = document.createElement('ul');
    ul.id = 'reposList';

    // Atribuição da lista à div
    perfil.appendChild(ul);

    for (const item of infos) {
        // Criar elemento para comportar o título do repositório
        const nameRepos = document.createElement('h3');
        nameRepos.appendChild(document.createTextNode(item.name));

        // Criar uma div para comportar o nome e a visibilidade do repositório
        const divHeader = document.createElement('div');
        divHeader.className = 'reposHeader';
        divHeader.appendChild(nameRepos);

        // Criar elemento 'created_at'
        const created_at = document.createElement('span');
        created_at.innerHTML = '<i class="fas fa-star"></i>';
        created_at.appendChild(document.createTextNode(arrumaData(item.created_at)));

        // Criar elemento 'updated_at'
        const updated_at = document.createElement('span');
        updated_at.innerHTML = '<i class="fas fa-cloud-upload-alt"></i>';
        updated_at.appendChild(document.createTextNode(arrumaData(item.updated_at)));

        // Criar uma div para comportar o a data de criação, a data do último update e o tamanho do repositório
        const divInfos = document.createElement('div');
        divInfos.className = 'reposInfos';
        divInfos.appendChild(created_at);
        divInfos.appendChild(updated_at);

        // Criar elemento para comportar a descrição do repositório
        const descriptionEl = document.createElement('p');
        if (item.description == null)
            descriptionEl.innerText = "";
        else
            descriptionEl.appendChild(document.createTextNode(item.description));

        // Criação do elemento a
        const itemLink = document.createElement('a');
        itemLink.setAttribute('href', item.html_url);
        itemLink.setAttribute('target', '_blank');
        itemLink.className = 'itemLink';

        // Criação do elemento li
        const itemEl = document.createElement('li');
        itemEl.setAttribute('title', `${item.name}`);
        itemEl.className = 'itemList';

        // Atribuição das li's ao ul
        itemLink.appendChild(divHeader);
        itemLink.appendChild(divInfos);
        itemLink.appendChild(descriptionEl);
        itemEl.appendChild(itemLink);
        ul.appendChild(itemEl);
    }
}


function apiDados() {
    //Calcula o ano
    document.querySelector('#anoCpyright').innerHTML = new Date().getFullYear();

    let xhr = new XMLHttpRequest();

    xhr.onload = function() {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            perfil(data);
            repositorios(data);
            linkFooter(data);
        } else
            alert(`Erro código: ${this.status}`);
    }

    xhr.onerror = function() {
        alert(`Erro na requisição dos dados \nCódigo: ${this.status} - ${this.statusText}`);
    }

    xhr.open('GET', 'https://api.github.com/users/IsaSilveira');
    xhr.send();
}

function perfil(data) {
    $('#perfil').append(`<!--Imagem do perfil-->
                        <img src="${data.avatar_url}" id="avatar_img" title="Foto de Perfil">

                        <!--Texto e Redes do perfil-->
                        <div class="infosPerfil">
                            <!--Texto-->
                            <div class="texto_perfil">
                                <a href="${data.html_url}" target="_blank" title="Perfil no GitHub">${data.name}</a>
                                <p class="bio" title="Biografia">${data.bio}</p>
                            </div>

                            <div class="infos">
                                <div class="linha-1">
                                    <div id="location">
                                        <span><i class="fas fa-map-marker-alt"></i> Localização</span>
                                        : ${data.location}
                                    </div>

                                    <div id="created_at">
                                        <span><i class="fas fa-user"></i> Entrou</span>
                                        : ${arrumaData(data.created_at)}
                                    </div>
                                </div>

                                <div class="linha-2">
                                    <div id="public_repos">
                                        <span><i class="fab fa-github"></i> Repositórios</span>
                                        : ${data.public_repos}
                                    </div>

                                    <div id="email">
                                        <span><i class="fas fa-envelope"></i> Email</span>
                                        : isamsilveira16@gmail.com
                                    </div>
                                </div>
                            </div>
                            <a class="linkPerfil" href="${data.html_url}" target="_blank"><button id="btn-perfil" title="Acessar perfil no GitHub">Carregar perfil</button></a>
                        </div>`);
}

async function repositorios(data) {
    const api = async() => {
        const response = await fetch(`https://api.github.com/users/IsaSilveira/repos`, { method: "GET" });
        const repos = await response.json();

        return repos;
    }

    const api_data = await api();

    const lista = api_data.map(function(item) {
        return {
            name: item.name,
            created_at: item.created_at,
            updated_at: item.updated_at,
            description: item.description,
            html_url: item.html_url,
            location: item.location,
            twitter_username: item.twitter_username,
            public_repos: item.public_repos,
            visibility: item.visibility,
            size: item.size,
        }
    });

    for (var i = 0; i < lista.length; i++) {
        $('.info_repositorio').append(`<a href="${lista[i].html_url}" class="reposContent" title="${lista[i].name}">
                                            <div class="reposTitle">
                                                <h3 title="${lista[i].name}">${lista[i].name}</h3>
                                            </div>
                                            <div class="text_repositorio">
                                                <p title="Descrição">${lista[i].description}</p>
                                                <div class="reposDates">
                                                    <span title="Data de criação"><i class="fas fa-star"></i> ${arrumaData(lista[i].created_at)}</span>
                                                    <span title="Última Atualização"><i class="fas fa-cloud-upload-alt"></i> ${arrumaData(lista[i].updated_at)}</span>
                                                    
                                                </div>
                                            </div>
                                        </a>`);

    }
}

function linkFooter(data) {
    // Set the url to GitHub perfil
    const linkGitHub = document.getElementById('gitHub');
    linkGitHub.setAttribute('href', `${data.html_url}`);

    // Set the url to Twitter perfil
    const linkTwitter = document.getElementById('twitter');
    linkTwitter.setAttribute('href', `https://www.twitter.com/${data.twitter_username}`);
}

function arrumaData(data) {
    data = data.substr(0, data.indexOf("T"));
    var date = new Date(data);

    var dataFormatada = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    return dataFormatada;
}