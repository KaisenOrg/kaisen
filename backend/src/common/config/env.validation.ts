type EnvInput = Record<string, unknown>;

function assertString(value: unknown, key: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Environment variable ${key} is required.`);
  }

  return value;
}

export function validateEnvironment(config: EnvInput): EnvInput {
  const port = Number(config.PORT ?? 3000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('Environment variable PORT must be a positive integer.');
  }

  if (config.GEMINI_API_KEY !== undefined) {
    assertString(config.GEMINI_API_KEY, 'GEMINI_API_KEY');
  }

  config.PORT = port;
  config.GEMINI_TEXT_MODEL = String(config.GEMINI_TEXT_MODEL ?? 'gemini-2.5-flash');
  config.GEMINI_IMAGE_MODEL = String(
    config.GEMINI_IMAGE_MODEL ?? 'gemini-2.0-flash-preview-image-generation',
  );
  config.DATA_FILE_PATH = String(config.DATA_FILE_PATH ?? './data/db.json');

  return config;
}
