import { HistoricoUsuario } from "../models/historico-usuario";


export class LocalStorageService {
  private endereco: string = 'gerenciador_cinema-ts:historico@1.0.0';

  salvarDados(dados: HistoricoUsuario): void {
    const jsonString = JSON.stringify(dados);

    localStorage.setItem(this.endereco, jsonString);
  }

  carregarDados(): HistoricoUsuario {
    const dadosJson = localStorage.getItem(this.endereco);

    if (dadosJson)
      return JSON.parse(dadosJson) as HistoricoUsuario;

    return new HistoricoUsuario();
  }
}