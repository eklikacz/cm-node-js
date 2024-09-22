import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { ApplicationError } from '@common/domain/error';

interface ConfigSchema {
    type: string,
    require?: string[],
    properties?: {
        [key: string]: ConfigSchema,
    },
}

const camelToSnake = (camelCaseStr: string): string => camelCaseStr.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

export type EnvName = 'IS_DEBUG'
    |'APPLICATION_PORT'
    | 'APPLICATION_CONFIG_PATH'
    | 'MONGO_DB_CONNECTION_STRING';

export class EnvService {
  private static _instance: EnvService;
  private readonly envConfig: { [key: string]: string | number | boolean | undefined } = {};
  private readonly envKeys: string[];

  private constructor () {
    dotenv.config();
    this.envConfig = process.env;
    this.envKeys = Object.keys(this.envConfig);

    const applicationConfigPath = process.env?.APPLICATION_CONFIG_PATH;

    if (!applicationConfigPath) {
      throw new ApplicationError('Require application config path!');
    }

    const schemaFile = fs.readFileSync(applicationConfigPath, 'utf-8');
    const configSchema = yaml.load(schemaFile) as ConfigSchema;

    this.validateConfig(configSchema);
  }

  public getEnv<T> (key: EnvName, defaultValue?: T): string | number | boolean | null | T | undefined {
    return this.envConfig[key] ?? defaultValue;
  }

  // You can also use the Ajv module here (with codegen schema)
  private validateConfig (configSchema: ConfigSchema) {
    if (configSchema.type !== 'object') {
      throw new ApplicationError(`Incorrect primary type of config schema: ${configSchema.type}`);
    }

    const requires = configSchema.require ?? [];

    for (const key in configSchema.properties) {
      const envName = `${camelToSnake(key).toUpperCase()}`;
      const propertySchema = configSchema.properties[key];
      const isExist = this.envKeys.find(env => env.includes(envName)) !== undefined;

      if (!isExist && requires.includes(key)) {
        throw new ApplicationError(`Missing required field "${key}" in environment variables.`);
      }

      this.validateAndTransformProperty(key, propertySchema);
    }
  }

  private validateAndTransformProperty (property: string, schema: ConfigSchema) {
    let envName = `${camelToSnake(property).toUpperCase()}`;
    let envVar = this.envConfig?.[`${camelToSnake(property).toUpperCase()}`];

    if (schema.type === 'object' && schema.properties) {
      const requires = schema.require ?? [];
      for (const [key, value] of Object.entries(schema.properties)) {
        const configName = `${property.replace(/_/g, '.')}.${key}`;
        envName = `${camelToSnake(property).toUpperCase()}_${camelToSnake(key).toUpperCase()}`;
        const isExist = this.envKeys.find(env => env.includes(envName)) !== undefined;
        if (!isExist && requires.includes(key)) {
          throw new ApplicationError(`Missing required field "${configName}" in environment variables.`);
        }

        envVar = this.envConfig?.[envName];
        if (value.type === 'object' && schema.properties) {
          this.validateAndTransformProperty(configName, value);
        } else if (envVar && value.type === 'string') {
          this.envConfig[envName] = String(envVar);
        } else if (envVar && value.type === 'number') {
          this.envConfig[envName] = Number(envVar);
        } else if (envVar && value.type === 'boolean') {
          this.envConfig[envName] = Boolean(envVar);
        } else {
          throw new ApplicationError(`The specified type "${value.type}" is not supported.`);
        }
      }
    } else if (envVar && schema.type === 'string') {
      this.envConfig[envName] = String(envVar);
    } else if (envVar && schema.type === 'number') {
      this.envConfig[envName] = Number(envVar);
    } else if (envVar && schema.type === 'boolean') {
      this.envConfig[envName] = Boolean(envVar);
    } else {
      throw new ApplicationError(`The specified type "${schema.type}" is not supported.`);
    }
  }

  public static getEnv<T> (key: EnvName, defaultValue?: T): string | number | boolean | null | T | undefined {
    return EnvService.instance().getEnv(key, defaultValue);
  }

  public static instance (): EnvService {
    if (!EnvService._instance) {
      EnvService._instance = new EnvService();
    }

    return EnvService._instance;
  }
}
