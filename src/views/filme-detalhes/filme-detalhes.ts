import { CreditosFilme } from "../../models/creditos-filme";
import { DetalhesFilme } from "../../models/detalhes-filme";
import { HistoricoUsuario } from "../../models/historico-usuario";
import { TrailerFilme } from "../../models/trailer-filme";
import { FilmeService } from "../../services/filme.service";
import { LocalStorageService } from "../../services/local-storage.service";
import "./filme-detalhes.css";

export class FilmeDetalhes {
  pnlCabecalho: HTMLDivElement;
  pnlTrailer: HTMLDivElement;
  pnlGeneros: HTMLDivElement;
  pnlPoster: HTMLDivElement;
  pnlCreditos: HTMLDivElement;
  lblDescricao: HTMLParagraphElement;
  filmeService = new FilmeService();
  localStorageService: LocalStorageService;
  favoritos: HistoricoUsuario;
  filme_id: number;

  constructor() {
    this.filmeService = new FilmeService();
    this.localStorageService = new LocalStorageService();

    this.favoritos = this.localStorageService.carregarDados();

    this.registrarElementos();

    const url = new URLSearchParams(window.location.search);
    const id: number = parseInt(url.get('id') as string);
    this.filme_id = id;

    this.gerarConteudo(this.filme_id);
  }

  private gerarConteudo(id: number): void {
    this.filmeService.selecionarDetalhesFilmePorId(id)
      .then((obj: DetalhesFilme) => this.gerarDetalhesFilme(obj));

    this.filmeService.selecionarCreditosFilmePorId(id)
      .then((obj: CreditosFilme) => this.gerarCreditos(obj));

    this.filmeService.selecionarTrailerPorId(id)
      .then((obj: TrailerFilme) => this.gerarTrailer(obj));
  }

  private registrarElementos() {
    this.pnlCabecalho = document.getElementById('pnlCabecalho') as HTMLDivElement;
    this.pnlTrailer = document.getElementById('pnlTrailer') as HTMLDivElement;
    this.pnlGeneros = document.getElementById('pnlGeneros') as HTMLDivElement;
    this.pnlPoster = document.getElementById('pnlPoster') as HTMLDivElement;
    this.pnlCreditos = document.getElementById('pnlCreditos') as HTMLDivElement;
    this.lblDescricao = document.getElementById('lblDescricao') as HTMLParagraphElement;
  }

  private gerarDetalhesFilme(filme: DetalhesFilme) {
    this.gerarCabecalho(filme);
    this.gerarPoster(filme);
    this.gerarGenero(filme);

    this.lblDescricao.textContent = filme.descricao;
    this.atualizarIconFavorito();
  }

  private gerarCabecalho(filme: DetalhesFilme) {
    const cabecalhoInnerHtml: string =
      `<div class="d-flex align-items-center">
        <h1 class="text-warning">${filme.titulo}
          <p class="d-block fs-3 text-light" id="dataLancamento">${filme.data.split('-')[0]}</p>
        </h1>
        <div class="ms-auto text-end">
          <p class="text-light">${Math.round(filme.nota * 100) / 100} / 10</p>
          <p class="text-light">${filme.votos} Votos</p>
          <i id="lblFavorito" class="bi bi-heart fs-2 text-warning" role="button"></i>
        </div>
      </div>`;

    this.pnlCabecalho.innerHTML = cabecalhoInnerHtml;

    document.getElementById('lblFavorito')
      ?.addEventListener('click', () => {this.atualizarFavoritos()})
  }

  private atualizarFavoritos(): void {
    if(this.favoritos.filmes_ids.includes(this.filme_id)) {
      this.favoritos.filmes_ids = this.favoritos.filmes_ids
        .filter(f => f != this.filme_id);
    }

    else {
      this.favoritos.filmes_ids.push(this.filme_id);
    }

    this.localStorageService.salvarDados(this.favoritos);
    this.atualizarIconFavorito();
  }

  private atualizarIconFavorito(): void {
    const lblFavorito = document.getElementById('lblFavorito') as HTMLElement; 
    if(this.favoritos.filmes_ids.includes(this.filme_id)) {
      lblFavorito.className = "bi bi-heart-fill fs-2 text-warning";
    }

    else {
      lblFavorito.className = "bi bi-heart fs-2 text-light";
    }
  }

  private gerarTrailer(trailer: TrailerFilme) {
    const trailerInnerHtml: string =
      ` <iframe
          class="rounded-3"
          id="iframeTrailer"
          src="https://www.youtube.com/embed/${trailer.trailer_caminho}/"
          frameborder="0"
          allowfullscreen
        ></iframe>`;

    this.pnlTrailer.innerHTML = trailerInnerHtml;
  }

  private gerarPoster(filme: DetalhesFilme) {
    const posterInnerHtml: string =
      `<img
        src="https://image.tmdb.org/t/p/original${filme.poster}"
        class="img-fluid rounded-3"
        alt=""
      />`;

    this.pnlPoster.innerHTML = posterInnerHtml;
  }

  private gerarCreditos(creditos: CreditosFilme) {
    let autorInnerHtml: string =
      `<div class="row border-bottom border-light">
        <p class="col my-auto py-2 fw-bold align-text-center text-light ml-auto">Diretor</p>
        <p class="col my-auto py-2 align-text-center text-light ml-auto">${creditos.diretor}</p>
      </div>`;

    let escritoresTexto = "" + creditos.escritores[0];
    for (let i = 1; i < creditos.escritores.length; i++) {
      escritoresTexto += " ° " + creditos.escritores[i];
    }

    let escritoresHmtl: string =
      `<div class="row border-bottom border-light">
        <p class="col my-auto py-2 fw-bold align-text-center text-light ml-auto">Escritores</p>
        <p class="col my-auto py-2 align-text-center text-light ml-auto">${escritoresTexto}</p>
      </div>`;

    let atoresTexto = "" + creditos.atores[0];
    for (let i = 1; i < creditos.atores.length; i++) {
      atoresTexto += " ° " + creditos.atores[i];
    }

    let atoresHmtl: string =
      `<div class="row">
        <p class="col my-auto py-2 fw-bold align-text-center text-light ml-auto">Atores</p>
        <p class="col my-auto py-2 align-text-center text-light ml-auto">${atoresTexto}</p>
      </div>`;

    const creditosInnerHtml: string = autorInnerHtml;

    this.pnlCreditos.innerHTML = creditosInnerHtml + escritoresHmtl + atoresHmtl;
  }

  private gerarGenero(filme: DetalhesFilme) {
    let generosInnerHtml: string = "";
    for (let genero of filme.generos) {
      generosInnerHtml +=
        `<span class="badge rounded-pill fs-5 px-4 py-2 bg-warning text-dark"
    >${genero}</span>`;
    }
    this.pnlGeneros.innerHTML = generosInnerHtml;
  }
}

window.addEventListener("load", () => new FilmeDetalhes());