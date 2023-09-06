import { Filme } from "../models/filme";
import { API_KEY } from "../../secrets";

export type Genero =   {
    id: number,
    nome: string
    };

export class FilmeService {

    generos: Genero[] = [];

    constructor() {
        this.selecionarGeneros()
        .then((obj: Genero[]): Genero[] => this.carregarGeneros(obj));
    }

    carregarGeneros(generos: Genero[]): Genero[] {
        this.generos = generos;
        return generos;
    }

    selecionarFilmePorId(id: number): Promise<Filme> {
        const url = `https://api.themoviedb.org/3/movie/${id}?language=pt-BR`;

        let filme: Filme;

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<any> => this.processarResposta(res))
            .then((obj: any): Filme => filme = this.mapearFilme(obj))
            .then(() => this.selecionarTrailer(filme))
            .then(() => filme);
    }

    selecionarFilmes(): Promise<any[]> {
            const url = "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1";

            return fetch(url, this.obterHeaderAutorizacao())
                .then((res: Response): Promise<Filme> => this.processarResposta(res))
                .then((obj: any): Promise<Filme[]> => this.mapearListaFilmes(obj.results));
    }

    selecionarGeneros(): Promise<Genero[]> {
        const url = "https://api.themoviedb.org/3/genre/movie/list?language=pt-BR";

        return fetch(url, this.obterHeaderAutorizacao())
            .then((res: Response): Promise<any> => this.processarResposta(res))
            .then((obj: any): Genero[] => this.mapearGeneros(obj));
}

    selecionarTrailer(filme: Filme): Promise<Filme> {
        const url = `https://api.themoviedb.org/3/movie/${filme.id}/videos?language=pt-BR`;

            return fetch(url, this.obterHeaderAutorizacao())
                .then((res: Response): Promise<any> => this.processarResposta(res))
                .then((obj: any): string => this.mapearTrailer(obj.results))
                .then((obj: string): string => filme.trailer = obj)
                .then((): Filme => filme);
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

        throw new Error('Filme não encontrado');
    }

    mapearFilme(obj: any): Filme {
        const apiGeneros: any[] = obj.genres;

        return {
            id: obj.id,
            titulo: obj.title,
            poster: obj.poster_path,
            votos: obj.vote_count,
            data: obj.release_date,
            trailer:  "",
            descricao: obj.overview,
            generos: apiGeneros.map(g => g.name)
        }
    }

    mapearTrailer(obj: any): string {
        const trailer = obj[obj.length - 1]?.key; 
        return trailer== null ? "" : trailer;
    }

    mapearGeneros(obj: any): Genero[] {
        const generos: Genero[] = [];
        const apiGeneros: any[] = obj.genres;
        apiGeneros.forEach(g => generos.push({id: g.id, nome: g.nome}));
        return generos;
    }

    mapearListaFilmes(objetos: any[]): Promise<Filme[]> {
        const filmes = objetos.map(obj => {
            let filme: Filme;

            return this.selecionarFilmePorId(obj.id)
            .then((obj: Filme) => filme = obj)
            .then((filme) => this.selecionarTrailer(filme))
            .then(() => filme);
        });

        return Promise.all(filmes);
    }

    obterGenero(id: number): string {
        return this.generos?.find(g => g.id == id)?.nome ?? "";
    }

}