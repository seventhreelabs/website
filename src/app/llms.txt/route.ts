import { respondLlmsIndex } from "./respond";

export const revalidate = 3600;

/** llms.txt for the default language. */
export function GET() {
  return respondLlmsIndex();
}
