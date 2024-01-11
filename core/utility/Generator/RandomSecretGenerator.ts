import {StringGenerator} from "./Generator";

interface RandomSecretGeneratorOptions {
    length: number;
}

class RandomSecretGenerator implements StringGenerator {
    private options: RandomSecretGeneratorOptions;

    constructor(options: RandomSecretGeneratorOptions) {
        this.options = options;
    }
    generateString(): string {
        const characterOptions: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-=_+[]{},.<>/?';
        let currentSecret = '';
        while (currentSecret.length < this.options.length) {
            currentSecret += characterOptions.charAt(Math.floor(characterOptions.length * Math.random()));
        }
        return currentSecret;
    }
}

export default RandomSecretGenerator;
