import { MaPieceJointe } from './piece-jointe';

export interface Courrier {
  id?: number;
  num_CA: string;
  num_origine: string;
  origine_courrier: string;
  date_signature: Date;
  objet_courrier: string;
  estVisibleDirection: boolean;
  remarqueDirection?: string;
  estVisibleService: boolean;
  reponseService?: string;
  etatCourrier: number;
  etat_traitement: string;
  serviceAffecte?: string;
  archive: boolean;
  piecesJointes?: MaPieceJointe[];
}

export interface PieceJointe {
  // Define the properties of PieceJointe here
  id?: number;
  nom: string;
  url: string;
}