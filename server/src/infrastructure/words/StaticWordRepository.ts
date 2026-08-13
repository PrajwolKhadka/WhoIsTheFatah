import { WordPair } from "../../domain/value-objects/WordPair";
import { WordRepository } from "../../application/ports/WordRepository";
import { WORD_PAIRS } from "./wordBank";

export class StaticWordRepository implements WordRepository {
  pickWordPair(exclude: Set<string>): WordPair {
    const pool = WORD_PAIRS.filter((w) => !exclude.has(w.word));
    const source = pool.length > 0 ? pool : WORD_PAIRS;
    return source[Math.floor(Math.random() * source.length)];
  }
}
