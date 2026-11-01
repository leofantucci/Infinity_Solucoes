import { describe, expect, it } from "vitest";
import { phoneDigits, waLink } from "@/lib/site-config";

describe("WhatsApp links", () => {
  it("adds Brazil code 55 to local numbers", () => {
    expect(phoneDigits("(18) 99815-0853")).toBe("5518998150853");
  });
  it("keeps numbers that already have the country code", () => {
    expect(phoneDigits("+55 18 99815-0853")).toBe("5518998150853");
  });
  it("builds the wa.me link with the encoded message", () => {
    expect(waLink("18998150853", "Olá")).toBe("https://wa.me/5518998150853?text=Ol%C3%A1");
  });
});
