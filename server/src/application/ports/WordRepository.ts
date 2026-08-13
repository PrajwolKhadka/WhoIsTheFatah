import { WordPair } from "../../domain/value-objects/WordPair";

export interface WordRepository {
  pickWordPair(exclude: Set<string>): WordPair;
}
