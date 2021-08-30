import * as rngService from "../../services/rngService";
import MultivariateNormal from "multivariate-normal";

export class Stats {
  public iq: string = "";
  public looks: string = "";
  public mmr: string = "";
  public salary: string = "";
  public length: string = "";
  public height: string = "";
  public weight: string = "";

  constructor() {
    const sample: number[] = this.generateSample();

    this.setIQ();
    this.setLooks();
    this.setMMR();
    this.setSalary();
    this.setLength();
    this.setHeight(sample);
    this.setWeight(sample);
  }

  private setIQ(): void {
    this.iq = rngService.normalDistribution(100, 100 / 3).toString();
  }

  private setLooks(): void {
    this.looks = `${rngService.normalDistribution(5, 5 / 3)}/10`;
  }

  private setMMR(): void {
    this.mmr = rngService.normalDistribution(5000, 5000 / 3, 1, true).toString();
  }

  private setSalary(): void {
    this.salary = rngService
      .logNormalDistribution(1, 1, 50000)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  private setLength(): void {
    const randomInches = rngService.normalDistribution(6, 6 / 3, 1, true);
    this.length = `${randomInches} in (${Math.round(randomInches * 2.54)} cm)`;
  }

  private setHeight(sample: number[]): void {
    const height = Math.round(sample[0]);
    const inches = Math.round(height / 2.54);

    this.height = `${Math.floor(inches / 12)}'${inches % 12}" (${height} cm)`;
  }

  private setWeight(sample): void {
    const weight = Math.round(sample[1]);
    this.weight = `${Math.round(weight * 2.205)} lb (${weight} kg)`;
  }

  private generateSample(): number[] {
    const meanVector = [170, 70];

    const covarianceMatrix = [
      [450, 370],
      [370, 350],
    ];

    return MultivariateNormal(meanVector, covarianceMatrix).sample();
  }
}
