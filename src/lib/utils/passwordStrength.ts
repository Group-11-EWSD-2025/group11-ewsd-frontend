export type PasswordStrength = {
  score: number;
  color: string;
};

export const checkPasswordStrength = (password: string): PasswordStrength => {
  // Return initial state for empty password
  if (!password) {
    return {
      score: 0,
      color: "#EF4444",
    };
  }

  let score = 0;

  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1; // Has uppercase
  if (/[a-z]/.test(password)) score += 1; // Has lowercase
  if (/[0-9]/.test(password)) score += 1; // Has number
  if (/[^A-Za-z0-9]/.test(password)) score += 1; // Has special char

  // Map score to strength levels and colors
  let color: string;
  if (score <= 1)
    color = "#EF4444"; // Too weak - Red
  else if (score <= 2)
    color = "#F97316"; // Weak - Orange
  else if (score <= 4)
    color = "#EAB308"; // Medium - Yellow
  else color = "var(--color-chart-2)"; // Strong - Green

  return {
    score,
    color,
  };
};
