require('dotenv').config();

/**
 * Common configuration 
 */
class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) { }

  /**
   * Get value of environment key's
   * @param key key of environment
   * @param throwOnMissing If it was true, it is required to run app
   * @returns The value of env
   */
  private getValue(key: string, throwOnMissing: boolean = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  /**
   * Check required key's are exist. If not, app does not run
   * @param keys List of required key's
   * @returns 
   */
  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  /**
   * Get Port
   * @returns Port value of service
   */
  public getPort(): number {
    return parseInt(this.getValue('SCRAPE_SERVICE_PORT', true));
  }

  /**
   * Production Mode
   * @returns true/false
   */
  public isProduction(): boolean {
    const mode = this.getValue('MODE', false);
    return mode != 'DEV';
  }

}

/**
 * An object of Configuration
 */
const configService = new ConfigService(process.env).ensureValues([
  'SCRAPE_SERVICE_PORT',
  'BASE_URI'
]);

export { configService };
