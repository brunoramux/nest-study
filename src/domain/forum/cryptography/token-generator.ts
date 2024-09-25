export abstract class TokenGenerator {
  abstract generate(payload: Record<string, unknown>): Promise<string>
}
