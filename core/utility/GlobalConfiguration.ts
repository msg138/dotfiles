import path from 'node:path';

interface FirewallSecurity {
    ips: Array<string>;
}

interface GlobalConfig {
    static: {
        baseDirectory: string;
        hostname: string;
    };
    internals: Array<string>;
    ports: Record<string, number>;
    security: Record<string, FirewallSecurity>;
}

const GlobalConfiguration: GlobalConfig = {
    static: {
        baseDirectory: path.dirname(path.resolve(__dirname, '../package.json')),
        hostname: 'meow.kaspyre.com',
    },
    ports: {
        webhook: 8900,
        ssh: 83,
    },
    internals: [
        '192.168.50.0/24',
    ],
    security: {
        ssh: {
            ips: [
                '192.168.50.0/24',
            ],
        },
    },
};

export default GlobalConfiguration;