export function isValidCpf(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]+/g, '');

  // Verifica se o CPF tem 11 dígitos
  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Função para calcular o dígito verificador
  function calculateDigitVerifier(cpfSlice: string) {
    let sum = 0;
    let multiplier = cpfSlice.length + 1;

    for (const digit of cpfSlice) {
      sum += parseInt(digit) * multiplier--;
    }

    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  // Calcula o primeiro dígito verificador
  const firstVerifier = calculateDigitVerifier(cpf.substring(0, 9));
  if (firstVerifier !== parseInt(cpf[9])) return false;

  // Calcula o segundo dígito verificador
  const secondVerifier = calculateDigitVerifier(cpf.substring(0, 10));
  if (secondVerifier !== parseInt(cpf[10])) return false;

  return true;
}

export function removeCpfPunctuation(cpf: string): string {
  return cpf.replace(/[\.\-]/g, '');
}