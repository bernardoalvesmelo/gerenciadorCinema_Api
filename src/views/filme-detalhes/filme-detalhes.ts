import { Filme } from "../../models/filme";
import { FilmeService } from "../../services/filme.service";
import "./filme-detalhes.css";

export class DetalhesFilme {
  pnlCabecalho: HTMLDivElement;
  pnlTrailer: HTMLDivElement;
  pnlGeneros: HTMLDivElement;
  lblDescricao: HTMLParagraphElement;
  filmeService = new FilmeService();

  constructor() {
    this.filmeService = new FilmeService();

    this.registrarElementos();

    const url = new URLSearchParams(window.location.search);
    const id: number = parseInt(url.get('id') as string);

    this.filmeService.selecionarFilmePorId(id)
      .then((obj: Filme) => this.gerarConteudo(obj));
  }

  private registrarElementos() {
    this.pnlCabecalho = document.getElementById('pnlCabecalho') as HTMLDivElement;
    this.pnlTrailer = document.getElementById('pnlTrailer') as HTMLDivElement;
    this.pnlGeneros = document.getElementById('pnlGeneros') as HTMLDivElement;
    this.lblDescricao = document.getElementById('lblDescricao') as HTMLParagraphElement;
  }

  private gerarConteudo(filme: Filme) {
    this.gerarCabecalho(filme);
    this.gerarTrailer(filme);
    this.lblDescricao.textContent = filme.descricao;
    this.gerarGenero(filme);

  }

  private gerarCabecalho(filme: Filme) {
    const cabecalhoInnerHtml: string =
      `<div class="d-flex align-items-center">
        <h1 class="text-light">${filme.titulo}</h1>

        <div class="ms-auto text-end">
          <p class="text-light">${filme.votos} Votos</p>
          <i class="bi bi-heart fs-2 text-warning"></i>
        </div>
      </div>
    <small class="text-light" id="dataLancamento">Lançamento: ${filme.data}</small>`;

    this.pnlCabecalho.innerHTML = cabecalhoInnerHtml;
  }

  private gerarTrailer(filme: Filme) {
    const trailerInnerHtml: string =
      `<div class="col-lg-3">
      <img
        src="https://image.tmdb.org/t/p/original${filme.poster}"
        class="img-fluid rounded-3"
        alt=""
      />
    </div>
    <div class="col-lg">
      <div class="ratio ratio-21x9 h-100">
        <iframe
          class="rounded-3"
          id="iframeTrailer"
          src="https://www.youtube.com/embed/${filme.trailer}/"
          frameborder="0"
          allowfullscreen
        ></iframe>
      </div>
    </div>`;

    this.pnlTrailer.innerHTML = trailerInnerHtml;
  }

  private gerarGenero(filme: Filme) {
    let generosInnerHtml: string = "";
    for (let genero of filme.generos) {
      generosInnerHtml +=
        `<span class="badge rounded-pill fs-5 px-4 py-2 bg-warning text-dark"
    >${genero}</span>`;
    }
    this.pnlGeneros.innerHTML = generosInnerHtml;
  }
}

window.addEventListener("load", () => new DetalhesFilme());
