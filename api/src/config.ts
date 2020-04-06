export type Config = {
    env: 'prod' | 'stage' | 'dev',
};

type ConfigBundle = {
    production: Config,
    stage: Config,
    dev: Config,
};

const baseConfig: ConfigBundle = {
    production: {
        env: 'prod',
    },
    stage: {
        env: 'stage',
    },
    dev: {
        env: 'dev',
    },
};

export const establish_config = () => {
    const env = (process.env.NODE_ENV || 'stage') as unknown as keyof ConfigBundle;

    const matchedConfig = baseConfig[env];

    if (!matchedConfig) {
        throw new Error(`Invalid environment specified. (given: ${env}, expected: (${Object.keys(baseConfig).join(' | ')}))`);
    }

    return Object.assign({}, matchedConfig);
};
