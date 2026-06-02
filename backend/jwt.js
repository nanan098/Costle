const jose = require("jose");

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
const ENC_ALGORITHM = "A256GCM";

/**
 * Encrypt the hidden game state into a JWT token.
 * The token contains the price and allowed guess range plus the attempt counter.
 * @param {number} cena
 * @param {number} minYellow
 * @param {number} maxYellow
 * @param {number} attemptNumber
 * @returns {Promise<string>} Encrypted token
 */
async function szyfrujToken(cena, minYellow, maxYellow, attemptNumber) {
  const payload = { cena, minYellow, maxYellow, attemptNumber };
  const encryptedToken = await new jose.EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: ENC_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime("5m")
    .encrypt(ENCRYPTION_KEY);
  return encryptedToken;
}

/**
 * Decrypt the game token and return the stored state.
 * If the token is invalid or expired, an error is thrown.
 * @param {string} zaszyfrowanyTekst
 * @returns {Promise<{cena:number,minYellow:number,maxYellow:number,attemptNumber:number}>}
 */
async function odszyfrujToken(zaszyfrowanyTekst) {
  try {
    const { payload } = await jose.jwtDecrypt(
      zaszyfrowanyTekst,
      ENCRYPTION_KEY,
      {
        algorithms: ["dir"],
      },
    );

    const {
      cena,
      minYellow,
      maxYellow,
      attemptNumber: oldAttemptNumber = 0,
    } = payload;
    const attemptNumber = Number.isFinite(oldAttemptNumber)
      ? oldAttemptNumber + 1
      : 1;
    return { cena, minYellow, maxYellow, attemptNumber };
  } catch (error) {
    console.error("Błąd odszyfrowywania ceny:", error);
    throw new Error("Nie można odszyfrować ceny");
  }
}

exports.szyfrujToken = szyfrujToken;
exports.odszyfrujToken = odszyfrujToken;
