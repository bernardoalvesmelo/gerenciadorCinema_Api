import "bootstrap";
import "./filme-listagem.css";
import { FilmeService } from "../../services/filme.service";
import { Filme } from "../../models/listagem-filme";

class FilmeListagem {
  pnlFilmes: HTMLDivElement;
  filmeService = new FilmeService();

  constructor() {
    this.filmeService = new FilmeService();

    this.registrarElementos();

    this.filmeService.selecionarFilmes()
      .then((filmes) => this.gerarTabelaFilmes(filmes));
  }

  private registrarElementos() {
    this.pnlFilmes = document.getElementById('pnlFilmes') as HTMLDivElement;
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
}

window.addEventListener("load", () => new FilmeListagem());