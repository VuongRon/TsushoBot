import MultivariateNormal from "multivariate-normal";
import { normalDistribution, logNormalDistribution } from "../../services/rngService";

class Stats {
  private _iq: number = 0;
  private _looks: number = 0;
  private _mmr: number = 0;
  private salary: number = 0;
  private length: number = 0;
  private height: number = 0;
  private weight: number = 0;

  // allows for construction of a new Stats object, with the option to initialize all values to random values
  constructor(shouldRandomize: boolean = false) {
    if (shouldRandomize) {
      // randomizes all the values
      this.randomize();
    }
  }

  public get iq(): number {
    return this._iq;
  }
  public get looks(): number {
    return this._looks;
  }
  public get mmr(): number {
    return this._mmr;
  }

  public randomize(): void {
    const sample = this.generateSample();

    this._iq = normalDistribution(100, 100 / 3);
    this._looks = normalDistribution(5, 5 / 3);
    this._mmr = normalDistribution(5000, 5000 / 3, 1, true);
    this.salary = logNormalDistribution(1, 1, 50000);
    this.length = normalDistribution(6, 6 / 3, 1, true);

    this.height = Math.round(sample[0]);
    this.weight = Math.round(sample[1]);
  }

  public generateSample(): number[] {
    const meanVector: [number, number] = [170, 70];

    const covarianceMatrix: [number, number][] = [
      [450, 370],
      [370, 350],
    ];

    const distribution: number[] = MultivariateNormal(meanVector, covarianceMatrix).sample();

    return distribution;
  }

  public lengthFormatted(): string {
    return `${this.length} in (${Math.round(this.length * 2.54)} cm)`;
  }

  public heightFormatted(): string {
    const inches: number = Math.round(this.height / 2.54);
    const height: string = `${Math.floor(inches / 12)}'${inches % 12}" (${this.height} cm)`;

    return height;
  }

  public weightFormatted(): string {
    return `${Math.round(this.weight * 2.205)} lb (${this.weight} kg)`;
  }

  public salaryFormatted(): string {
    return this.salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export { Stats };
