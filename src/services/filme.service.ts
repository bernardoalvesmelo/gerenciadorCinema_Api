import { Filme } from "../models/listagem-filme";
import { API_KEY } from "../../secrets";
import { CreditosFilme } from "../models/creditos-filme";
import { TrailerFilme } from "../models/trailer-filme";
import { DetalhesFilme } from "../models/detalhes-filme";


export class FilmeService {

    public selecionarFilmePorId(id: number): Promise<Filme> {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<any> => this.processarResposta(res))
            .then((obj: any): Filme => this.mapearFilme(obj));
    }

    public selecionarDetalhesFilmePorId(id: number): Promise<DetalhesFilme> {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<any> => this.processarResposta(res))
            .then((obj: any): DetalhesFilme => this.mapearDetalhesFilme(obj));
    }

    
    public selecionarCreditosFilmePorId(id: number): Promise<CreditosFilme>{
        const url = `https://api.themoviedb.org/3/movie/${id}/credits?language=pt-BR`;

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<any> => this.processarResposta(res))
            .then((obj: any): CreditosFilme => this.mapearCreditosFilme(obj));
    }


    public selecionarFilmes(): Promise<any[]> {
            const url = "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1";

            return fetch(url, this.obterHeaderAutorizacao())
                .then((res: Response): Promise<Filme> => this.processarResposta(res))
                .then((obj: any): Promise<Filme[]> => this.mapearListaFilmes(obj.results));
    }

    public selecionarTrailerPorId(id: number): Promise<TrailerFilme> {
        const url = `https://api.themoviedb.org/3/movie/${id}/videos?language=pt-BR`;

            return fetch(url, this.obterHeaderAutorizacao())
                .then((res: Response): Promise<any> => this.processarResposta(res))
                .then((obj: any): TrailerFilme => this.mapearFilmeTrailer(obj.results));
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

    private processarResposta(resposta: Response): any {
        if (resposta.ok) {
            return resposta.json();
        }

        throw new Error('Filme não encontrado');
    }

    private mapearFilme(obj: any): Filme {
        return {
            id: obj.id,
            titulo: obj.title,
            poster: obj.poster_path
        }
    }

    private mapearDetalhesFilme(obj: any): DetalhesFilme {
        const apiGeneros: any[] = obj.genres;

        return {
            id: obj.id,
            titulo: obj.title,
            poster: obj.poster_path,
            votos: obj.vote_count,
            nota: obj.vote_average,
            data: obj.release_date,
            descricao: obj.overview,
            generos: apiGeneros.map(g => g.name)
        }
    }

    private mapearCreditosFilme(obj: any): CreditosFilme {
        return {
            diretor: [...(obj.crew)].find(c => c.known_for_department == "Directing")?.name,
            escritores: [...(obj.crew)].filter(c => c.known_for_department == "Writing")?.map(c => c.name),
            atores: [...(obj.crew)].filter(c => c.known_for_department == "Acting")?.map(c => c.name)
        }
    }

    private mapearFilmeTrailer(obj: any): TrailerFilme {
        const trailer = obj[obj.length - 1]?.key; 
        return {
            trailer_caminho: trailer == null ? "" : trailer
        };
    }

    private mapearListaFilmes(objetos: any[]): Promise<Filme[]> {
        const filmes = objetos.map(obj => this.selecionarFilmePorId(obj.id));
        return Promise.all(filmes);
    }
}