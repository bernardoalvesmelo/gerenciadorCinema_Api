import { Filme } from "../models/filme";
import { API_KEY } from "../../secrets";

export class FilmeService {

    selecionarFilmePorId(id: number): Promise<Filme> {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<any> => this.processarResposta(res))
            .then((obj: any): Filme => this.mapearFilme(obj));
    }

    selecionarFilmes(): Promise<any[]> {
        const url = "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1";

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<Filme> => this.processarResposta(res))
            .then((obj: any): Promise<Filme[]> => this.mapearListaFilmes(obj.results));
    }

    private obterHeaderAutorizacao() {
        return {
          method: "GET",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        };
      }

    processarResposta(resposta: Response): any {
        if (resposta.ok) {
            return resposta.json();
        }

        throw new Error('Pokemon não encontrado');
    }

    mapearFilme(obj: any): Filme {
        return {
            id: obj.id,
            titulo: obj.title,
            poster: obj.poster_path
        }
    }

    mapearListaFilmes(objetos: any[]): Promise<Filme[]> {
        const filmes = objetos.map(obj => {
            return this.selecionarFilmePorId(obj.id);
        });

        return Promise.all(filmes);
    }
}