import "bootstrap";
import "./filme-listagem.css";
import { FilmeService } from "../../services/filme.service";
import { Filme } from "../../models/listagem-filme";
import { LocalStorageService } from "../../services/local-storage.service";
import { HistoricoUsuario } from "../../models/historico-usuario";

class FilmeListagem {
  pnlFilmes: HTMLDivElement;
  lblEmAlta: HTMLHeadingElement;
  lblFavoritos: HTMLHeadingElement;
  filmeService = new FilmeService();
  localStorageService: LocalStorageService;
  favoritos: HistoricoUsuario;

  constructor() {
    this.filmeService = new FilmeService();
    
    this.localStorageService = new LocalStorageService();
    this.favoritos = this.localStorageService.carregarDados();

    this.registrarElementos();
    this.registrarEventos();

    this.selecionarFilmesEmAlta();
  }

  private registrarElementos() {
    this.pnlFilmes = document.getElementById('pnlFilmes') as HTMLDivElement;
    this.lblEmAlta = document.getElementById('lblEmAlta') as HTMLHeadingElement;
    this.lblFavoritos = document.getElementById('lblFavoritos') as HTMLHeadingElement;
  }

  private registrarEventos() {
    const ids = this.favoritos.filmes_ids;
    console.log(this.favoritos);
    this.lblEmAlta.addEventListener('click', () => this.selecionarFilmesEmAlta());
    this.lblFavoritos.addEventListener('click', () => {this.selecionarFilmesFavoritos(ids)});
  }

  private gerarTabelaFilmes(filmes: Filme[]) {

    let filmesInnerHtml: string = "";

    for (let filme of filmes) {
      const filmeHtml: string =
        `<div class="col-6 col-md-4 col-lg-2">
          <div class="d-grid gap-2 text-center">
            <img
              src="https://image.tmdb.org/t/p/original${filme.poster}"
              class="img-fluid rounded-3"
            />
            <a href="detalhes.html?id=${filme.id}" class="fs-5 link-warning text-decoration-none"
              >${filme.titulo}</a
            >
          </div>
        </div>`;

      filmesInnerHtml += filmeHtml;
    }

    this.pnlFilmes.innerHTML = filmesInnerHtml;
  }

  private selecionarFilmesEmAlta() {
    this.filmeService.selecionarFilmes()
      .then((filmes) => this.gerarTabelaFilmes(filmes));
  }

  private selecionarFilmesFavoritos(ids: number[]) {
    this.filmeService.selecionarFilmesPorIds(ids)
      .then((filmes) => this.gerarTabelaFilmes(filmes));
  }

}

window.addEventListener("load", () => new FilmeListagem());