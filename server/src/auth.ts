// Confere a conta do jogador (token do Firebase) quando FIREBASE_PROJECT_ID estiver configurado.
// Retorna: uid (conta válida) · null (sem conferência: convidado aceito) · false (token inválido).
let admin: typeof import('firebase-admin') | null = null;
const PROJ = process.env.FIREBASE_PROJECT_ID || '';

export async function verificarToken(token: unknown): Promise<string | null | false> {
  if (!PROJ) return null;
  if (typeof token !== 'string' || token.length < 20) return false;
  try {
    if (!admin) {
      admin = (await import('firebase-admin')).default as unknown as typeof import('firebase-admin');
      if (!admin.apps.length) admin.initializeApp({ projectId: PROJ });
    }
    const d = await admin.auth().verifyIdToken(token);
    return d.uid;
  } catch { return false; }
}
